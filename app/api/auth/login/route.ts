import { ok, err, demoMode, setAccessCookie } from "../_util";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) return err("Missing email or password", 400);

  if (demoMode()) {
    setAccessCookie(`demo:${String(email).toLowerCase()}`);
    return ok({
      user_id: crypto.randomUUID(),
      email: String(email).toLowerCase(),
      risk_tier: "R0",
      verification_level: "V0",
      mode: "demo",
    });
  }

  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) return err("NEXT_PUBLIC_API_URL not set", 500);

  const res = await fetch(`${api}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  return ok(data, res.status);
}
