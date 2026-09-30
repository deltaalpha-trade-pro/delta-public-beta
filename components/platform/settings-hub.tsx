"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"

type Settings = {
  locale: string
  timezone: string
  theme: string
  transaction_alerts: boolean
  security_alerts: boolean
  market_observation_alerts: boolean
}

async function readJson(path: string, init?: RequestInit) {
  const response = await fetch(path, { ...init, cache: "no-store" })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data?.detail || data?.error || `request_failed_${response.status}`)
  return data
}

export function SettingsHub() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    void readJson("/api/platform/settings")
      .then((value) => setSettings(value.settings || null))
      .catch((e) => setError(e instanceof Error ? e.message : "settings_unavailable"))
  }, [])

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!settings) return
    setBusy(true)
    setError("")
    try {
      const value = await readJson("/api/platform/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      setSettings(value.settings)
    } catch (e) {
      setError(e instanceof Error ? e.message : "settings_update_failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-black px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel rounded-[2rem] p-6 sm:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">DeltaAlpha-TradePro</p>
              <h1 className="mt-3 text-3xl font-semibold">Account Settings</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Preferences are stored in Whalez-AI Core. Credentials, passkeys, MFA and session revocation remain owned by the authentication authority.
              </p>
            </div>
            <Link href="/settings/security" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10">
              Security &amp; access →
            </Link>
          </div>

          {error ? <div className="mt-6 rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm text-red-200">{error}</div> : null}

          {settings ? (
            <form onSubmit={save} className="mt-8 grid gap-8">
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="grid gap-2 text-sm">
                  <span className="text-zinc-400">Locale</span>
                  <input value={settings.locale} onChange={e => setSettings({...settings, locale: e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-primary/50" maxLength={20} />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-zinc-400">Timezone</span>
                  <input value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-primary/50" maxLength={64} />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-zinc-400">Theme</span>
                  <select value={settings.theme} onChange={e => setSettings({...settings, theme: e.target.value})} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-primary/50">
                    <option value="system">System</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-3">
                <Toggle label="Transaction alerts" value={settings.transaction_alerts} onChange={value => setSettings({...settings, transaction_alerts: value})} />
                <Toggle label="Security alerts" value={settings.security_alerts} onChange={value => setSettings({...settings, security_alerts: value})} />
                <Toggle label="Market observation alerts" value={settings.market_observation_alerts} onChange={value => setSettings({...settings, market_observation_alerts: value})} />
              </div>

              <button disabled={busy} className="w-fit rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black disabled:opacity-50">
                {busy ? "Saving…" : "Save settings"}
              </button>
            </form>
          ) : !error ? (
            <div className="mt-8 text-sm text-zinc-500">Loading verified settings…</div>
          ) : null}
        </div>
      </div>
    </main>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm">
      <span>{label}</span>
      <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} className={`rounded-full px-4 py-2 text-xs ${value ? "bg-primary text-black" : "bg-white/10 text-zinc-300"}`}>
        {value ? "On" : "Off"}
      </button>
    </label>
  )
}
