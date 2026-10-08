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
  if (normalizedPassword.length < 10) return err("Use a password with at least 10 characters.", 400);
  if (!authBridgeConfigured()) return authBridgeUnavailable();

  let res: Response;
  try {
    res = await runplaneAuthFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ email: normalizedEmail, password: normalizedPassword }),
    });
  } catch {
    return err("Account registration is temporarily unavailable. Please try again shortly.", 502);
  }

  const data = await responseBody(res);
  if (res.status >= 400) return ok(data, res.status);

  return ok(
    {
      ...(typeof data === "object" && data !== null ? data : {}),
      email: normalizedEmail,
      registered: true,
      verification_required:
        data && typeof data === "object" && "verification_required" in data
          ? (data as any).verification_required !== false
          : true,
      mode: "runplane-auth",
    },
    201,
  );
}
