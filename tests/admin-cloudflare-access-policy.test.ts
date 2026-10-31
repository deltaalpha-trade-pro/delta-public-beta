import test from "node:test"
import assert from "node:assert/strict"
import { administratorMatchesAccessIdentity } from "../lib/admin-console/policy"

test("Cloudflare and Runplane must agree on one verified admin email", () => {
  const admin = { role: "admin", email_verified: true, email: "Admin@Example.org" }
  assert.equal(administratorMatchesAccessIdentity(admin, "admin@example.org"), true)
  assert.equal(administratorMatchesAccessIdentity(admin, "OTHER@example.org"), false)
  assert.equal(administratorMatchesAccessIdentity(admin, ""), false)
  assert.equal(administratorMatchesAccessIdentity({ ...admin, role: "customer" }, "admin@example.org"), false)
  assert.equal(administratorMatchesAccessIdentity({ ...admin, email_verified: false }, "admin@example.org"), false)
  assert.equal(administratorMatchesAccessIdentity({ ...admin, email_verified: "true" }, "admin@example.org"), false)
  assert.equal(administratorMatchesAccessIdentity({ ...admin, email: undefined }, "admin@example.org"), false)
  assert.equal(administratorMatchesAccessIdentity(null, "admin@example.org"), false)
})
