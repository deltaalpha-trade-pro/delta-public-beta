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

const truthy = (value: string | undefined | null) => Boolean(trim(value))

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

export function getIntegrationStatus() {
  const tidioPublicKey = trim(process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY)
  const tidioWebhookSecret = trim(process.env.TIDIO_WEBHOOK_SECRET)
  const telegramChannelUrl = trim(process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL) || "https://t.me/whalez_ai_deltaalpha_trade_pro"
  const telegramSecretToken = trim(process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN)
  const whatsappNumber = trim(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/\D/g, "")
  const facebookUrl = trim(process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL)
  const instagramUrl = trim(process.env.NEXT_PUBLIC_INSTAGRAM_URL)
  const metaPixelId = trim(process.env.NEXT_PUBLIC_META_PIXEL_ID)
  const metaWebhookVerifyToken = trim(process.env.META_WEBHOOK_VERIFY_TOKEN)
  const metaAppSecret = trim(process.env.META_APP_SECRET)
  const mailIngestUrl = trim(process.env.WHALEZ_MAIL_INGEST_URL)
  const controlRelayUrl = trim(process.env.WHALEZ_CONTROL_EVENT_URL)
  const internalRelayToken = trim(process.env.WHALEZ_INTERNAL_RELAY_TOKEN)

  return {
    service: "delta-public-beta",
    status: "ok",
    configured: {
      tidioWidget: truthy(tidioPublicKey),
      tidioWebhook: truthy(tidioWebhookSecret),
      telegramChannel: truthy(telegramChannelUrl),
      telegramWebhook: truthy(telegramSecretToken),
      whatsapp: truthy(whatsappNumber),
      metaPixel: truthy(metaPixelId),
      metaWebhook: truthy(metaWebhookVerifyToken) || truthy(metaAppSecret),
      facebook: truthy(facebookUrl),
      instagram: truthy(instagramUrl),
      mailRelay: truthy(mailIngestUrl),
      controlRelay: truthy(controlRelayUrl),
      internalRelayToken: truthy(internalRelayToken),
    },
    routes: {
      status: "/api/status",
      tidioWebhook: "/api/webhooks/tidio",
      telegramWebhook: "/api/webhooks/telegram",
      metaWebhook: "/api/webhooks/meta",
      whatsappWebhook: "/api/webhooks/whatsapp",
    },
    publicLinks: {
      telegramChannelUrl,
      whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/",
      facebookUrl,
      instagramUrl,
      mailSurfaceUrl: process.env.NEXT_PUBLIC_WHALEZ_MAIL_URL?.trim() || "/mail",
    },
  }
}

export function verifyTidioWebhook(rawBody: string, signatureHeader: string | null, secret: string) {
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
    return { verified: true as const, reason: "no_secret_configured" as const }
  }

  if (!headerToken) {
    return { verified: false as const, reason: "missing_secret_token" as const }
  }

  return headerToken === secret
    ? { verified: true as const }
    : { verified: false as const, reason: "secret_token_mismatch" as const }
}

export function verifyMetaWebhook(rawBody: string, signatureHeader: string | null, appSecret: string) {
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
  const targets: RelayTarget[] = []
  const mailIngestUrl = trim(process.env.WHALEZ_MAIL_INGEST_URL)
  const controlRelayUrl = trim(process.env.WHALEZ_CONTROL_EVENT_URL)
  const internalRelayToken = trim(process.env.WHALEZ_INTERNAL_RELAY_TOKEN)

  if (mailIngestUrl) targets.push({ name: "whalez-mail", url: mailIngestUrl })
  if (controlRelayUrl) targets.push({ name: "control-plane", url: controlRelayUrl })

  if (targets.length === 0) {
    return { forwarded: false as const, targets: [] as Array<{ name: string; status: "not-configured" }> }
  }

  const results = await Promise.allSettled(
    targets.map(async (target) => {
      const response = await fetch(target.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(internalRelayToken ? { "x-whalez-internal-token": internalRelayToken } : {}),
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

  return {
    forwarded: true as const,
    targets: results.map((result, index) => {
      if (result.status === "fulfilled") return result.value
      return {
        name: targets[index]?.name ?? `target-${index + 1}`,
        status: "failed" as const,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      }
    }),
  }
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
