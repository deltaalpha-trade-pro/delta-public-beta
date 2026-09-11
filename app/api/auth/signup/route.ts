import {
  ok,
  err,
  demoMode,
  authBridgeConfigured,
  authBridgeUnavailable,
  runplaneAuthFetch,
  formBody,
  responseBody,
} from "../_util";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  const normalizedEmail = String(email || "").toLowerCase().trim();
  const normalizedPassword = String(password || "");

  if (!normalizedEmail || !normalizedPassword) return err("Missing email or password", 400);

  if (demoMode()) {
    const { setAccessCookie } = await import("../_util");
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

  const res = await runplaneAuthFetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody({ email: normalizedEmail, password: normalizedPassword }),
  });

  const data = await responseBody(res);
  if (res.status >= 400) return ok(data, res.status);

  return ok(
    {
      ...(typeof data === "object" && data !== null ? data : {}),
      email: normalizedEmail,
      registered: true,
      mode: "runplane-auth",
    },
    201,
  );
}
