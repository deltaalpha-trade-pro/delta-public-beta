import { notFound } from "next/navigation"
import {
  authBridgeConfigured,
  getAccessCookie,
  runplaneAuthFetch,
  runplaneCookie,
  responseBody,
} from "@/app/api/auth/_util"

export const dynamic = "force-dynamic"
export const revalidate = 0

// Administrative access requires a live server-verified role and independently
// verified MFA claim. Client-side flags, account levels and token payloads
// supplied by the browser never grant authority.
function isVerifiedAdministrator(value: unknown): boolean {
  if (!value || typeof value !== "object") return false
  const user = value as Record<string, unknown>
  return (
    user.role === "admin" &&
    user.email_verified === true &&
    user.mfa_verified === true
  )
}

export default async function AdminControlPanelPage() {
  // Remains 404 until policy, identity, MFA and deployment review are complete.
  if (process.env.ADMIN_CONTROL_PANEL_ENABLED !== "true") notFound()

  const access = getAccessCookie()
  if (!access || !authBridgeConfigured()) notFound()

  let authorized = false
  try {
    // The backend verifies the signed session, current account role and MFA state.
    const response = await runplaneAuthFetch("/auth/me", {
      method: "GET",
      headers: { Cookie: runplaneCookie(access) },
    })
    if (response.ok) authorized = isVerifiedAdministrator(await responseBody(response))
  } catch {
    // Authentication service unavailable: deny rather than fall back to client claims.
    authorized = false
  }
  if (!authorized) notFound()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          DeltaAlpha-Trade-Pro
        </p>
        <h1 className="mt-4 text-3xl font-semibold">Admin Control Panel</h1>
        <p className="mt-4 text-muted-foreground">
          Authorized administration overview. This read-only entry point does
          not inherit Founder, ROOT, settlement, minting, secure-shell or
          internal governance authority.
        </p>
        <div className="mt-8 rounded-xl border border-border p-6">
          <h2 className="font-medium">Administration readiness</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Operational actions remain disabled until individually authorized
            APIs, audit logging and CSRF-protected workflows are reviewed.
          </p>
        </div>
      </div>
    </main>
  )
}
