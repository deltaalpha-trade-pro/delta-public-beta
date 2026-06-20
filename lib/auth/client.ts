import type { AccountLevel, PublicPlatformState } from "@/lib/platform/types"

export type AuthMe = PublicPlatformState

async function jsonRequest(path: string, options?: RequestInit) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  })

  return res
}

export async function authMe(): Promise<AuthMe | null> {
  const res = await fetch("/api/auth/me", { cache: "no-store" })
  if (!res.ok) return null
  return (await res.json()) as AuthMe
}

export async function login(email: string, password: string) {
  return jsonRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function signup(input: {
  email: string
  password: string
  fullName?: string
  company?: string
  accountLevel?: AccountLevel
}) {
  return jsonRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function recover(email: string) {
  return jsonRequest("/api/auth/recover", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function submitOnboarding(input: {
  fullName: string
  company?: string
  accountLevel: AccountLevel
  acceptPolicy: boolean
  acceptRisk: boolean
  walkthroughCompleted: boolean
  requestVerification: boolean
}) {
  return jsonRequest("/api/onboarding", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function fetchPlatformState() {
  const res = await fetch("/api/platform/state", { cache: "no-store" })
  if (!res.ok) return null
  return (await res.json()) as PublicPlatformState
}

export async function logout() {
  return fetch("/api/auth/logout", { method: "POST" })
}
