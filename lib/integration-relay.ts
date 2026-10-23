import crypto from "node:crypto"

type RelaySource = "tidio" | "telegram" | "meta" | "whatsapp"

type RelayEvent = {
  source: RelaySource
  event: string
  externalId?: string
  receivedAt: string
  verified: boolean
  payload: unknown
  meta?: Record<string, unknown>
}

type RelayTarget = {
  name: string
  url: string
}

const trim = (value: string | undefined | null) => value?.trim() ?? ""

const deliveryUnavailable = () => new Error("Webhook delivery temporarily unavailable")

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) return false
  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function parseHeaderPairs(header: string): Record<string, string[]> {
  return header.split(",").reduce<Record<string, string[]>>((acc, chunk) => {
    const [rawKey, ...rest] = chunk.trim().split("=")
    const key = rawKey.trim()
    const value = rest.join("=").trim()
    if (!key || !value) return acc
    if (!acc[key]) acc[key] = []
    acc[key].push(value)
    return acc
  }, {})
}

export function verifyTidioWebhook(rawBody: string, signatureHeader: string | null, secret: string) {
  if (!secret) {
    return { verified: false, reason: "missing_secret_configuration" as const }
  }

  if (!signatureHeader) {
    return { verified: false, reason: "missing_signature" as const }
  }

  const parts = parseHeaderPairs(signatureHeader)
  const timestamp = parts.t?.[0] ?? ""
  const signatures = parts.s ?? []

  if (!timestamp || signatures.length === 0) {
    return { verified: false, reason: "malformed_signature" as const }
  }

  const expected = crypto.createHmac("sha256", secret).update(`${rawBody}_${timestamp}`).digest("hex")
  const verified = signatures.some((candidate) => safeEqual(candidate, expected))

  return verified
    ? { verified: true as const, timestamp, signatureCount: signatures.length }
    : { verified: false as const, reason: "signature_mismatch" as const, timestamp, signatureCount: signatures.length }
}

export function verifyTelegramWebhook(secret: string, headerToken: string | null) {
  if (!secret) {
    return { verified: false, reason: "missing_secret_configuration" as const }
  }

  if (!headerToken) {
    return { verified: false, reason: "missing_secret_token" as const }
  }

  return safeEqual(headerToken, secret)
    ? { verified: true as const }
    : { verified: false as const, reason: "secret_token_mismatch" as const }
}

export function verifyMetaWebhook(rawBody: string, signatureHeader: string | null, appSecret: string) {
  if (!appSecret) {
    return { verified: false, reason: "missing_secret_configuration" as const }
  }

  if (!signatureHeader) {
    return { verified: false as const, reason: "missing_signature" as const }
  }

  const [prefix, signature] = signatureHeader.split("=")
  if (prefix !== "sha256" || !signature) {
    return { verified: false as const, reason: "malformed_signature" as const }
  }

  const expected = crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex")
  return safeEqual(signature, expected)
    ? { verified: true as const }
    : { verified: false as const, reason: "signature_mismatch" as const }
}

export async function relayEvent(event: RelayEvent) {
  // Defense in depth: never forward an unverified provider event or use an
  // internal relay target without the shared service credential.
  if (!event.verified) {
    throw deliveryUnavailable()
  }

  const internalRelayToken = trim(process.env.WHALEZ_INTERNAL_RELAY_TOKEN)
  if (!internalRelayToken) {
    throw deliveryUnavailable()
  }

  const targets: RelayTarget[] = []
  const mailIngestUrl = trim(process.env.WHALEZ_MAIL_INGEST_URL)
  const controlRelayUrl = trim(process.env.WHALEZ_CONTROL_EVENT_URL)

  if (mailIngestUrl) targets.push({ name: "whalez-mail", url: mailIngestUrl })
  if (controlRelayUrl) targets.push({ name: "control-plane", url: controlRelayUrl })

  if (targets.length === 0) {
    throw deliveryUnavailable()
  }

  const results = await Promise.allSettled(
    targets.map(async (target) => {
      const response = await fetch(target.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-whalez-internal-token": internalRelayToken,
        },
        body: JSON.stringify(event),
      })

      return {
        name: target.name,
        status: response.ok ? ("forwarded" as const) : ("failed" as const),
        httpStatus: response.status,
      }
    }),
  )

  const deliveryResults = results.map((result, index) => {
    if (result.status === "fulfilled") return result.value
    return {
      name: targets[index]?.name ?? `target-${index + 1}`,
      status: "failed" as const,
      error: result.reason instanceof Error ? result.reason.message : String(result.reason),
    }
  })

  // The route handlers acknowledge only after this promise resolves. Any missing
  // destination or failed target must propagate as a non-2xx provider response
  // so the provider can retry instead of treating an undelivered event as accepted.
  if (deliveryResults.some((result) => result.status !== "forwarded")) {
    throw deliveryUnavailable()
  }

  return { forwarded: true as const, targets: deliveryResults }
}
export function buildRelayEvent(params: {
  source: RelaySource
  event: string
  payload: unknown
  verified: boolean
  externalId?: string
  meta?: Record<string, unknown>
}): RelayEvent {
  return {
    ...params,
    receivedAt: new Date().toISOString(),
  }
}
