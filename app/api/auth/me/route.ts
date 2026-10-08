import {
  ok,
  err,
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

  if (!authBridgeConfigured()) return authBridgeUnavailable();

  const res = await runplaneAuthFetch("/auth/me", {
    method: "GET",
    headers: { Cookie: runplaneCookie(access) },
  });

  const data = await responseBody(res);
  return ok(data, res.status);
}
