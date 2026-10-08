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

  let res: Response;
  try {
    res = await runplaneAuthFetch("/auth/me", {
      method: "GET",
      headers: { Cookie: runplaneCookie(access) },
    });
  } catch {
    return err("Authentication service is temporarily unavailable. Please try again shortly.", 502);
  }

  const data = await responseBody(res);
  return ok(data, res.status);
}
