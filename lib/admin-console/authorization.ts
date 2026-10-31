import "server-only"
import { headers } from "next/headers"
import {
  authBridgeConfigured,
  getAccessCookie,
  runplaneAuthFetch,
  runplaneCookie,
  responseBody,
} from "@/app/api/auth/_util"

import { approvedAdminHost, isVerifiedAdministrator } from "./policy"

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
