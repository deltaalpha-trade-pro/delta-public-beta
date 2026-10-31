import test from "node:test"
import assert from "node:assert/strict"
import { ADMIN_EMAIL_IDENTITY, adminEmailHeaders } from "../lib/admin-console/email-identity"

test("Admin sender is on the verified domain, with replies to existing support", () => {
  assert.equal(ADMIN_EMAIL_IDENTITY.address, "admin@deltaalpha-trade-pro.com")
  assert.equal(ADMIN_EMAIL_IDENTITY.replyTo, "support@deltaalpha-trade-pro.com")
  assert.equal(adminEmailHeaders().from, ADMIN_EMAIL_IDENTITY.from)
  assert.equal(adminEmailHeaders().replyTo, ADMIN_EMAIL_IDENTITY.replyTo)
  assert.equal(ADMIN_EMAIL_IDENTITY.standaloneInboxProvisioned, false)
  assert.equal(ADMIN_EMAIL_IDENTITY.automaticSendingEnabled, false)
})
