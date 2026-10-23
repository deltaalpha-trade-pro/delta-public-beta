import {
  ok,
  err,
  demoMode,
  runplaneAuthEnabled,
  getRunplaneAuthUrl,
  authBridgeUnavailable,
  clearAuthCookies,
  setAccessCookie,
  setRefreshCookie,
  extractAccessToken,
  extractAccessTokenFromCookieHeader,
  extractRefreshToken,
  extractRefreshTokenFromCookieHeader,
  stripAuthSecrets,
  validEmail,
} from "../_util";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return err("A JSON object is required", 400);
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const code = typeof input.code === "string" ? input.code.trim() : "";

  if (!validEmail(email)) return err("A valid email address is required", 400);
  if (!/^\d{6}$/.test(code)) return err("Enter the six-digit verification code", 400);
  if (demoMode()) return err("Demo sessions do not require email verification", 400);
  if (!runplaneAuthEnabled()) return authBridgeUnavailable();
  const api = getRunplaneAuthUrl();
  if (!api) return authBridgeUnavailable();

  try {
    const res = await fetch(api + "/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return ok(stripAuthSecrets(data), res.status);

    const accessToken =
      extractAccessToken(data) || extractAccessTokenFromCookieHeader(res.headers.get("set-cookie"));
    const refreshToken =
      extractRefreshToken(data) || extractRefreshTokenFromCookieHeader(res.headers.get("set-cookie"));
    if (!accessToken) {
      clearAuthCookies();
      return err("Identity service did not return a usable session after verification.", 502);
    }
    clearAuthCookies();
    if (!setAccessCookie(accessToken)) {
      clearAuthCookies();
      return err("Could not establish a verified session.", 502);
    }
    if (refreshToken && !setRefreshCookie(refreshToken)) {
      clearAuthCookies();
      return err("Identity service returned an invalid refresh session.", 502);
    }
    return ok(stripAuthSecrets(data), res.status);
  } catch {
    return err("Identity service is unreachable; email verification could not be completed.", 503);
  }
}
