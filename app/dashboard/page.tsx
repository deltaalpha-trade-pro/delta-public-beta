"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { AccountStatusOverview } from "@/components/platform/account-status-overview"
import { EngineHub } from "@/components/platform/engine-hub"
import { NoticeCenter } from "@/components/platform/notice-center"
import { OnboardingChecklist } from "@/components/platform/onboarding-checklist"
import { PlatformShell } from "@/components/platform/platform-shell"
import { authMe, logout } from "@/lib/auth/client"
import type { PublicPlatformState } from "@/lib/platform/types"

export default function DashboardPage() {
  const [state, setState] = useState<PublicPlatformState | null>(null)
  const [busy, setBusy] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    authMe().then((payload) => {
      if (!payload) {
        router.replace("/login")
        return
      }

      setState(payload)
      setBusy(false)
    })
  }, [router])

  if (busy || !state) {
    return (
      <PlatformShell eyebrow="Dashboard" title="Loading dashboard" description="Preparing your account-aware dashboard.">
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 text-sm text-slate-300">Loading...</div>
      </PlatformShell>
    )
  }

  async function onSignOut() {
    setSigningOut(true)
    await logout()
    router.push("/login")
  }

  return (
    <PlatformShell
      eyebrow="Dashboard"
      title={`Welcome${state.user.fullName ? `, ${state.user.fullName}` : ""}`}
      description="This dashboard is the entry surface after sign-in. It reflects your current account posture, notices, support posture, and gated engine availability."
      actions={
        <>
          <a href="/onboarding" className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-4 py-2 text-sm text-white">
            Update onboarding
          </a>
          <button
            onClick={onSignOut}
            disabled={signingOut}
            className="min-h-[44px] rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60"
          >
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <AccountStatusOverview state={state} />
        <OnboardingChecklist state={state} />
        <EngineHub state={state} />
        <NoticeCenter state={state} />
      </div>
    </PlatformShell>
  )
}
