import { NextResponse } from "next/server"

import { clearSessionCookie, readSessionCookie, writeSessionCookie } from "@/lib/platform/session"

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

export function err(detail: string, status = 400) {
  return NextResponse.json({ detail }, { status })
}

export function setPlatformSession(sessionId: string) {
  writeSessionCookie(sessionId)
}

export function clearPlatformSession() {
  clearSessionCookie()
}

export function currentSessionId() {
  return readSessionCookie()
}
