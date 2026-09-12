import { buildRelayEvent, relayEvent, verifyTidioWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signatureHeader = request.headers.get("x-tidio-signature")
  const webhookSecret = process.env.TIDIO_WEBHOOK_SECRET?.trim() || ""

  if (!webhookSecret && process.env.NODE_ENV === "production") {
    return Response.json(
      {
        accepted: false,
        error: "TIDIO_WEBHOOK_SECRET is not configured.",
      },
      { status: 500 },
    )
  }

  const verification = webhookSecret
    ? verifyTidioWebhook(rawBody, signatureHeader, webhookSecret)
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

  const relay = await relayEvent(event)

  return Response.json({
    accepted: true,
    source: "tidio",
    event: event.event,
    externalId: event.externalId,
    verified: event.verified,
    relay,
  })
}
