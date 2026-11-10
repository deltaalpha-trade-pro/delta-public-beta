import { buildRelayEvent, relayEvent, verifyMetaWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

export function GET(request: Request) {
  if (process.env.META_WEBHOOK_ENABLED !== "true") {
    return Response.json({ verified: false }, { status: 403 })
  }
  const url = new URL(request.url)
  const token = process.env.META_WEBHOOK_VERIFY_TOKEN?.trim() || ""
  if (token && url.searchParams.get("hub.mode") === "subscribe" &&
      url.searchParams.get("hub.verify_token") === token) {
    const challenge = url.searchParams.get("hub.challenge")
    if (challenge && challenge.length <= 512) {
      return new Response(challenge, { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } })
    }
  }
  return Response.json({ verified: false }, { status: 403 })
}

export async function POST(request: Request) {
  // Meta/WhatsApp/Instagram provider callbacks are not Founder authority.
  if (process.env.META_WEBHOOK_ENABLED !== "true") {
    return Response.json({ accepted: false, error: "meta_webhook_disabled" }, { status: 503 })
  }
  const secret = process.env.META_APP_SECRET?.trim() || ""
  if (!secret) return Response.json({ accepted: false, error: "meta_secret_not_configured" }, { status: 503 })

  const length = Number(request.headers.get("content-length") || "0")
  if (!Number.isFinite(length) || length > 64 * 1024) {
    return Response.json({ accepted: false, error: "payload_too_large" }, { status: 413 })
  }
  const raw = await request.text()
  if (Buffer.byteLength(raw, "utf8") > 64 * 1024) {
    return Response.json({ accepted: false, error: "payload_too_large" }, { status: 413 })
  }
  const check = verifyMetaWebhook(raw, request.headers.get("x-hub-signature-256"), secret)
  if (!check.verified) return Response.json({ accepted: false, error: "meta_signature_invalid" }, { status: 401 })

  let payload: Record<string, unknown>
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("invalid")
    payload = parsed as Record<string, unknown>
  } catch {
    return Response.json({ accepted: false, error: "meta_invalid_payload" }, { status: 400 })
  }
  const kind = typeof payload.object === "string" ? payload.object.slice(0, 80) : "webhook"
  // Provider user data, chat text, identifiers and message attachments remain
  // in the authenticated provider inbox, never a public or Founder API.
  const event = buildRelayEvent({
    source: "meta", event: kind, payload: { kind }, verified: true,
  })
  const relay = await relayEvent(event, { includeControlPlane: false })
  if (!relay.targets.some(t => t.name === "whalez-mail" && t.status === "forwarded")) {
    return Response.json({ accepted: false, error: "meta_support_ingest_unavailable" }, { status: 503 })
  }
  return Response.json({ accepted: true, source: "meta" })
}
