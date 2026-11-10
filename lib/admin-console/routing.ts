import { approvedAdminHost, ADMIN_HOSTNAME } from "./policy"

export type ConsoleRouteDecision = "ordinary" | "deny" | "rewrite-admin" | "allow"

const allowed = new Set([
  "/admin-control",
  "/api/admin/overview",
  "/login",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
])

/** Only the approved Admin host can enter the dedicated subdomain routing surface. */
export function consoleRouteDecision(host: string | null, forwarded: string | null, path: string): ConsoleRouteDecision {
  const direct = (host || "").trim().toLowerCase()
  const forward = (forwarded || "").trim().toLowerCase()
  if (direct !== ADMIN_HOSTNAME && forward !== ADMIN_HOSTNAME) return "ordinary"
  if (!approvedAdminHost(host, forwarded)) return "deny"
  if (path === "/") return "rewrite-admin"
  if (allowed.has(path)) return "allow"
  return "deny"
}
