import { cookies } from "next/headers"

const SESSION_COOKIE = "session"

export function readSessionCookie() {
  return cookies().get(SESSION_COOKIE)?.value ?? null
}

export async function writeSessionCookie(sessionId: string) {
  const store = await cookies()
  store.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    path: "/",
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  })
}
