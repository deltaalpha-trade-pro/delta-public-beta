import { cookies } from "next/headers";
import {
  ok,
  err,
  demoMode,
  runplaneAuthEnabled,
  getRunplaneAuthUrl,
  authBridgeUnavailable,
  authHeaders,
  setAccessCookie,
  setRefreshCookie,
  clearAuthCookies,
  extractAccessToken,
  extractAccessTokenFromCookieHeader,
  extractRefreshToken,
  extractRefreshTokenFromCookieHeader,
  stripAuthSecrets,
} from "../_util";

export async function POST() {
  const access = cookies().get("access_token")?.value;
  const refresh = cookies().get("refresh_token")?.value;
  if (!access && !refresh) return err("unauthorized", 401);

  if (demoMode() && access?.startsWith("demo:")) {
    return ok({ ok: true, mode: "demo", simulationOnly: true });
  }

  if (!runplaneAuthEnabled()) return authBridgeUnavailable();
  const api = getRunplaneAuthUrl();
  if (!api) return authBridgeUnavailable();

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (refresh) {
    headers.Cookie = "refresh_token=" + encodeURIComponent(refresh);
  } else if (access) {
    Object.assign(headers, authHeaders(access));
  }

  try {
    const res = await fetch(api + "/auth/refresh", {
      method: "POST",
      headers,
      body: refresh ? JSON.stringify({ refresh_token: refresh }) : "{}",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) {
      clearAuthCookies();
      return ok(stripAuthSecrets(data), res.status);
    }
    if (!res.ok) return ok(stripAuthSecrets(data), res.status);

    const refreshedAccess =
      extractAccessToken(data) || extractAccessTokenFromCookieHeader(res.headers.get("set-cookie"));
    const refreshedRefresh =
      extractRefreshToken(data) || extractRefreshTokenFromCookieHeader(res.headers.get("set-cookie"));

    if (refreshedAccess && !setAccessCookie(refreshedAccess)) {
      clearAuthCookies();
      return err("Identity service returned an invalid refreshed access token.", 502);
    }
    if (!refreshedAccess && !access) {
      return err("Identity service reported refresh success without returning an access session.", 502);
    }
    if (refreshedRefresh && !setRefreshCookie(refreshedRefresh)) {
      clearAuthCookies();
      return err("Identity service returned an invalid refreshed refresh token.", 502);
    }
    return ok(stripAuthSecrets(data), res.status);
  } catch {
    return err("Identity service is unreachable; session refresh could not be completed.", 503);
  }
}
