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
  const { email, code, token } = await req.json().catch(() => ({}));
  const normalizedEmail = String(email || "").toLowerCase().trim();
  const normalizedCode = String(code || "").trim();
  const normalizedToken = String(token || "").trim();

  if (!normalizedEmail && !normalizedToken) {
    return err("Email or verification link is required.", 400);
  }
  if (normalizedCode && !normalizedEmail) {
    return err("Email is required when using a verification code.", 400);
  }
  if (!authBridgeConfigured()) return authBridgeUnavailable();

  try {
    const res = await runplaneAuthFetch("/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({
        email: normalizedEmail,
        code: normalizedCode,
        token: normalizedToken,
      }),
    });
    const data = await responseBody(res);
    return ok(data, res.status);
  } catch {
    return err(
      "Verification service is temporarily unavailable. Please try again shortly.",
      502,
    );
  }
}
