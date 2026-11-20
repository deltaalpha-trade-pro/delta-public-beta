import { buildRelayEvent, relayEvent, verifyTelegramWebhook } from "@/lib/integration-relay"
import { publicTelegramChatId, publicTelegramReply } from "@/lib/telegram-public-bot"

export const runtime = "nodejs"
export const maxDuration = 30

export function GET() {
  // Public liveness must not imply the private bot credential is configured.
  return Response.json({ service: "deltaalpha-public", status: "reachable" }, {
    headers: { "Cache-Control": "no-store" },
  })
}

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN?.trim() || ""
  if (!secret) {
    return Response.json({ accepted: false, error: "telegram_webhook_not_configured" }, { status: 503 })
  }
  const authentication = verifyTelegramWebhook(
    secret, request.headers.get("x-telegram-bot-api-secret-token"),
  )
  if (!authentication.verified) {
    return Response.json({ accepted: false, error: "invalid_telegram_webhook_authentication" }, { status: 401 })
  }

  const contentLength = request.headers.get("content-length")
  if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > 32768)) {
    return Response.json({ accepted: false, error: "telegram_update_too_large" }, { status: 413 })
  }
  let payload: Record<string, unknown>
  try {
    const raw = await request.text()
    if (Buffer.byteLength(raw, "utf8") > 32768) {
      return Response.json({ accepted: false, error: "telegram_update_too_large" }, { status: 413 })
    }
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("invalid_json")
    }
    payload = parsed as Record<string, unknown>
  } catch {
    return Response.json({ accepted: false, error: "invalid_json" }, { status: 400 })
  }
  if (!Number.isSafeInteger(payload.update_id) || Number(payload.update_id) < 0) {
    return Response.json({ accepted: false, error: "invalid_telegram_update_id" }, { status: 422 })
  }

  const kind = payload.message && typeof payload.message === "object" && !Array.isArray(payload.message)
    ? "message" : "update"
  const externalId = String(payload.update_id)
  const event = buildRelayEvent({
    source: "telegram",
    event: kind,
    externalId,
    payload: { update_id: externalId, kind },
    verified: true,
    meta: {},
  })
  // A webhook should not acknowledge data that the durable intake rejected.
  // Telegram retries non-2xx responses. No customer message bodies are forwarded.
  const relay = await relayEvent(event)
  if (!relay.forwarded) {
    return Response.json({ accepted: false, error: "telegram_support_not_durably_stored" }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    })
  }
  // Provider retries must not send the same command response twice.
  if (relay.duplicate !== true) {
    const incoming = payload.message && typeof payload.message === "object"
      ? payload.message as Record<string, unknown> : null
    const chatId = publicTelegramChatId(incoming)
    const messageText = incoming?.text
    if (chatId && typeof messageText === "string" && messageText.length <= 1200) {
      const reply = await publicTelegramReply(messageText)
      if (reply) {
        // Telegram supports a Bot API request in the webhook HTTP response.
        // This avoids a public bot-token dependency. Provider delivery is not
        // independently acknowledged, so the authoritative receipt is for the
        // metadata inbox, not a guaranteed outgoing message.
        return Response.json({
          method: "sendMessage", chat_id: chatId, text: reply,
          disable_web_page_preview: true,
        }, { headers: { "Cache-Control": "no-store" } })
      }
    }
  }
  return Response.json({
    accepted: true, source: "telegram", event: kind,
    externalId, verified: true, stored: true,
    duplicate: relay.duplicate === true,
  }, { headers: { "Cache-Control": "no-store" } })
}
