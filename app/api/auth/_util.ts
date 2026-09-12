import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function demoMode(): boolean {
  return (process.env.AUTH_DEMO_MODE || "false").toLowerCase() === "true";
}

export function runplaneAuthEnabled(): boolean {
  return (process.env.RUNPLANE_AUTH_ENABLED || "false").toLowerCase() === "true";
}

export function getRunplaneAuthUrl(): string | null {
  const value = process.env.RUNPLANE_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "";
  return value.trim() ? value.replace(/\/$/, "") : null;
}

export function setAccessCookie(value: string) {
  cookies().set("access_token", value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
  });
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

export function getAccessCookie(): string | null {
  return cookies().get("access_token")?.value || null;
}

export function extractAccessToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const direct = record.access_token || record.accessToken || record.token;
  if (typeof direct === "string" && direct.length > 0) return direct;

  const session = record.session;
  if (session && typeof session === "object") {
    const sessionRecord = session as Record<string, unknown>;
    const sessionToken = sessionRecord.access_token || sessionRecord.accessToken || sessionRecord.token;
    if (typeof sessionToken === "string" && sessionToken.length > 0) return sessionToken;
  }

  return null;
}

export function authBridgeUnavailable() {
  return err(
    "Runplane auth bridge is not configured for this deployment. Set RUNPLANE_AUTH_ENABLED=true and RUNPLANE_AUTH_URL to activate real auth.",
    503,
  );
}

export function authBridgeConfigured(): boolean {
  return runplaneAuthEnabled() && !!getRunplaneAuthUrl();
}

export async function runplaneAuthFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = getRunplaneAuthUrl();
  if (!base) throw new Error("RUNPLANE_AUTH_URL not set");

  return fetch(`${base}${path}`, {
    ...init,
    redirect: "manual",
    cache: "no-store",
  });
}

export function formBody(values: Record<string, string>): string {
  return new URLSearchParams(values).toString();
}

export function extractRunplaneSession(response: Response): string | null {
  const header = response.headers.get("set-cookie") || "";
  const match = header.match(/(?:^|,\s*)(?:__Host_rp|rp)=([^;]+)/i);
  return match?.[1] || null;
}

export function runplaneCookie(value: string): string {
  return `rp=${value}`;
}

export async function responseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text };
  }
}

export function ok(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(detail: string, status = 400) {
  return NextResponse.json({ detail }, { status });
}
