import "server-only"
import { headers } from "next/headers"
import {
  authBridgeConfigured,
  getAccessCookie,
  runplaneAuthFetch,
  runplaneCookie,
  responseBody,
} from "@/app/api/auth/_util"

import { approvedAdminHost, administratorMatchesAccessIdentity } from "./policy"
import { verifiedAdminAccessEmail } from "./cloudflare-access"

export async function adminAccessGranted(): Promise<boolean> {
  // No default activation. Production needs independent Founder security review.
  if (process.env.ADMIN_CONTROL_PANEL_ENABLED !== "true") return false
  const requestHeaders = headers()
  if (!approvedAdminHost(requestHeaders.get("host"), requestHeaders.get("x-forwarded-host"))) return false
  // Zero Trust must validate identity + independent MFA before any Runplane role is accepted.
  const accessEmail = await verifiedAdminAccessEmail(requestHeaders.get("cf-access-jwt-assertion"))
  if (!accessEmail) return false
  const token = getAccessCookie()
  if (!token || !authBridgeConfigured()) return false

  try {
    const response = await runplaneAuthFetch("/auth/me", {
      method: "GET",
      headers: { Cookie: runplaneCookie(token) },
    })
    if (!response.ok) return false
    return administratorMatchesAccessIdentity(await responseBody(response), accessEmail)
  } catch {
    return false // fail closed; never trust client-supplied claims
  }
}
