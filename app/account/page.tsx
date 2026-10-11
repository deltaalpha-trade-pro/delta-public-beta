"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, UserRound } from "lucide-react"

const riskTiers = ["R0", "R1", "R2", "R3"] as const
const verificationLevels = ["V0", "V1", "V2", "V3"] as const

type AccountProfile = {
  user_id: string
  email: string
  risk_tier: (typeof riskTiers)[number]
  verification_level: (typeof verificationLevels)[number]
}

type AccountLoadState = "loading" | "authenticated" | "signed-out" | "unavailable"

function isAccountProfile(value: unknown): value is AccountProfile {
  if (!value || typeof value !== "object") return false
  const record = value as Record<string, unknown>
  return (
    typeof record.user_id === "string" &&
    record.user_id.trim().length > 0 &&
    typeof record.email === "string" &&
    record.email.trim().length > 0 &&
    riskTiers.includes(record.risk_tier as (typeof riskTiers)[number]) &&
    verificationLevels.includes(record.verification_level as (typeof verificationLevels)[number])
  )
}

export default function AccountPage() {
  const [loadState, setLoadState] = useState<AccountLoadState>("loading")
  const [profile, setProfile] = useState<AccountProfile | null>(null)

  useEffect(() => {
    let active = true

    async function loadAccount() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" })
        if (!active) return

        if (response.status === 401) {
          setLoadState("signed-out")
          return
        }
        if (!response.ok) {
          setLoadState("unavailable")
          return
        }

        const data: unknown = await response.json().catch(() => null)
        if (!active) return
        if (!isAccountProfile(data)) {
          setLoadState("unavailable")
          return
        }

        setProfile(data)
        setLoadState("authenticated")
      } catch {
        if (active) setLoadState("unavailable")
      }
    }

    void loadAccount()
    return () => { active = false }
  }, [])

  const statusLabel = {
    loading: "Checking session",
    authenticated: "Authenticated",
    "signed-out": "Sign-in required",
    unavailable: "Unable to verify",
  }[loadState]

  const detailMessage = {
    loading: "Checking the canonical authentication service for your current account state.",
    authenticated: "Risk tier and verification level are read from the canonical authenticated session. This page does not change eligibility or escrow policy.",
    "signed-out": "Sign in to view your account details. Access to the demo environment requires an account session; identity verification for regulated or funded capabilities is a separate gate.",
    unavailable: "The canonical authentication service did not return verifiable account state. No default tier or verification level is being shown.",
  }[loadState]

  const shownRiskTier = loadState === "authenticated" && profile ? profile.risk_tier : loadState === "loading" ? "Checking…" : "Sign in to view"
  const shownVerification = loadState === "authenticated" && profile ? profile.verification_level : loadState === "loading" ? "Checking…" : "Sign in to view"

  return (
    <>
      <Navigation />
      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15"><UserRound className="h-6 w-6 text-primary" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Participant</p>
              <h1 className="mt-1 text-3xl font-semibold text-foreground">Account</h1>
              {loadState === "authenticated" && profile ? <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p> : null}
            </div>
          </div>
          <Card className="mt-8">
            <CardHeader><CardTitle>Account overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <div className="text-xs text-muted-foreground">Risk tier</div>
                  <div className="mt-2 font-mono text-lg text-foreground">{shownRiskTier}</div>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <div className="text-xs text-muted-foreground">Verification level</div>
                  <div className="mt-2 font-mono text-lg text-foreground">{shownVerification}</div>
                </div>
                <div className="rounded-xl border border-border bg-background/70 p-4">
                  <div className="text-xs text-muted-foreground">Session status</div>
                  <div className="mt-2 text-sm font-medium text-foreground">{statusLabel}</div>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4" aria-live="polite">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><Badge variant="outline">{statusLabel}</Badge></div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{detailMessage}</p>
              </div>
              <div className="mt-6">
                <Link href={loadState === "authenticated" ? "/dashboard" : "/login"}>
                  <Button>{loadState === "authenticated" ? "Open Dashboard" : "Login to Account"}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
