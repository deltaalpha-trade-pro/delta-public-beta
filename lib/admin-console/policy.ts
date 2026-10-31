// Pure authorization predicates; safe to test independently of Next.js or provider APIs.
export const ADMIN_HOSTNAME = "console.deltaalpha-trade-pro.com"

export function approvedAdminHost(host: string | null, forwardedHost: string | null): boolean {
  const clean = (value: string | null) => (value || "").trim().toLowerCase()
  const direct = clean(host)
  const forwarded = clean(forwardedHost)
  // Both must match exactly; comma-separated forwarded hosts, :ports and preview domains fail closed.
  return direct === ADMIN_HOSTNAME && (!forwarded || forwarded === ADMIN_HOSTNAME)
}

export function isVerifiedAdministrator(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const user = value as Record<string, unknown>
  return user.role === "admin" && user.email_verified === true && user.mfa_verified === true
}
