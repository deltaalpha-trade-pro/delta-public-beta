import test from "node:test"
import assert from "node:assert/strict"

import { buildRelayEvent, relayEvent } from "../../lib/integration-relay"
import { POST } from "../../app/api/webhooks/telegram/route"

const SUPPORT_URL = "https://mail.example.test/api/integrations/telegram"
const TEST_RELAY_KEY = "synthetic-telegram-relay-secret-000000000000000"
const TEST_WEBHOOK_KEY = "synthetic-telegram-webhook-secret-00000000"

function setEnv(key: string, value: string | undefined): void {
  if (value === undefined) delete process.env[key]
  else process.env[key] = value
}

async function withTelegramEnv(run: () => Promise<void>) {
  const oldUrl = process.env.WHALEZ_TELEGRAM_SUPPORT_INGEST_URL
  const oldKey = process.env.WHALEZ_TELEGRAM_SUPPORT_RELAY_TOKEN
  const oldWebhook = process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN
  const oldFetch = globalThis.fetch
  process.env.WHALEZ_TELEGRAM_SUPPORT_INGEST_URL = SUPPORT_URL
  process.env.WHALEZ_TELEGRAM_SUPPORT_RELAY_TOKEN = TEST_RELAY_KEY
  process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN = TEST_WEBHOOK_KEY
  try {
    await run()
  } finally {
    globalThis.fetch = oldFetch
    setEnv("WHALEZ_TELEGRAM_SUPPORT_INGEST_URL", oldUrl)
    setEnv("WHALEZ_TELEGRAM_SUPPORT_RELAY_TOKEN", oldKey)
    setEnv("TELEGRAM_WEBHOOK_SECRET_TOKEN", oldWebhook)
  }
}

function fixture() {
  return buildRelayEvent({
    source: "telegram",
    event: "message",
    externalId: "10001",
    receivedAt: "2026-11-20T10:00:00.000Z",
    verified: true,
    payload: { update_id: "10001", kind: "message" },
  })
}

test("Telegram relay requires a durable stored receipt and no raw content leaks", async () => {
  await withTelegramEnv(async () => {
    let posted: Record<string, unknown> = {}
    globalThis.fetch = async (input, init) => {
      assert.equal(String(input), SUPPORT_URL)
      assert.equal((init?.headers as Record<string, string>)["x-whalez-internal-token"], TEST_RELAY_KEY)
      posted = JSON.parse(String(init?.body))
      return Response.json({
        accepted: true, stored: true, source: "telegram", externalId: "10001",
      })
    }
    const result = await relayEvent(fixture())
    assert.equal(result.forwarded, true)
    assert.deepEqual((posted.payload as Record<string, unknown>), {
      update_id: "10001", kind: "message",
    })
    assert.equal(JSON.stringify(posted).includes("private message"), false)
  })
})

test("Telegram relay reports false when support backend returns 503", async () => {
  await withTelegramEnv(async () => {
    globalThis.fetch = async () => Response.json({ accepted: false }, { status: 503 })
    const result = await relayEvent(fixture())
    assert.equal(result.forwarded, false)
    assert.equal(result.targets[0]?.status, "failed")
  })
})

test("Telegram relay rejects non-durable success and raw payload", async () => {
  await withTelegramEnv(async () => {
    globalThis.fetch = async () => Response.json({ accepted: true, stored: false })
    assert.equal((await relayEvent(fixture())).forwarded, false)
    const bad = buildRelayEvent({
      source: "telegram", event: "message", externalId: "10001",
      payload: { update_id: "10001", kind: "message", text: "secret" },
      verified: true,
    })
    const result = await relayEvent(bad)
    assert.equal(result.forwarded, false)
    assert.equal(result.targets[0]?.status, "rejected")
  })
})

test("Telegram webhook verifies secret and passes only safe metadata to Mail", async () => {
  await withTelegramEnv(async () => {
    let safeBody = ""
    globalThis.fetch = async (_input, init) => {
      safeBody = String(init?.body)
      return Response.json({ accepted: true, stored: true, source: "telegram", externalId: "20002" })
    }
    const input = {
      update_id: 20002,
      message: {
        chat: { type: "group", id: -12345 },
        from: { id: 98765, username: "private-user" },
        text: "Sensitive private message that should never be forwarded",
      },
    }
    const res = await POST(new Request("https://www.deltaalpha-trade-pro.com/api/webhooks/telegram", {
      method: "POST",
      headers: { "X-Telegram-Bot-Api-Secret-Token": TEST_WEBHOOK_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }))
    assert.equal(res.status, 200)
    const data = await res.json()
    assert.equal(data.stored, true)
    assert.equal(JSON.parse(safeBody).payload.update_id, "20002")
    assert.equal(safeBody.includes("Sensitive private message"), false)
    assert.equal(safeBody.includes("private-user"), false)
    assert.equal(safeBody.includes("98765"), false)
  })
})

test("Telegram webhook rejects missing secret and retries on storage failure", async () => {
  await withTelegramEnv(async () => {
    const base = "https://www.deltaalpha-trade-pro.com/api/webhooks/telegram"
    const input = { update_id: 30003, message: { chat: { type: "group", id: -123 }, text: "Test" } }
    const invalid = await POST(new Request(base, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input),
    }))
    assert.equal(invalid.status, 401)
    globalThis.fetch = async () => Response.json({ accepted: false, stored: false }, { status: 503 })
    const valid = await POST(new Request(base, {
      method: "POST",
      headers: { "X-Telegram-Bot-Api-Secret-Token": TEST_WEBHOOK_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }))
    assert.equal(valid.status, 503)
    const packet = await valid.json()
    assert.equal(packet.accepted, false)
    assert.equal(packet.error, "telegram_support_not_durably_stored")
  })
})
