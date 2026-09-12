export type AuthMe = {
  user_id: string;
  email: string;
  risk_tier: "R0" | "R1" | "R2" | "R3";
  verification_level: "V0" | "V1" | "V2" | "V3";
};

const SAFE_ERROR_MAX_LENGTH = 240;
const HTML_OR_DOCUMENT_PATTERN = /<!doctype|<html|<head|<body|<script|<style|cloudflare|server error/i;

function safeDetail(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const detail = value.trim();
  if (!detail || detail.length > SAFE_ERROR_MAX_LENGTH || HTML_OR_DOCUMENT_PATTERN.test(detail)) return fallback;
  return detail;
}

export async function readAuthError(res: Response, fallback: string): Promise<string> {
  try {
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) return fallback;

    const data = await res.json();
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      return safeDetail(record.detail, fallback);
    }
  } catch {
    // Keep public authentication errors generic when the response is malformed.
  }
  return fallback;
}

export async function authMe(): Promise<AuthMe | null> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || typeof data !== "object") return null;
    return data as AuthMe;
  } catch {
    return null;
  }
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
