import { buildRelayEvent, relayEvent, verifyMetaWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

const isEnabled = () => process.env.META_WEBHOOK_ENABLED?.trim().toLowerCase() === "true"

export function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get("hub.mode")
  const token = url.searchParams.get("hub.verify_token")
  const challenge = url.searchParams.get("hub.challenge")
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN?.trim() || ""

  if (!isEnabled() || !verifyToken) {
    return Response.json({ verified: false, error: "Meta webhook integration is disabled." }, { status: 503 })
  }

  if (mode === "subscribe" && challenge && token === verifyToken) {
    return new Response(challenge, {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }

  return Response.json({ verified: false, error: "verification_failed" }, { status: 403 })
}

export async function POST(request: Request) {
  const enabled = isEnabled()
  const appSecret = process.env.META_APP_SECRET?.trim() || ""

  // Fail closed when either the explicit flag or the provider signing secret is missing.
  if (!enabled || !appSecret) {
    return Response.json(
      { accepted: false, error: "Meta webhook integration is disabled." },
      { status: 503 },
    )
  }

  const rawBody = await request.text()
  const signatureHeader = request.headers.get("x-hub-signature-256")
  const verification = verifyMetaWebhook(rawBody, signatureHeader, appSecret)

  if (!verification.verified) {
    return Response.json(
      { accepted: false, error: "Webhook signature verification failed." },
      { status: 401 },
    )
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return Response.json({ accepted: false, error: "invalid_json" }, { status: 400 })
  }

  const event = buildRelayEvent({
    source: "meta",
    event: typeof payload.object === "string" ? payload.object : "webhook",
    externalId: typeof payload.object === "string" ? payload.object : undefined,
    payload,
    verified: verification.verified,
    meta: { signatureConfigured: true },
  })

  await relayEvent(event)
  return Response.json({ accepted: true })
}
