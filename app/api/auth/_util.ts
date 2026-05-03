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
    maxAge: 60 * 60,
  });
}

export function clearAccessCookie() {
  cookies().set("access_token", "", { path: "/", maxAge: 0 });
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

export function ok(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(detail: string, status = 400) {
  return NextResponse.json({ detail }, { status });
}
