/** Verify Runplane-authenticated customer session claims returned by /api/auth/me.
 * Only the server's response is considered; a browser cookie alone is not identity.
 */
export function verifiedCustomerSession(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const session = value as Record<string, unknown>
  return session.email_verified === true &&
    typeof session.email === "string" &&
    session.email.trim().includes("@") &&
    session.mode !== "demo"
}
