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

export async function POST() {
  if (demoMode()) return ok({ ok: true, mode: "demo" });

  if (!authBridgeConfigured()) return authBridgeUnavailable();

  const access = getAccessCookie();
  if (!access) return err("unauthorized", 401);

  // runplane-auth has a 12-hour JWT session but no refresh endpoint.
  // Validate the current session instead of inventing a refresh contract.
  const res = await runplaneAuthFetch("/auth/me", {
    method: "GET",
    headers: { Cookie: runplaneCookie(access) },
  });

  const data = await responseBody(res);
  if (!res.ok) return ok(data, res.status);

  return ok({
    ok: true,
    refreshed: false,
    mode: "runplane-auth",
    user: data,
  });
}
