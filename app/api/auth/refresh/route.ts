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
  clearAccessCookie,
  extractAccessToken,
  extractAccessTokenFromCookieHeader,
  stripAuthSecrets,
} from "../_util";

export async function POST() {
  const access = cookies().get("access_token")?.value;
  if (!access) return err("unauthorized", 401);

  if (demoMode() && access.startsWith("demo:")) {
    return ok({ ok: true, mode: "demo", simulationOnly: true });
  }

  if (!runplaneAuthEnabled()) return authBridgeUnavailable();
  const api = getRunplaneAuthUrl();
  if (!api) return authBridgeUnavailable();

  try {
    const res = await fetch(api + "/auth/refresh", {
      method: "POST",
      headers: authHeaders(access),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 || res.status === 403) {
      clearAccessCookie();
      return ok(stripAuthSecrets(data), res.status);
    }
    if (!res.ok) return ok(stripAuthSecrets(data), res.status);

    const refreshed =
      extractAccessToken(data) || extractAccessTokenFromCookieHeader(res.headers.get("set-cookie"));
    if (refreshed && !setAccessCookie(refreshed)) {
      return err("Identity service returned an invalid refreshed session.", 502);
    }
    return ok(stripAuthSecrets(data), res.status);
  } catch {
    return err("Identity service is unreachable; session refresh could not be completed.", 503);
  }
}
