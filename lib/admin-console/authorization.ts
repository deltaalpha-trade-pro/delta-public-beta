import "server-only"
import { headers } from "next/headers"
import {
  authBridgeConfigured,
  getAccessCookie,
  runplaneAuthFetch,
  runplaneCookie,
  responseBody,
} from "@/app/api/auth/_util"

// The separate Admin hostname is never synonymous with the Founder Console.
// A deployment's direct *.vercel.app name does not grant admin access.
export const ADMIN_HOSTNAME = "console.deltaalpha-trade-pro.com"

export function approvedAdminHost(host: string | null, forwardedHost: string | null): boolean {
  const clean = (value: string | null) => (value || "").trim().toLowerCase()
  const direct = clean(host)
  const forwarded = clean(forwardedHost)
  // No comma-separated X-Forwarded-Host lists or unexpected ports allowed.
  return direct === ADMIN_HOSTNAME && (!forwarded || forwarded === ADMIN_HOSTNAME)
}

export function isVerifiedAdministrator(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const user = value as Record<string, unknown>
  return user.role === "admin" && user.email_verified === true && user.mfa_verified === true
}

export async function adminAccessGranted(): Promise<boolean> {
  // No default activation. Production needs independent Founder security review.
  if (process.env.ADMIN_CONTROL_PANEL_ENABLED !== "true") return false
  const requestHeaders = headers()
  if (!approvedAdminHost(requestHeaders.get("host"), requestHeaders.get("x-forwarded-host"))) return false
  const token = getAccessCookie()
  if (!token || !authBridgeConfigured()) return false

  try {
    const response = await runplaneAuthFetch("/auth/me", {
      method: "GET",
      headers: { Cookie: runplaneCookie(token) },
    })
    if (!response.ok) return false
    return isVerifiedAdministrator(await responseBody(response))
  } catch {
    return false // fail closed; never trust client-supplied claims
  }
}
