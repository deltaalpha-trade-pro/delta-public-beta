import test from "node:test"
import assert from "node:assert/strict"
import { POST } from "../../app/api/webhooks/telegram/route"
import { publicTelegramReply } from "../../lib/telegram-public-bot"

const BASE = "https://www.deltaalpha-trade-pro.com/api/webhooks/telegram"
const WEBHOOK_SECRET = "synthetic-webhook-token-only-for-test-0123456"
const RELAY_SECRET = "synthetic-support-relay-only-for-test-01234567"
const MAIL_URL = "https://mail.example.test/api/integrations/telegram"

async function withEnv(task: () => Promise<void>) {
  const originals: Record<string, string | undefined> = {}
  for (const key of [
    "TELEGRAM_WEBHOOK_SECRET_TOKEN", "WHALEZ_TELEGRAM_SUPPORT_RELAY_TOKEN",
    "WHALEZ_TELEGRAM_SUPPORT_INGEST_URL", "WHALEZ_CORE_API_URL",
    "WHALEZ_AI_TELEGRAM_CORE_KEY",
  ]) originals[key] = process.env[key]
  const oldFetch = globalThis.fetch
  process.env.TELEGRAM_WEBHOOK_SECRET_TOKEN = WEBHOOK_SECRET
  process.env.WHALEZ_TELEGRAM_SUPPORT_RELAY_TOKEN = RELAY_SECRET
  process.env.WHALEZ_TELEGRAM_SUPPORT_INGEST_URL = MAIL_URL
  try { await task() } finally {
    globalThis.fetch = oldFetch
    for (const [key, value] of Object.entries(originals)) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

function message(text: string, group = false) {
  return {
    update_id: 88123456,
    message: {
      chat: { type: group ? "group" : "private", id: group ? -3333 : 123456789 },
      from: { id: 123456789, is_bot: false },
      text,
    },
  }
}

function req(body: object) {
  return new Request(BASE, {
    method: "POST",
    headers: {
      "x-telegram-bot-api-secret-token": WEBHOOK_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

test("authenticated private /help returns Telegram webhook sendMessage without bot token", async () => {
  await withEnv(async () => {
    globalThis.fetch = async (_url, init) => {
      const event = JSON.parse(String(init?.body))
      assert.deepEqual(event.payload, { update_id: "88123456", kind: "message" })
      return Response.json({
        accepted: true, stored: true, source: "telegram",
        externalId: "88123456", duplicate: false,
      })
    }
    const res = await POST(req(message("/help")))
    assert.equal(res.status, 200)
    const payload = await res.json()
    assert.equal(payload.method, "sendMessage")
    assert.equal(payload.chat_id, 123456789)
    assert.match(payload.text, /Alpha-AI support assistant/)
    assert.equal(JSON.stringify(payload).includes("founder"), false)
  })
})

test("Telegram retries do not duplicate a public bot reply", async () => {
  await withEnv(async () => {
    globalThis.fetch = async () => Response.json({
      accepted: true, stored: true, source: "telegram",
      externalId: "88123456", duplicate: true,
    })
    const res = await POST(req(message("/help")))
    const packet = await res.json()
    assert.equal(packet.method, undefined)
    assert.equal(packet.duplicate, true)
    assert.equal(packet.stored, true)
  })
})

test("group updates never receive public-bot replies", async () => {
  await withEnv(async () => {
    globalThis.fetch = async () => Response.json({
      accepted: true, stored: true, source: "telegram",
      externalId: "88123456", duplicate: false,
    })
    const packet = await (await POST(req(message("/help", true)))).json()
    assert.equal(packet.method, undefined)
    assert.equal(packet.stored, true)
  })
})

test("public /ask invokes advisory-only Core contract, not account actions", async () => {
  await withEnv(async () => {
    process.env.WHALEZ_CORE_API_URL = "https://private-core.example.test"
    process.env.WHALEZ_AI_TELEGRAM_CORE_KEY = "synthetic-private-core-key"
    let coreInvocations = 0
    globalThis.fetch = async (input, init) => {
      if (String(input) === MAIL_URL) {
        return Response.json({
          accepted: true, stored: true, source: "telegram",
          externalId: "88123456", duplicate: false,
        })
      }
      assert.equal(String(input), "https://private-core.example.test/v1/intelligence/telegram-ask")
      assert.equal((init?.headers as Record<string, string>)["X-API-Key"],
        "synthetic-private-core-key")
      assert.deepEqual(JSON.parse(String(init?.body)),
        { question: "What is an API?" })
      coreInvocations++
      return Response.json({
        identity: "Whalez-AI", authority: "advisory-only", side_effects: false,
        answer: "An API is an interface for software communication.",
      })
    }
    const packet = await (await POST(req(message("/ask What is an API?")))).json()
    assert.equal(coreInvocations, 1)
    assert.equal(packet.method, "sendMessage")
    assert.match(packet.text, /software communication/)
    assert.match(packet.text, /No action or account change/)
  })
})

test("unsupported privileged commands cannot execute", async () => {
  const response = await publicTelegramReply("/withdraw 1000")
  assert.match(response || "", /unavailable/)
  assert.match((await publicTelegramReply("/status")) || "", /cannot|not available/i)
})
