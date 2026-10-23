export type AuthMe = {
  user_id: string;
  email: string;
  risk_tier: "R0" | "R1" | "R2" | "R3";
  verification_level: "V0" | "V1" | "V2" | "V3";
  mode?: "demo" | "internal" | "public";
  simulationOnly?: boolean;
};

export async function authMe(): Promise<AuthMe | null> {
  let res = await fetch("/api/auth/me", {
    cache: "no-store",
    credentials: "same-origin",
  });

  // An expired access token may still have a valid HttpOnly refresh cookie.
  if (res.status === 401) {
    const refreshed = await fetch("/api/auth/refresh", {
      method: "POST",
      cache: "no-store",
      credentials: "same-origin",
    }).catch(() => null);
    if (refreshed?.ok) {
      res = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "same-origin",
      });
    }
  }

  if (!res.ok) return null;
  const data = (await res.json().catch(() => null)) as AuthMe | null;
  if (!data || typeof data.user_id !== "string" || typeof data.email !== "string") return null;
  return data;
}

export async function login(email: string, password: string) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(email: string, password: string) {
  return fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    cache: "no-store",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
  });
}
