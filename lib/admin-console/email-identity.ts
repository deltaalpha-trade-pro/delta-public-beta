/**
 * Administrative communications identity. This is a sending configuration,
 * NOT a receiving inbox and NOT an authorization to deliver a message.
 *
 * The verified Resend domain supports sender identities, but the plan's
 * independent inbox quota is currently exhausted. Replies use the existing
 * support inbox, whose provider delivery must still be tested.
 */
export const ADMIN_EMAIL_IDENTITY = Object.freeze({
  from: "DeltaAlpha-Trade-Pro Administration <admin@deltaalpha-trade-pro.com>",
  address: "admin@deltaalpha-trade-pro.com",
  replyTo: "support@deltaalpha-trade-pro.com",
  standaloneInboxProvisioned: false,
  automaticSendingEnabled: false,
  lastProviderCheck: "2026-11-01",
})

export function adminEmailHeaders() {
  return { from: ADMIN_EMAIL_IDENTITY.from, replyTo: ADMIN_EMAIL_IDENTITY.replyTo }
}
