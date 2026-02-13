import { ok, err, demoMode } from "../_util";

export async function POST() {
  // Demo mode does nothing; access cookie is short-lived.
  if (demoMode()) return ok({ ok: true, mode: "demo" });

  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) return err("NEXT_PUBLIC_API_URL not set", 500);

  const res = await fetch(`${api}/auth/refresh`, { method: "POST", credentials: "include" });
  const data = await res.json().catch(() => ({}));
  return ok(data, res.status);
}
