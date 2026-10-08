import {
  ok,
  err,
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
  if (normalizedPassword.length < 8) return err("Password must be at least 8 characters.", 400);
  if (!authBridgeConfigured()) return authBridgeUnavailable();

  let res: Response;
  try {
    res = await runplaneAuthFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ email: normalizedEmail, password: normalizedPassword }),
    });
  } catch {
    return err("Authentication service is temporarily unavailable. Please try again shortly.", 502);
  }

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
