import { cookies } from "next/headers";
import {
  ok,
  err,
  demoMode,
  runplaneAuthEnabled,
  getRunplaneAuthUrl,
  authBridgeUnavailable,
  authHeaders,
  clearAuthCookies,
  stripAuthSecrets,
} from "../_util";

export async function GET() {
  const access = cookies().get("access_token")?.value;
  const refresh = cookies().get("refresh_token")?.value;
  if (!access) return err(refresh ? "session refresh required" : "unauthorized", 401);

  if (demoMode() && access.startsWith("demo:")) {
    return ok({
      user_id: "demo-user",
      email: access.slice(5),
      risk_tier: "R0",
      verification_level: "V0",
      mode: "demo",
      simulationOnly: true,
    });
  }

  if (!runplaneAuthEnabled()) return authBridgeUnavailable();
  const api = getRunplaneAuthUrl();
  if (!api) return authBridgeUnavailable();

  try {
    const res = await fetch(api + "/auth/me", {
      method: "GET",
      headers: authHeaders(access, refresh),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 403 || (res.status === 401 && !refresh)) clearAuthCookies();
    return ok(stripAuthSecrets(data), res.status);
  } catch {
    return err("Identity service is unreachable; session status could not be verified.", 503);
  }
}
