import test from "node:test"
import assert from "node:assert/strict"
import { approvedAdminHost, isVerifiedAdministrator } from "../lib/admin-console/policy"

test("accepts only the exact Admin subdomain without forwarded-host disagreement", () => {
  assert.equal(approvedAdminHost("console.deltaalpha-trade-pro.com", null), true)
  assert.equal(approvedAdminHost("CONSOLE.DELTAALPHA-TRADE-PRO.COM", "console.deltaalpha-trade-pro.com"), true)
  for (const host of [
    "www.deltaalpha-trade-pro.com",
    "alpha.deltaalpha-trade-pro.com",
    "console.deltaalpha-trade-pro.com.attacker.net",
    "console.deltaalpha-trade-pro.com:443",
    "delta-public-beta.vercel.app",
    null,
  ]) assert.equal(approvedAdminHost(host, null), false)
  assert.equal(approvedAdminHost("console.deltaalpha-trade-pro.com", "evil.example"), false)
  assert.equal(approvedAdminHost("console.deltaalpha-trade-pro.com", "console.deltaalpha-trade-pro.com, evil.example"), false)
})

test("all three server-side authorization claims are required", () => {
  const ok = { role: "admin", email_verified: true, mfa_verified: true }
  assert.equal(isVerifiedAdministrator(ok), true)
  const variants: unknown[] = [
    null, {}, [], { ...ok, role: "founder" }, { ...ok, role: "member" },
    { ...ok, email_verified: "true" }, { ...ok, mfa_verified: "true" },
    { ...ok, mfa_verified: false }, { ...ok, email_verified: false },
    { ...ok, mfa_verified: undefined },
  ]
  for (const candidate of variants) assert.equal(isVerifiedAdministrator(candidate), false)
})
