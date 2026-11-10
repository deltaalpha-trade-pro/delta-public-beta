import "server-only"
import { createRemoteJWKSet, jwtVerify } from "jose"

const TEAM_ISSUER = "https://dry-hat-231a.cloudflareaccess.com"
const JWKS = createRemoteJWKSet(new URL(`${TEAM_ISSUER}/cdn-cgi/access/certs`))

/**
 * Verifies a per-application Cloudflare Access JWT, never a caller-supplied
 * email or a self-asserted MFA flag. The Access policy must enforce independent
 * MFA and a narrowly scoped identity allowlist before activation.
 */
export async function verifiedAdminAccessEmail(token: string | null): Promise<string | null> {
  if (!token) return null
  const audience = process.env.ADMIN_CLOUDFLARE_ACCESS_AUD?.trim()
  if (!audience || process.env.ADMIN_CLOUDFLARE_MFA_REQUIRED !== "true") return null
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: TEAM_ISSUER,
      audience,
      algorithms: ["RS256"],
      maxTokenAge: "1h",
      clockTolerance: "5s",
    })
    if (payload.type !== "app" || typeof payload.sub !== "string" || !payload.sub) return null
    if (typeof payload.email !== "string" || !payload.email.trim()) return null
    return payload.email.trim().toLowerCase()
  } catch {
    return null
  }
}
