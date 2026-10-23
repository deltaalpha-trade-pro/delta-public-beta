import { buildRelayEvent, relayEvent, verifyTidioWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get("x-tidio-signature")
  const webhookSecret = process.env.TIDIO_WEBHOOK_SECRET?.trim() || ""

  const webhookEnabled = process.env.TIDIO_WEBHOOK_ENABLED?.trim().toLowerCase() === "true"

  // Fail closed in every environment unless webhook delivery is explicitly enabled
  // and the provider signature secret is available.
  if (!webhookEnabled) {
    return Response.json(
      {
        accepted: false,
        error: "Tidio webhook integration is disabled.",
      },
      { status: 503 },
    )
  }

  if (!webhookSecret) {
    return Response.json(
      {
        accepted: false,
        error: "Tidio webhook signing secret is not configured.",
      },
      { status: 503 },
    )
  }

  const verification = verifyTidioWebhook(rawBody, signatureHeader, webhookSecret)

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
    source: "tidio",
    event: String(payload.topic ?? "unknown"),
    externalId: typeof payload.webhook_id === "string" ? payload.webhook_id : undefined,
    payload,
    verified: verification.verified,
    meta: {
      projectPublicKey: typeof payload.project_public_key === "string" ? payload.project_public_key : undefined,
      createdAt: typeof payload.created_at === "number" ? payload.created_at : undefined,
      signatureTimestamp:
        "timestamp" in verification && typeof verification.timestamp === "string" ? verification.timestamp : undefined,
    },
  })

  await relayEvent(event)

  // Provider callback gets only an acknowledgement, not internal relay targets or results.
  return Response.json({ accepted: true })
}
