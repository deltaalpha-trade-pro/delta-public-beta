import {
  ok,
  err,
  demoMode,
  setAccessCookie,
  clearAuthCookies,
  clearRefreshCookie,
  setRefreshCookie,
  runplaneAuthEnabled,
  getRunplaneAuthUrl,
  authBridgeUnavailable,
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
  const password = typeof input.password === "string" ? input.password : "";

  if (!validEmail(email)) return err("A valid email address is required", 400);
  if (password.length < 8 || password.length > 1024) {
    return err("Password must be between 8 and 1024 characters", 400);
  }

  if (demoMode()) {
    clearRefreshCookie();
    if (!setAccessCookie("demo:" + email)) return err("Could not establish demo session", 500);
    return ok({
      user_id: "demo-user",
      email,
      risk_tier: "R0",
      verification_level: "V0",
      mode: "demo",
      simulationOnly: true,
    }, 201);
  }

  if (!runplaneAuthEnabled()) return authBridgeUnavailable();
  const api = getRunplaneAuthUrl();
  if (!api) return authBridgeUnavailable();

  try {
    const res = await fetch(api + "/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return ok(stripAuthSecrets(data), res.status);

    // Email-verification is a successful signup stage, not a missing-token error.
    if (data && typeof data === "object" && (data as Record<string, unknown>).verification_required === true) {
      return ok(stripAuthSecrets(data), res.status);
    }

    const token =
      extractAccessToken(data) || extractAccessTokenFromCookieHeader(res.headers.get("set-cookie"));
    const refreshToken =
      extractRefreshToken(data) || extractRefreshTokenFromCookieHeader(res.headers.get("set-cookie"));
    if (!token || !setAccessCookie(token)) {
      clearAuthCookies();
      return err("Identity service returned success without a usable access session; account setup was not completed.", 502);
    }

    clearRefreshCookie();
    if (refreshToken && !setRefreshCookie(refreshToken)) {
      clearAuthCookies();
      return err("Identity service returned an invalid refresh session; account setup was not completed.", 502);
    }

    return ok(stripAuthSecrets(data), res.status);
  } catch {
    return err("Identity service is unreachable; no account session was established.", 503);
  }
}
