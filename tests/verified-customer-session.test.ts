import test from "node:test"
import assert from "node:assert/strict"
import { verifiedCustomerSession } from "../lib/auth/verified-customer-session"

const valid = { email: "customer@example.org", email_verified: true, mode: "runplane-auth" }

test("accepts verified server-authenticated customer", () => {
  assert.equal(verifiedCustomerSession(valid), true)
  assert.equal(verifiedCustomerSession({ email: "customer@example.org", email_verified: true }), true)
})

test("denies missing, malformed or forged session claims", () => {
  for (const value of [
    null, undefined, "", 0, [], {}, { email_verified: true },
    { ...valid, email: "" },
    { ...valid, email: "not-an-email" },
    { ...valid, email_verified: false },
    { ...valid, email_verified: undefined },
    { ...valid, email_verified: "true" },
    { ...valid, mode: "demo" },
  ]) assert.equal(verifiedCustomerSession(value), false)
})
