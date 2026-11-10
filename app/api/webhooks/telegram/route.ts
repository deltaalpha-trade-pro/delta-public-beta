import { buildRelayEvent, relayEvent, verifyTelegramWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

export function GET() {
  return new Response(null, { status: 405 })
}

export async function POST(request: Request) {
  // Public Telegram is customer care only; never forward message text to the control plane.
  if (process.env.TELEGRAM_WEBHOOK_ENABLED !== "true") {
    return Response.json({ accepted: false, error: "telegram_webhook_disabled" }, { status: 503 })
  }
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN?.trim() || ""
  if (!secret) return Response.json({ accepted: false, error: "telegram_secret_not_configured" }, { status: 503 })
  const verified = verifyTelegramWebhook(secret, request.headers.get("x-telegram-bot-api-secret-token"))
  if (!verified.verified) return Response.json({ accepted: false, error: "telegram_signature_invalid" }, { status: 401 })

  const length = Number(request.headers.get("content-length") || "0")
  if (!Number.isFinite(length) || length > 64 * 1024) {
    return Response.json({ accepted: false, error: "payload_too_large" }, { status: 413 })
  }
  const raw = await request.text()
  if (Buffer.byteLength(raw, "utf8") > 64 * 1024) {
    return Response.json({ accepted: false, error: "payload_too_large" }, { status: 413 })
  }
  let payload: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid")
    payload = parsed as Record<string, unknown>
  } catch {
    return Response.json({ accepted: false, error: "telegram_invalid_payload" }, { status: 400 })
  }

  const id = typeof payload.update_id === "number" && Number.isSafeInteger(payload.update_id)
    ? String(payload.update_id) : undefined
  const eventType = payload.message && typeof payload.message === "object" ? "message" : "update"
  // Only routing metadata may leave the public gateway. Operators handle message
  // content in the provider's inbox with independently authenticated staff access.
  const event = buildRelayEvent({
    source: "telegram", event: eventType, externalId: id,
    payload: { update_id: id, kind: eventType },
    verified: true,
  })
  const relay = await relayEvent(event, { includeControlPlane: false })
  if (!relay.targets.some(t => t.name === "whalez-mail" && t.status === "forwarded")) {
    return Response.json({ accepted: false, error: "telegram_support_ingest_unavailable" }, { status: 503 })
  }
  return Response.json({ accepted: true, source: "telegram", externalId: id })
}
