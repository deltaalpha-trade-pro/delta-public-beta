import {
  clearAccessCookie,
  ok,
  demoMode,
  getAccessCookie,
  authBridgeConfigured,
  authBridgeUnavailable,
  runplaneAuthFetch,
  runplaneCookie,
  responseBody,
} from "../_util";

export async function POST() {
  if (demoMode()) {
    clearAccessCookie();
    return ok({ ok: true, mode: "demo" });
  }

  if (!authBridgeConfigured()) return authBridgeUnavailable();

  const access = getAccessCookie();
  if (access) {
    const res = await runplaneAuthFetch("/auth/logout", {
      method: "POST",
      headers: { Cookie: runplaneCookie(access) },
    });
    const data = await responseBody(res);
    clearAccessCookie();
    return ok({ ...(typeof data === "object" && data !== null ? data : {}), ok: res.ok }, res.status);
  }

  clearAccessCookie();
  return ok({ ok: true, mode: "runplane-auth" });
}
