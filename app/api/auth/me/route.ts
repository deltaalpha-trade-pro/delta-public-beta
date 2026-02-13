import { cookies } from "next/headers";
import { ok, err, demoMode } from "../_util";

export async function GET() {
  const access = cookies().get("access_token")?.value;
  if (!access) return err("unauthorized", 401);

  if (demoMode()) {
    const email = access.startsWith("demo:") ? access.slice(5) : "user@demo";
    return ok({
      user_id: "demo-user",
      email,
      risk_tier: "R0",
      verification_level: "V0",
      mode: "demo",
    });
  }

  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) return err("NEXT_PUBLIC_API_URL not set", 500);

  const res = await fetch(`${api}/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  return ok(data, res.status);
}
