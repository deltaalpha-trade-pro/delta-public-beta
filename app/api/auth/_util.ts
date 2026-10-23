import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TOKEN_KEYS = new Set([
  "access_token",
  "accesstoken",
  "token",
  "refresh_token",
  "refreshtoken",
  "id_token",
  "idtoken",
  "password",
  "client_secret",
  "authorization",
]);

export function demoMode(): boolean {
  return (process.env.AUTH_DEMO_MODE || "false").toLowerCase() === "true";
}

export function runplaneAuthEnabled(): boolean {
  return (process.env.RUNPLANE_AUTH_ENABLED || "false").toLowerCase() === "true";
}

export function getRunplaneAuthUrl(): string | null {
  const value = (process.env.RUNPLANE_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "").trim();
  if (!value) return null;

  try {
    const parsed = new URL(value);
    if (parsed.username || parsed.password) return null;
    if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") return null;
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    return value.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function validEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

export function setAccessCookie(value: string): boolean {
  if (!value || value.length > 8192 || /[;\r\n]/.test(value)) return false;
  cookies().set("access_token", value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
  });
  return true;
}

export function setRefreshCookie(value: string): boolean {
  if (!value || value.length > 8192 || /[;\r\n]/.test(value)) return false;
  cookies().set("refresh_token", value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/api/auth/refresh",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}

export function clearAccessCookie() {
  cookies().set("access_token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export function clearRefreshCookie() {
  cookies().set("refresh_token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/api/auth/refresh",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export function clearAuthCookies() {
  clearAccessCookie();
  clearRefreshCookie();
}

export function extractAccessToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const direct = record.access_token || record.accessToken || record.token;
  if (typeof direct === "string" && direct.length > 0) return direct;

  for (const key of ["session", "data", "result"]) {
    const nested = record[key];
    if (nested && typeof nested === "object") {
      const token = extractAccessToken(nested);
      if (token) return token;
    }
  }
  return null;
}

export function extractAccessTokenFromCookieHeader(setCookie: string | null): string | null {
  if (!setCookie) return null;
  const match = /(?:^|[,;]\s*)access_token=([^;,\s]+)/i.exec(setCookie);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function extractRefreshToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const direct = record.refresh_token || record.refreshToken;
  if (typeof direct === "string" && direct.length > 0) return direct;
  for (const key of ["session", "data", "result"]) {
    const nested = record[key];
    if (nested && typeof nested === "object") {
      const token = extractRefreshToken(nested);
      if (token) return token;
    }
  }
  return null;
}

export function extractRefreshTokenFromCookieHeader(setCookie: string | null): string | null {
  if (!setCookie) return null;
  const match = /(?:^|[,;]\\s*)refresh_token=([^;,\\s]+)/i.exec(setCookie);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function stripAuthSecrets(data: unknown): unknown {
  if (Array.isArray(data)) return data.map(stripAuthSecrets);
  if (!data || typeof data !== "object") return data;

  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const normalized = key.toLowerCase().replace(/[-\s]/g, "_");
    if (TOKEN_KEYS.has(normalized)) continue;
    output[key] = stripAuthSecrets(value);
  }
  return output;
}

export function authHeaders(accessToken?: string, refreshToken?: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = "Bearer " + accessToken;
  const cookieParts: string[] = [];
  if (accessToken) cookieParts.push("access_token=" + encodeURIComponent(accessToken));
  if (refreshToken) cookieParts.push("refresh_token=" + encodeURIComponent(refreshToken));
  if (cookieParts.length) headers.Cookie = cookieParts.join("; ");
  return headers;
}

export function authBridgeUnavailable() {
  return err(
    "Runplane auth is not configured for this deployment. Set RUNPLANE_AUTH_ENABLED=true and RUNPLANE_AUTH_URL to enable real account authentication.",
    503,
  );
}

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(detail: string, status = 400) {
  return NextResponse.json({ detail }, { status });
}
