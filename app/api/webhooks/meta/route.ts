import { buildRelayEvent, relayEvent, verifyMetaWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

export function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get("hub.mode")
  const token = url.searchParams.get("hub.verify_token")
  const challenge = url.searchParams.get("hub.challenge")
  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN?.trim() || ""

  if (mode === "subscribe" && challenge && verifyToken && token === verifyToken) {
    return new Response(challenge, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    })
  }

  return Response.json(
    {
      verified: false,
      error: "verification_failed",
    },
    { status: 403 },
  )
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const appSecret = process.env.META_APP_SECRET?.trim() || ""
  const signatureHeader = request.headers.get("x-hub-signature-256")

  if (!appSecret && process.env.NODE_ENV === "production") {
    return Response.json(
      {
        accepted: false,
        error: "META_APP_SECRET is not configured.",
      },
      { status: 500 },
    )
  }

  const verification = appSecret
    ? verifyMetaWebhook(rawBody, signatureHeader, appSecret)
    : { verified: true as const, reason: "no_secret_configured" as const }

  if (!verification.verified) {
    return Response.json(
      {
        accepted: false,
        error: verification.reason,
      },
      { status: 401 },
    )
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return Response.json(
      {
        accepted: false,
        error: "invalid_json",
      },
      { status: 400 },
    )
  }

  const event = buildRelayEvent({
    source: "meta",
    event: typeof payload.object === "string" ? payload.object : "webhook",
    externalId: typeof payload.object === "string" ? payload.object : undefined,
    payload,
    verified: verification.verified,
    meta: {
      signatureConfigured: Boolean(appSecret),
    },
  })

  const relay = await relayEvent(event)

  return Response.json({
    accepted: true,
    source: "meta",
    event: event.event,
    verified: event.verified,
    relay,
  })
}
