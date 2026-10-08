import {
  clearAccessCookie,
  ok,
  getAccessCookie,
  authBridgeConfigured,
  authBridgeUnavailable,
  runplaneAuthFetch,
  runplaneCookie,
  responseBody,
} from "../_util";

export async function POST() {
  const access = getAccessCookie();
  if (!access) {
    clearAccessCookie();
    return ok({ ok: true });
  }

  if (!authBridgeConfigured()) {
    clearAccessCookie();
    return authBridgeUnavailable();
  }

  try {
    const res = await runplaneAuthFetch("/auth/logout", {
      method: "POST",
      headers: { Cookie: runplaneCookie(access) },
    });
    const data = await responseBody(res);
    clearAccessCookie();
    return ok({ ...(typeof data === "object" && data !== null ? data : {}), ok: res.ok }, res.status);
  } catch {
    clearAccessCookie();
    return err("Authentication service is temporarily unavailable. Please try again shortly.", 502);
  }
}
