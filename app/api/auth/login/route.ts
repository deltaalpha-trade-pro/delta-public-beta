import {
  ok,
  err,
  demoMode,
  setAccessCookie,
  authBridgeConfigured,
  authBridgeUnavailable,
  runplaneAuthFetch,
  formBody,
  extractRunplaneSession,
  responseBody,
} from "../_util";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const normalizedEmail = String(email || "").toLowerCase().trim();
  const normalizedPassword = String(password || "");
  if (!normalizedEmail || !normalizedPassword) return err("Missing email or password", 400);

  if (demoMode()) {
    setAccessCookie(`demo:${normalizedEmail}`);
    return ok({
      user_id: crypto.randomUUID(),
      email: normalizedEmail,
      risk_tier: "R0",
      verification_level: "V0",
      mode: "demo",
    });
  }

  if (!authBridgeConfigured()) return authBridgeUnavailable();

  const res = await runplaneAuthFetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody({ email: normalizedEmail, password: normalizedPassword }),
  });

  const session = extractRunplaneSession(res);
  if (res.status >= 400 || !session) {
    const data = await responseBody(res);
    return ok(data, res.status >= 400 ? res.status : 502);
  }

  setAccessCookie(session);
  return ok({
    email: normalizedEmail,
    authenticated: true,
    mode: "runplane-auth",
  });
}
