import test from "node:test"
import assert from "node:assert/strict"
import { verifyTidioWebhook } from "../lib/integration-relay"

test("Unsigned Tidio events are rejected", () => {
  assert.equal(verifyTidioWebhook("{}", null, "fixture").verified, false)
})

test("Malformed Tidio signature timestamps are rejected", () => {
  assert.equal(verifyTidioWebhook("{}", "t=invalid,s=none", "fixture").verified, false)
})
