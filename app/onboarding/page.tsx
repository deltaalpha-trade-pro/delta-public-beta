"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { PlatformShell } from "@/components/platform/platform-shell"
import { authMe, submitOnboarding } from "@/lib/auth/client"
import type { AccountLevel, PublicPlatformState } from "@/lib/platform/types"

export default function OnboardingPage() {
  const [state, setState] = useState<PublicPlatformState | null>(null)
  const [busy, setBusy] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [company, setCompany] = useState("")
  const [accountLevel, setAccountLevel] = useState<AccountLevel>("core")
  const [acceptPolicy, setAcceptPolicy] = useState(false)
  const [acceptRisk, setAcceptRisk] = useState(false)
  const [walkthroughCompleted, setWalkthroughCompleted] = useState(false)
  const [requestVerification, setRequestVerification] = useState(false)

  useEffect(() => {
    authMe().then((payload) => {
      if (!payload) {
        router.replace("/login")
        return
      }

      setState(payload)
      setFullName(payload.user.fullName)
      setCompany(payload.user.company)
      setAccountLevel(payload.user.accountLevel)
      setAcceptPolicy(payload.onboarding.policyAccepted)
      setAcceptRisk(payload.onboarding.riskAcknowledged)
      setWalkthroughCompleted(payload.onboarding.walkthroughCompleted)
      setRequestVerification(payload.user.kycState === "pending")
      setBusy(false)
    })
  }, [router])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErr(null)

    try {
      const res = await submitOnboarding({
        fullName,
        company,
        accountLevel,
        acceptPolicy,
        acceptRisk,
        walkthroughCompleted,
        requestVerification,
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.detail || "Unable to save onboarding")
      }

      router.push("/dashboard")
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Unable to save onboarding")
    } finally {
      setSaving(false)
    }
  }

  if (busy) {
    return (
      <PlatformShell
        eyebrow="Onboarding"
        title="Loading account posture"
        description="Preparing your guided onboarding workspace."
      >
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 text-sm text-slate-300">Loading...</div>
      </PlatformShell>
    )
  }

  return (
    <PlatformShell
      eyebrow="Onboarding"
      title="Guided onboarding workspace"
      description="Complete the account details that drive product availability, verification posture, and engine eligibility."
    >
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-300">
              Full name
              <input
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </label>
            <label className="text-sm text-slate-300">
              Company
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </label>
          </div>

          <label className="mt-4 block text-sm text-slate-300">
            Account level
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
              value={accountLevel}
              onChange={(e) => setAccountLevel(e.target.value as AccountLevel)}
            >
              <option value="core">Core</option>
              <option value="pro">Pro</option>
              <option value="institutional">Institutional</option>
            </select>
          </label>

          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <label className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <input type="checkbox" checked={acceptPolicy} onChange={(e) => setAcceptPolicy(e.target.checked)} />
              <span>I accept the platform terms and understand access remains subject to account posture and policy state.</span>
            </label>
            <label className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <input type="checkbox" checked={acceptRisk} onChange={(e) => setAcceptRisk(e.target.checked)} />
              <span>I understand platform outputs do not replace independent judgment and may be subject to restrictions.</span>
            </label>
            <label className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <input
                type="checkbox"
                checked={walkthroughCompleted}
                onChange={(e) => setWalkthroughCompleted(e.target.checked)}
              />
              <span>I have completed the guided platform walkthrough and I am ready to activate my account posture.</span>
            </label>
            <label className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <input
                type="checkbox"
                checked={requestVerification}
                onChange={(e) => setRequestVerification(e.target.checked)}
              />
              <span>Submit this account for verification review to unlock higher-trust product surfaces.</span>
            </label>
          </div>

          {err ? <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{err}</div> : null}

          <button
            disabled={saving}
            className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save onboarding"}
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Current account posture</p>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">Current verification: {state?.user.kycState}</div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">Current activity: {state?.user.activityState}</div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              Products currently listed: {state?.productAvailability.join(", ")}
            </div>
          </div>
        </div>
      </form>
    </PlatformShell>
  )
}
