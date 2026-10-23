import { cookies } from "next/headers";
import {
  clearAccessCookie,
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

  // Clear the browser session regardless of upstream availability.
  clearAccessCookie();
  if (demoMode()) return ok({ ok: true, mode: "demo", sessionCleared: true });
  if (!access) return ok({ ok: true, sessionCleared: true });

  if (!runplaneAuthEnabled()) return authBridgeUnavailable();
  const api = getRunplaneAuthUrl();
  if (!api) return authBridgeUnavailable();

  try {
    const res = await fetch(api + "/auth/logout", {
      method: "POST",
      headers: authHeaders(access),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    return ok(stripAuthSecrets({ ...data, sessionCleared: true }), res.status);
  } catch {
    return err("Local session was cleared, but the identity service could not confirm upstream logout.", 503);
  }
}
