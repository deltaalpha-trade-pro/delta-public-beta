import {
  ok,
  err,
  setAccessCookie,
  authBridgeConfigured,
  authBridgeUnavailable,
  runplaneAuthFetch,
  formBody,
  extractRunplaneSession,
  runplaneCookie,
  responseBody,
} from "../_util";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const normalizedEmail = String(email || "").toLowerCase().trim();
  const normalizedPassword = String(password || "");
  if (!normalizedEmail || !normalizedPassword) return err("Missing email or password", 400);

  if (!authBridgeConfigured()) return authBridgeUnavailable();

  let res: Response;
  try {
    res = await runplaneAuthFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ email: normalizedEmail, password: normalizedPassword }),
    });
  } catch {
    return err("Authentication service is temporarily unavailable. Please try again shortly.", 502);
  }

  const session = extractRunplaneSession(res);

  if (res.status >= 400) {
    const data = await responseBody(res);
    if (
      data &&
      typeof data === "object" &&
      (data as any).detail === "email_verification_required"
    ) {
      return err("Please verify your email before signing in.", 403);
    }
    return ok(data, res.status);
  }

  if (!session) {
    return err("Authentication session could not be established.", 502);
  }

  const me = await runplaneAuthFetch("/auth/me", {
    method: "GET",
    headers: { Cookie: runplaneCookie(session) },
  });
  const meData = await responseBody(me);

  if (!me.ok) {
    return err("Authentication session could not be verified.", 502);
  }

  await setAccessCookie(session);
  return ok({
    email: normalizedEmail,
    authenticated: true,
    sessionVerified: true,
    user: meData,
    mode: "runplane-auth",
  });
}
