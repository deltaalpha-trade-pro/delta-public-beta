import test from "node:test"
import assert from "node:assert/strict"
import { buildRelayEvent, getIntegrationStatus, relayEvent, verifyTelegramWebhook } from "../lib/integration-relay"

test("Telegram webhook authentication must fail closed", () => {
  assert.equal(verifyTelegramWebhook("", null).verified, false)
  assert.equal(verifyTelegramWebhook("", "anything").verified, false)
  assert.equal(verifyTelegramWebhook("test-only-secret", null).verified, false)
  assert.equal(verifyTelegramWebhook("test-only-secret", "wrong").verified, false)
  assert.equal(verifyTelegramWebhook("test-only-secret", "test-only-secret").verified, true)
})

test("Integration readiness requires all configured safeguards", () => {
  const keys = ["META_WEBHOOK_VERIFY_TOKEN", "META_APP_SECRET", "META_WEBHOOK_ENABLED", "WHALEZ_META_INGEST_URL", "TIDIO_WEBHOOK_ENABLED", "TIDIO_WEBHOOK_SECRET", "WHALEZ_MAIL_INGEST_URL", "WHALEZ_INTERNAL_RELAY_TOKEN"]
  const previous = Object.fromEntries(keys.map(k => [k, process.env[k]]))
  try {
    process.env.META_WEBHOOK_VERIFY_TOKEN = "verify-only"
    delete process.env.META_APP_SECRET
    assert.equal(getIntegrationStatus().configured.metaWebhook, false)
    process.env.META_APP_SECRET = "app-secret"
    assert.equal(getIntegrationStatus().configured.metaWebhook, false)
    process.env.META_WEBHOOK_ENABLED = "true"
    process.env.WHALEZ_META_INGEST_URL = "https://mail.deltaalpha-trade-pro.com/api/integrations/meta"
    process.env.WHALEZ_INTERNAL_RELAY_TOKEN = "test-only-relay-token"
    assert.equal(getIntegrationStatus().configured.metaWebhook, true)

    process.env.TIDIO_WEBHOOK_SECRET = "provider-secret"
    process.env.WHALEZ_MAIL_INGEST_URL = "https://mail.deltaalpha-trade-pro.com/api/integrations/tidio"
    process.env.WHALEZ_INTERNAL_RELAY_TOKEN = "test-only-relay-token"
    delete process.env.TIDIO_WEBHOOK_ENABLED
    assert.equal(getIntegrationStatus().configured.tidioWebhook, false)
    process.env.TIDIO_WEBHOOK_ENABLED = "true"
    assert.equal(getIntegrationStatus().configured.tidioWebhook, true)
  } finally {
    for (const k of keys) previous[k] === undefined ? delete process.env[k] : process.env[k] = previous[k]
  }
})

test("Tidio support relay never treats plain 200 as durable acceptance", async () => {
  const keys = ["WHALEZ_MAIL_INGEST_URL", "WHALEZ_INTERNAL_RELAY_TOKEN", "WHALEZ_CONTROL_EVENT_URL"]
  const previous = Object.fromEntries(keys.map(k => [k, process.env[k]]))
  const originalFetch = globalThis.fetch
  const event = buildRelayEvent({ source: "tidio", event: "ticket.created", verified: true, payload: { ticket_id: "fixture" } })
  try {
    process.env.WHALEZ_MAIL_INGEST_URL = "https://mail.deltaalpha-trade-pro.com/api/integrations/tidio"
    process.env.WHALEZ_INTERNAL_RELAY_TOKEN = "test-only-relay-token"
    delete process.env.WHALEZ_CONTROL_EVENT_URL
    let options: RequestInit | undefined
    globalThis.fetch = async (_url, init) => {
      options = init
      return Response.json({ accepted: true, stored: false })
    }
    const notStored = await relayEvent(event, { includeControlPlane: false })
    assert.equal(notStored.targets[0]?.status, "failed")
    assert.equal(options?.redirect, "error")
    assert.ok(options?.signal)
    assert.equal((options?.headers as Record<string, string>)?.["x-whalez-internal-token"], "test-only-relay-token")

    globalThis.fetch = async () => Response.json({ accepted: true, stored: true })
    const stored = await relayEvent(event, { includeControlPlane: false })
    assert.equal(stored.targets[0]?.status, "forwarded")

    globalThis.fetch = async () => new Response(null, { status: 200 })
    const noReceipt = await relayEvent(event, { includeControlPlane: false })
    assert.equal(noReceipt.targets[0]?.status, "failed")

    delete process.env.WHALEZ_INTERNAL_RELAY_TOKEN
    const noToken = await relayEvent(event, { includeControlPlane: false })
    assert.equal(noToken.forwarded, false)
  } finally {
    globalThis.fetch = originalFetch
    for (const k of keys) previous[k] === undefined ? delete process.env[k] : process.env[k] = previous[k]
  }
})

test("provider messages cannot enter control plane or another channel's Mail ingest", async () => {
  const keys = ["WHALEZ_MAIL_INGEST_URL", "WHALEZ_TELEGRAM_INGEST_URL", "WHALEZ_META_INGEST_URL", "WHALEZ_CONTROL_EVENT_URL", "WHALEZ_INTERNAL_RELAY_TOKEN"]
  const previous = Object.fromEntries(keys.map(k => [k, process.env[k]]))
  const originalFetch = globalThis.fetch
  const calls: string[] = []
  try {
    process.env.WHALEZ_CONTROL_EVENT_URL = "https://private.example.invalid/events"
    process.env.WHALEZ_INTERNAL_RELAY_TOKEN = "test-only-relay-token"
    process.env.WHALEZ_MAIL_INGEST_URL = "https://mail.deltaalpha-trade-pro.com/api/integrations/tidio"
    delete process.env.WHALEZ_TELEGRAM_INGEST_URL
    globalThis.fetch = async (url) => {
      calls.push(String(url))
      return Response.json({ accepted: true, stored: true })
    }
    const event = buildRelayEvent({ source: "telegram", event: "update", verified: true, payload: { update_id: "fixture" } })
    assert.equal((await relayEvent(event)).forwarded, false)
    assert.equal(calls.length, 0)

    process.env.WHALEZ_TELEGRAM_INGEST_URL = "https://mail.deltaalpha-trade-pro.com/api/integrations/tidio"
    assert.equal((await relayEvent(event)).forwarded, false)
    assert.equal(calls.length, 0)

    process.env.WHALEZ_TELEGRAM_INGEST_URL = "https://mail.deltaalpha-trade-pro.com/api/integrations/telegram"
    assert.equal((await relayEvent(event)).forwarded, true)
    assert.deepEqual(calls, ["https://mail.deltaalpha-trade-pro.com/api/integrations/telegram"])

    process.env.WHALEZ_META_INGEST_URL = "https://evil.example.invalid/api/integrations/meta"
    const meta = buildRelayEvent({ source: "meta", event: "webhook", verified: true, payload: { kind: "webhook" } })
    assert.equal((await relayEvent(meta)).forwarded, false)
    const unverified = buildRelayEvent({ source: "telegram", event: "update", verified: false, payload: {} })
    assert.equal((await relayEvent(unverified)).forwarded, false)
    assert.equal(calls.length, 1)
  } finally {
    globalThis.fetch = originalFetch
    for (const k of keys) previous[k] === undefined ? delete process.env[k] : process.env[k] = previous[k]
  }
})
