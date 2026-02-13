import { clearAccessCookie, ok, demoMode, err } from "../_util";

export async function POST() {
  if (demoMode()) {
    clearAccessCookie();
    return ok({ ok: true, mode: "demo" });
  }

  const api = process.env.NEXT_PUBLIC_API_URL;
  if (!api) return err("NEXT_PUBLIC_API_URL not set", 500);

  const res = await fetch(`${api}/auth/logout`, { method: "POST", credentials: "include" });
  const data = await res.json().catch(() => ({}));
  // Clear local access cookie as well (backend may also clear refresh cookie)
  clearAccessCookie();
  return ok(data, res.status);
}
