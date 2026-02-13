export type AuthMe = {
  user_id: string;
  email: string;
  risk_tier: "R0" | "R1" | "R2" | "R3";
  verification_level: "V0" | "V1" | "V2" | "V3";
};

export async function authMe(): Promise<AuthMe | null> {
  const res = await fetch("/api/auth/me", { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as AuthMe;
}

export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
}

export async function signup(email: string, password: string) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res;
}

export async function logout() {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  return res;
}
