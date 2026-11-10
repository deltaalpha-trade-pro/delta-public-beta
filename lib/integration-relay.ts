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
  const tidioWebhookEnabled = trim(process.env.TIDIO_WEBHOOK_ENABLED).toLowerCase() === "true"
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
      tidioWebhook: tidioWebhookEnabled && truthy(tidioWebhookSecret) && truthy(mailIngestUrl) && truthy(internalRelayToken),
      tidioWebhookEnabled,
      telegramChannel: truthy(telegramChannelUrl),
      telegramWebhook: truthy(telegramSecretToken),
      whatsapp: truthy(whatsappNumber),
      metaPixel: truthy(metaPixelId),
      metaWebhook: truthy(metaWebhookVerifyToken) && truthy(metaAppSecret),
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

  if (!timestamp || !/^\d+$/.test(timestamp) || signatures.length === 0) {
    return { verified: false, reason: "malformed_signature" as const }
  }

  const timestampSeconds = Number(timestamp)
  if (!Number.isSafeInteger(timestampSeconds) || Math.abs(Date.now() - timestampSeconds * 1000) > 5 * 60 * 1000) {
    return { verified: false as const, reason: "stale_or_invalid_signature_timestamp" as const }
  }

  const expected = crypto.createHmac("sha256", secret).update(`${rawBody}_${timestamp}`).digest("hex")
  const verified = signatures.some((candidate) => safeEqual(candidate, expected))

  return verified
    ? { verified: true as const, timestamp, signatureCount: signatures.length }
    : { verified: false as const, reason: "signature_mismatch" as const, timestamp, signatureCount: signatures.length }
}

export function verifyTelegramWebhook(secret: string, headerToken: string | null) {
  if (!secret) {
    return { verified: false as const, reason: "secret_not_configured" as const }
  }

  if (!headerToken) {
    return { verified: false as const, reason: "missing_secret_token" as const }
  }

  return safeEqual(headerToken, secret)
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

/** Public provider events may only enter their dedicated Whalez-Mail ingest.
 * Never route untrusted customer/provider input to Founder or control-plane services.
 * The legacy includeControlPlane option is deliberately ignored for compatibility.
 */
export async function relayEvent(
  event: RelayEvent,
  _options: { includeControlPlane?: boolean } = {},
) {
  const internalRelayToken = trim(process.env.WHALEZ_INTERNAL_RELAY_TOKEN)
  const mailIngestUrl = trim(
    event.source === "tidio" ? process.env.WHALEZ_MAIL_INGEST_URL :
    event.source === "telegram" ? process.env.WHALEZ_TELEGRAM_INGEST_URL :
    event.source === "meta" ? process.env.WHALEZ_META_INGEST_URL :
    process.env.WHALEZ_WHATSAPP_INGEST_URL,
  )
  const providerPath: Record<RelaySource, string> = {
    tidio: "/api/integrations/tidio",
    telegram: "/api/integrations/telegram",
    meta: "/api/integrations/meta",
    whatsapp: "/api/integrations/whatsapp",
  }

  let validDestination = false
  try {
    const url = new URL(mailIngestUrl)
    validDestination = url.protocol === "https:" &&
      url.hostname === "mail.deltaalpha-trade-pro.com" &&
      url.port === "" && !url.username && !url.password &&
      !url.search && !url.hash &&
      url.pathname.replace(/\/+$/, "") === providerPath[event.source]
  } catch { /* fail closed */ }

  if (!event.verified || !internalRelayToken || !validDestination) {
    return { forwarded: false as const, targets: [] as Array<{ name: string; status: "not-configured" }> }
  }

  const targets: RelayTarget[] = [{ name: "whalez-mail", url: mailIngestUrl }]
  const results = await Promise.allSettled(
    targets.map(async (target) => {
      const response = await fetch(target.url, {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(event.source === "tidio" ? 2500 : 10000),
        headers: {
          "content-type": "application/json",
          "x-whalez-internal-token": internalRelayToken,
        },
        body: JSON.stringify(event),
      })

      // Every support channel requires an explicit durable-storage receipt.
      const receipt: unknown = await response.json().catch(() => null)
      const recorded = receipt && typeof receipt === "object" && !Array.isArray(receipt)
        ? receipt as Record<string, unknown> : {}
      return {
        name: target.name,
        status: response.ok && recorded.accepted === true && recorded.stored === true
          ? ("forwarded" as const) : ("failed" as const),
        httpStatus: response.status,
      }
    }),
  )
  const deliveries = results.map((result, index) =>
    result.status === "fulfilled" ? result.value : {
      name: targets[index]?.name ?? `target-${index + 1}`,
      status: "failed" as const,
      error: "downstream_unavailable",
    },
  )
  return { forwarded: deliveries.some(item => item.status === "forwarded"), targets: deliveries }
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
