import { buildRelayEvent, relayEvent, verifyTelegramWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

export function GET() {
  return Response.json({
    service: "delta-public-beta",
    webhook: "telegram",
    ready: true,
  })
}

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN?.trim() || ""
  const headerToken = request.headers.get("x-telegram-bot-api-secret-token")
  const verification = verifyTelegramWebhook(secret, headerToken)

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
    payload = (await request.json()) as Record<string, unknown>
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
    source: "telegram",
    event: typeof payload.message === "object" && payload.message !== null ? "message" : "update",
    externalId: typeof payload.update_id === "number" ? String(payload.update_id) : undefined,
    payload,
    verified: verification.verified,
    meta: {
      webhookSecretConfigured: Boolean(secret),
    },
  })

  const relay = await relayEvent(event)

  return Response.json({
    accepted: true,
    source: "telegram",
    event: event.event,
    externalId: event.externalId,
    verified: event.verified,
    relay,
  })
}
