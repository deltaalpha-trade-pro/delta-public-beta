import { buildRelayEvent, relayEvent, verifyTidioWebhook } from "@/lib/integration-relay"

export const runtime = "nodejs"

const TOPICS = new Set([
  "ticket.created", "ticket.replied", "ticket.holder_changed",
  "conversation.operator_replied", "conversation.solved_by_operator",
  "conversation.solved_by_lyro", "conversation.solved_automatically",
  "customer_satisfaction.rated",
])

export async function POST(request: Request) {
  // The Free-plan customer widget is independent of this paid/plan-gated webhook.
  // Never accept or relay provider content until a deliberate live admission.
  if (process.env.TIDIO_WEBHOOK_ENABLED !== "true") {
    return Response.json({ accepted: false, error: "tidio_webhook_disabled" }, { status: 503 })
  }

  const secret = process.env.TIDIO_WEBHOOK_SECRET?.trim() || ""
  const internalToken = process.env.WHALEZ_INTERNAL_RELAY_TOKEN?.trim() || ""
  const target = process.env.WHALEZ_MAIL_INGEST_URL?.trim() || ""
  if (!secret || !internalToken) {
    return Response.json({ accepted: false, error: "tidio_relay_auth_not_configured" }, { status: 503 })
  }

  // Strict destination allowlisting prevents a misconfigured webhook from
  // reaching a generic mail sender or Whalez-AI governance service.
  let validDestination = false
  try {
    const url = new URL(target)
    validDestination = url.protocol === "https:" &&
      url.hostname === "mail.deltaalpha-trade-pro.com" &&
      url.port === "" && !url.username && !url.password &&
      !url.search && !url.hash &&
      url.pathname.replace(/\/+$/, "") === "/api/integrations/tidio"
  } catch { /* fail closed */ }
  if (!validDestination) {
    return Response.json({ accepted: false, error: "tidio_dedicated_mail_ingest_unavailable" }, { status: 503 })
  }

  // Bound the message size; caller messages are never stored by this route.
  const lengthHeader = Number(request.headers.get("content-length") || "0")
  if (!Number.isFinite(lengthHeader) || lengthHeader > 64 * 1024) {
    return Response.json({ accepted: false, error: "tidio_payload_too_large" }, { status: 413 })
  }
  const raw = await request.text()
  if (Buffer.byteLength(raw, "utf8") > 64 * 1024) {
    return Response.json({ accepted: false, error: "tidio_payload_too_large" }, { status: 413 })
  }
  const verification = verifyTidioWebhook(raw, request.headers.get("x-tidio-signature"), secret)
  if (!verification.verified) {
    return Response.json({ accepted: false, error: "tidio_signature_invalid" }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    const candidate: unknown = JSON.parse(raw)
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) throw new Error("invalid")
    payload = candidate as Record<string, unknown>
  } catch {
    return Response.json({ accepted: false, error: "tidio_bad_payload" }, { status: 400 })
  }

  const topic = payload.topic
  const id = payload.webhook_id
  const projectKey = payload.project_public_key
  if (typeof topic !== "string" || !TOPICS.has(topic) ||
      typeof id !== "string" || !id.trim() ||
      typeof projectKey !== "string" ||
      projectKey !== process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY) {
    return Response.json({ accepted: false, error: "tidio_event_denied" }, { status: 422 })
  }

  // Transfer only routing metadata. Customer chat text, names and email addresses
  // remain in the Tidio operator inbox and never reach the control plane.
  const source = payload.content
  const message = source && typeof source === "object" && !Array.isArray(source)
    ? source as Record<string, unknown> : {}
  const metadata: Record<string, string> = {}
  for (const key of ["id", "ticket_id", "status", "new_holder", "previous_holder"]) {
    const value = message[key]
    if (typeof value === "string" || typeof value === "number") metadata[key] = String(value).slice(0, 100)
  }

  const event = buildRelayEvent({
    source: "tidio", event: topic, externalId: id,
    payload: {
      topic, webhook_id: id, project_public_key: projectKey,
      created_at: payload.created_at, content: metadata,
    },
    verified: true,
    meta: { signatureTimestamp: verification.timestamp },
  })
  const relay = await relayEvent(event, { includeControlPlane: false })
  const accepted = relay.targets.some(x => x.name === "whalez-mail" && x.status === "forwarded")
  if (!accepted) return Response.json({ accepted: false, error: "tidio_relay_not_accepted" }, { status: 502 })
  return Response.json({ accepted: true, source: "tidio", event: topic, verified: true })
}
