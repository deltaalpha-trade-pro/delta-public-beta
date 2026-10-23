import {
  ok,
  err,
  runplaneAuthEnabled,
  getRunplaneAuthUrl,
  authBridgeUnavailable,
  stripAuthSecrets,
  validEmail,
} from "../_util";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return err("A JSON object is required", 400);
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!validEmail(email)) return err("A valid email address is required", 400);
  if (!runplaneAuthEnabled()) return authBridgeUnavailable();
  const api = getRunplaneAuthUrl();
  if (!api) return authBridgeUnavailable();

  try {
    const res = await fetch(api + "/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => ({}));
    return ok(stripAuthSecrets(data), res.status);
  } catch {
    return err("Identity service is unreachable; verification email could not be requested.", 503);
  }
}
