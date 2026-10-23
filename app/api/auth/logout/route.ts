import { cookies } from "next/headers";
import {
  clearAuthCookies,
  ok,
  err,
  demoMode,
  runplaneAuthEnabled,
  getRunplaneAuthUrl,
  authBridgeUnavailable,
  authHeaders,
  stripAuthSecrets,
} from "../_util";

export async function POST() {
  const access = cookies().get("access_token")?.value;
  const refresh = cookies().get("refresh_token")?.value;

  // Clear browser-held credentials regardless of upstream availability.
  clearAuthCookies();
  if (demoMode()) return ok({ ok: true, mode: "demo", sessionCleared: true });
  if (!access && !refresh) return ok({ ok: true, sessionCleared: true });

  if (!runplaneAuthEnabled()) return authBridgeUnavailable();
  const api = getRunplaneAuthUrl();
  if (!api) return authBridgeUnavailable();

  try {
    const res = await fetch(api + "/auth/logout", {
      method: "POST",
      headers: authHeaders(access, refresh),
      body: refresh ? JSON.stringify({ refresh_token: refresh }) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    return ok(stripAuthSecrets({ ...data, sessionCleared: true }), res.status);
  } catch {
    return err("Local session was cleared, but the identity service could not confirm upstream logout.", 503);
  }
}
