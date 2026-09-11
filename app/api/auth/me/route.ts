import {
  ok,
  err,
  demoMode,
  getAccessCookie,
  authBridgeConfigured,
  authBridgeUnavailable,
  runplaneAuthFetch,
  runplaneCookie,
  responseBody,
} from "../_util";

export async function GET() {
  const access = getAccessCookie();
  if (!access) return err("unauthorized", 401);

  if (demoMode()) {
    const email = access.startsWith("demo:") ? access.slice(5) : "user@demo";
    return ok({
      user_id: "demo-user",
      email,
      risk_tier: "R0",
      verification_level: "V0",
      mode: "demo",
    });
  }

  if (!authBridgeConfigured()) return authBridgeUnavailable();

  const res = await runplaneAuthFetch("/auth/me", {
    method: "GET",
    headers: { Cookie: runplaneCookie(access) },
  });

  const data = await responseBody(res);
  return ok(data, res.status);
}
