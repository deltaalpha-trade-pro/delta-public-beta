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
  const { email } = await req.json().catch(() => ({}));
  const normalizedEmail = String(email || "").toLowerCase().trim();

  if (!normalizedEmail) return err("Email is required.", 400);
  if (!authBridgeConfigured()) return authBridgeUnavailable();

  try {
    const res = await runplaneAuthFetch("/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody({ email: normalizedEmail }),
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
