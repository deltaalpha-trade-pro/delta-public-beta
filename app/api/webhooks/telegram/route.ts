import { buildRelayEvent, relayEvent, verifyTelegramWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const enabled = process.env.TELEGRAM_WEBHOOK_ENABLED?.trim().toLowerCase() === "true"
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN?.trim() || ""

  // Telegram events are disabled until an explicit enable flag and secret token exist.
  if (!enabled || !secret) {
    return Response.json(
      { accepted: false, error: "Telegram webhook integration is disabled." },
      { status: 503 },
    )
  }

  const headerToken = request.headers.get("x-telegram-bot-api-secret-token")
  const verification = verifyTelegramWebhook(secret, headerToken)
  if (!verification.verified) {
    return Response.json(
      { accepted: false, error: "Webhook token verification failed." },
      { status: 401 },
    )
  }

  let payload: Record<string, unknown>
  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return Response.json({ accepted: false, error: "invalid_json" }, { status: 400 })
  }

  const event = buildRelayEvent({
    source: "telegram",
    event: typeof payload.message === "object" && payload.message !== null ? "message" : "update",
    externalId: typeof payload.update_id === "number" ? String(payload.update_id) : undefined,
    payload,
    verified: verification.verified,
  })

  await relayEvent(event)
  return Response.json({ accepted: true })
}
