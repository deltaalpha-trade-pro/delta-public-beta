import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function demoMode(): boolean {
  return (process.env.AUTH_DEMO_MODE || "true").toLowerCase() === "true";
}

export function setAccessCookie(value: string) {
  cookies().set("access_token", value, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15,
  });
}

export function clearAccessCookie() {
  cookies().set("access_token", "", { path: "/", maxAge: 0 });
}

export function ok(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(detail: string, status = 400) {
  return NextResponse.json({ detail }, { status });
}
