"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"

type Mode = "account" | "security" | "portfolio" | "signals" | "coach"

type DomainHubProps = { mode: Mode }

async function readJson(path: string, init?: RequestInit) {
  const response = await fetch(path, { ...init, cache: "no-store" })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(typeof data?.error === "string" ? data.error : `request_failed_${response.status}`)
  return data
}

function statusTone(status?: string) {
  if (!status) return "text-zinc-400"
  if (/ACTIVE|VERIFIED|IMPLEMENTED|OBSERVATION|EDUCATIONAL/i.test(status)) return "text-emerald-300"
  if (/PENDING|DETECTED|BASELINE/i.test(status)) return "text-amber-300"
  return "text-zinc-300"
}

export function DomainHub({ mode }: DomainHubProps) {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [currency, setCurrency] = useState("NGN")
  const [coachSession, setCoachSession] = useState<string | null>(null)
  const [coachMessage, setCoachMessage] = useState("")
  const [coachReply, setCoachReply] = useState("")

  async function load() {
    setError("")
    try {
      const path =
        mode === "account" ? "/api/platform/account" :
        mode === "security" ? "/api/platform/security" :
        mode === "portfolio" ? "/api/platform/portfolio" :
        "/api/platform/signals"
      const result = await readJson(path)
      setData(result)
      if (mode === "account") {
        setDisplayName(result.account?.display_name || "")
        setCurrency(result.account?.preferred_currency || "NGN")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "platform_unavailable")
    }
  }

  useEffect(() => { void load() }, [mode])

  async function saveProfile(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      await readJson("/api/platform/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: displayName, preferred_currency: currency }),
      })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : "profile_update_failed")
    } finally {
      setBusy(false)
    }
  }

  async function startCoach() {
    setBusy(true)
    setError("")
    try {
      const result = await readJson("/api/platform/coach/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Whalez-AI Coach" }),
      })
      setCoachSession(result.session?.session_id || null)
      setCoachReply("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "coach_unavailable")
    } finally {
      setBusy(false)
    }
  }

  async function sendCoach(event: FormEvent) {
    event.preventDefault()
    if (!coachSession || !coachMessage.trim()) return
    setBusy(true)
    setError("")
    try {
      const result = await readJson(`/api/platform/coach/sessions/${encodeURIComponent(coachSession)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: coachMessage }),
      })
      setCoachReply(result.message?.content || "")
      setCoachMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "coach_message_failed")
    } finally {
      setBusy(false)
    }
  }

  const title =
    mode === "account" ? "Account Profile" :
    mode === "security" ? "Security & Access" :
    mode === "portfolio" ? "Portfolio" :
    mode === "signals" ? "Market Observations" :
    "Whalez-AI Coach"

  return (
    <main className="min-h-screen bg-black text-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">DeltaAlpha-TradePro</p>
              <h1 className="mt-3 text-3xl font-semibold">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Runtime-backed platform state. Authentication authority, provider attestations and WhalezChain remain the
                authoritative layers for their respective domains.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                ["Account", "/account"],
                ["Security", "/settings/security"],
                ["Portfolio", "/portfolio"],
                ["Signals", "/signals"],
                ["Coach", "/coach"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-zinc-300 hover:bg-white/10">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {error ? <div className="mt-6 rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm text-red-200">{error}</div> : null}

          {mode === "account" && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <form onSubmit={saveProfile} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-lg font-medium">Profile details</h2>
                <div className="mt-5 grid gap-4">
                  <label className="grid gap-2 text-sm">
                    <span className="text-zinc-400">Display name</span>
                    <input value={displayName} onChange={e => setDisplayName(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-primary/50" maxLength={120} />
                  </label>
                  <label className="grid gap-2 text-sm">
                    <span className="text-zinc-400">Preferred currency</span>
                    <input value={currency} onChange={e => setCurrency(e.target.value.toUpperCase())} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-primary/50" maxLength={3} />
                  </label>
                </div>
                <button disabled={busy} className="mt-5 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-black disabled:opacity-50">
                  {busy ? "Saving…" : "Save profile"}
                </button>
              </form>

              <div className="grid gap-4">
                <Info title="Account status" value={data?.status?.account_status} />
                <Info title="Account level" value={data?.status?.account_level} />
                <Info title="Verification level" value={data?.status?.verification_level} />
                <Info title="Risk tier" value={data?.status?.risk_tier} />
                <Info title="Jurisdiction" value={data?.status?.jurisdiction} />
              </div>
            </div>
          )}

          {mode === "security" && (
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Info title="Security status" value={data?.security?.security_status} />
              <Info title="MFA snapshot" value={data?.security?.mfa_enabled ? "Enabled" : "Not enabled / not reported"} />
              <Info title="Passkeys reported" value={String(data?.security?.passkey_count ?? 0)} />
              <Info title="Active sessions" value={String(data?.security?.active_session_count ?? 0)} />
              <div className="md:col-span-2 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-sm leading-7 text-amber-100/80">
                Credential creation, MFA enrollment, recovery, passkey management and session revocation stay with the
                authentication authority. This page is a reconciled security view, not a second identity system.
              </div>
            </div>
          )}

          {mode === "portfolio" && (
            <div className="mt-8">
              <div className="grid gap-4 md:grid-cols-4">
                <Info title="Portfolio" value={data?.portfolio?.name || "Primary Portfolio"} />
                <Info title="Status" value={data?.portfolio?.status || "UNAVAILABLE"} />
                <Info title="Reference currency" value={data?.portfolio?.reference_currency || "USD"} />
                <Info title="Reference value" value={data?.portfolio?.total_reference_value || "0"} />
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-5 gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-wider text-zinc-500">
                  <span>Asset</span><span>Quantity</span><span>Avg cost</span><span>Mark</span><span>Status</span>
                </div>
                {(data?.positions || []).length ? (data.positions as any[]).map((p) => (
                  <div key={p.position_id} className="grid grid-cols-5 gap-3 border-b border-white/5 px-4 py-4 text-sm last:border-b-0">
                    <span>{p.symbol}</span><span>{p.quantity}</span><span>{p.average_cost_reference}</span><span>{p.mark_reference}</span><span className={statusTone(p.status)}>{p.status}</span>
                  </div>
                )) : <div className="p-6 text-sm text-zinc-500">No canonical positions are currently connected. Synthetic browser holdings are intentionally not shown as financial truth.</div>}
              </div>
            </div>
          )}

          {mode === "signals" && (
            <div className="mt-8">
              <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/5 p-5 text-sm leading-7 text-emerald-100/80">
                Observation layer only. Signals describe observed conditions and context and do not authorize or place trades.
              </div>
              <div className="mt-6 grid gap-4">
                {(data?.signals || []).length ? (data.signals as any[]).map((s) => (
                  <div key={s.signal_id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{s.symbol}</span>
                      <span className={statusTone(s.severity)}>{s.severity}</span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-300">{s.summary}</p>
                    <p className="mt-2 text-xs text-zinc-600">{new Date(s.observed_at).toLocaleString()}</p>
                  </div>
                )) : <div className="rounded-2xl border border-white/10 p-6 text-sm text-zinc-500">No observations recorded yet.</div>}
              </div>
            </div>
          )}

          {mode === "coach" && (
            <div className="mt-8 max-w-3xl">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm leading-7 text-zinc-300">
                  Whalez-AI Coach connects to account, portfolio and market-observation context without becoming an
                  independent execution agent. Its current runtime mode is educational context.
                </p>
                <button onClick={startCoach} disabled={busy} className="mt-5 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-black disabled:opacity-50">
                  {busy ? "Opening…" : coachSession ? "Session active" : "Start coaching session"}
                </button>
                {coachSession ? (
                  <>
                    <form onSubmit={sendCoach} className="mt-6 flex gap-3">
                      <input value={coachMessage} onChange={e => setCoachMessage(e.target.value)} placeholder="Ask about your account, portfolio or market context" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-primary/50" maxLength={4000} />
                      <button disabled={busy || !coachMessage.trim()} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-200 disabled:opacity-50">Send</button>
                    </form>
                    {coachReply ? <div className="mt-5 rounded-xl border border-primary/10 bg-primary/5 p-5 text-sm leading-7 text-zinc-200">{coachReply}</div> : null}
                  </>
                ) : null}
              </div>
            </div>
          )}

          {!data && !error ? <div className="mt-8 text-sm text-zinc-500">Loading verified platform state…</div> : null}
        </div>
      </div>
    </main>
  )
}

function Info({ title, value }: { title: string; value?: string | null }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      <p className={`mt-3 text-xl font-medium ${statusTone(value || "")}`}>{value || "UNAVAILABLE"}</p>
    </div>
  )
}
