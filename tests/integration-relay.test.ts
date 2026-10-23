import assert from "node:assert/strict"
import { test } from "node:test"

import { buildRelayEvent, relayEvent } from "../lib/integration-relay"

const ENV_KEYS = [
  "WHALEZ_INTERNAL_RELAY_TOKEN",
  "WHALEZ_MAIL_INGEST_URL",
  "WHALEZ_CONTROL_EVENT_URL",
] as const

type EnvKey = (typeof ENV_KEYS)[number]

async function withRelayEnv(
  values: Partial<Record<EnvKey, string>>,
  run: () => Promise<void>,
) {
  const previous = Object.fromEntries(
    ENV_KEYS.map((key) => [key, process.env[key]]),
  ) as Record<EnvKey, string | undefined>

  for (const key of ENV_KEYS) {
    const value = values[key]
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }

  try {
    await run()
  } finally {
    for (const key of ENV_KEYS) {
      const value = previous[key]
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

function event(verified = true) {
  return buildRelayEvent({
    source: "tidio",
    event: "conversation.updated",
    externalId: "test-event-001",
    payload: { webhook_id: "test-event-001" },
    verified,
  })
}

async function withFetch(
  implementation: typeof fetch,
  run: () => Promise<void>,
) {
  const originalFetch = globalThis.fetch
  globalThis.fetch = implementation
  try {
    await run()
  } finally {
    globalThis.fetch = originalFetch
  }
}

test("does not report an unverified event as delivered", async () => {
  await withRelayEnv(
    {
      WHALEZ_INTERNAL_RELAY_TOKEN: "test-internal-token",
      WHALEZ_MAIL_INGEST_URL: "https://mail.example.invalid/ingest",
    },
    async () => {
      let calls = 0
      await withFetch(
        (async () => {
          calls += 1
          return new Response(null, { status: 204 })
        }) as typeof fetch,
        async () => {
          await assert.rejects(
            relayEvent(event(false)),
            /Webhook delivery temporarily unavailable/,
          )
          assert.equal(calls, 0)
        },
      )
    },
  )
})

test("does not acknowledge when the internal relay token is missing", async () => {
  await withRelayEnv(
    { WHALEZ_MAIL_INGEST_URL: "https://mail.example.invalid/ingest" },
    async () => {
      let calls = 0
      await withFetch(
        (async () => {
          calls += 1
          return new Response(null, { status: 204 })
        }) as typeof fetch,
        async () => {
          await assert.rejects(
            relayEvent(event()),
            /Webhook delivery temporarily unavailable/,
          )
          assert.equal(calls, 0)
        },
      )
    },
  )
})

test("does not acknowledge when no relay destinations are configured", async () => {
  await withRelayEnv(
    { WHALEZ_INTERNAL_RELAY_TOKEN: "test-internal-token" },
    async () => {
      await assert.rejects(
        relayEvent(event()),
        /Webhook delivery temporarily unavailable/,
      )
    },
  )
})

test("reports delivery only when every configured target succeeds", async () => {
  await withRelayEnv(
    {
      WHALEZ_INTERNAL_RELAY_TOKEN: "test-internal-token",
      WHALEZ_MAIL_INGEST_URL: "https://mail.example.invalid/ingest",
      WHALEZ_CONTROL_EVENT_URL: "https://control.example.invalid/events",
    },
    async () => {
      let calls = 0
      await withFetch(
        (async () => {
          calls += 1
          return new Response(null, { status: 204 })
        }) as typeof fetch,
        async () => {
          const result = await relayEvent(event())
          assert.equal(result.forwarded, true)
          assert.equal(result.targets.length, 2)
          assert.ok(result.targets.every((target) => target.status === "forwarded"))
          assert.equal(calls, 2)
        },
      )
    },
  )
})

test("does not acknowledge partial delivery when a target returns a failure", async () => {
  await withRelayEnv(
    {
      WHALEZ_INTERNAL_RELAY_TOKEN: "test-internal-token",
      WHALEZ_MAIL_INGEST_URL: "https://mail.example.invalid/ingest",
      WHALEZ_CONTROL_EVENT_URL: "https://control.example.invalid/events",
    },
    async () => {
      await withFetch(
        (async (input: RequestInfo | URL) => {
          const url = String(input)
          return new Response(null, { status: url.includes("mail.example.invalid") ? 503 : 204 })
        }) as typeof fetch,
        async () => {
          await assert.rejects(
            relayEvent(event()),
            /Webhook delivery temporarily unavailable/,
          )
        },
      )
    },
  )
})

test("does not acknowledge when a downstream network request throws", async () => {
  await withRelayEnv(
    {
      WHALEZ_INTERNAL_RELAY_TOKEN: "test-internal-token",
      WHALEZ_MAIL_INGEST_URL: "https://mail.example.invalid/ingest",
    },
    async () => {
      await withFetch(
        (async () => {
          throw new Error("simulated network outage")
        }) as typeof fetch,
        async () => {
          await assert.rejects(
            relayEvent(event()),
            /Webhook delivery temporarily unavailable/,
          )
        },
      )
    },
  )
})
