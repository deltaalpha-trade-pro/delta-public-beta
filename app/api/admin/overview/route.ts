import { adminAccessGranted } from "@/lib/admin-console/authorization"
import { adminIntegrationReadiness } from "@/lib/admin-console/readiness"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
}

export async function GET() {
  // Read-only. This API is never reachable on www or a direct Vercel hostname.
  // The authorization layer additionally requires a server-verified admin,
  // email verification, MFA and the approved console Host.
  if (!(await adminAccessGranted())) {
    return new Response(null, { status: 404, headers: PRIVATE_HEADERS })
  }

  const readiness = adminIntegrationReadiness()
  return Response.json({
    service: "deltaalpha-admin",
    mode: "read-only",
    productionCertified: false,
    operatorActionsEnabled: false,
    source: "deployment-configuration-only",
    observedAt: new Date().toISOString(),
    integrations: readiness,
    notices: [
      "Configured does not mean operational.",
      "No customer messages, API credentials, trading balances or private keys are returned.",
      "Resend inbox and webhook states require separate provider-side observer verification.",
      "Tidio live operator availability requires provider-side verification.",
    ],
  }, { status: 200, headers: PRIVATE_HEADERS })
}
