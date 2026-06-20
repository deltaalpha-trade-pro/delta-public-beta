"use client"

import { useState } from "react"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { recover } from "@/lib/auth/client"

export default function RecoverPage() {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setErr(null)
    setMessage(null)

    try {
      const res = await recover(email)
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.detail || "Unable to start recovery")
      }
      const payload = await res.json()
      setMessage(payload.message)
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Unable to start recovery")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Recover access"
      subtitle="Submit a recovery request and the platform will log the support review posture for your account."
      footer={
        <span>
          Remembered your credentials?{" "}
          <Link className="underline hover:text-white" href="/login">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block text-sm text-slate-300">
          Email
          <input
            type="email"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {err ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{err}</div> : null}
        {message ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div> : null}

        <button
          disabled={busy}
          className="w-full rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
        >
          {busy ? "Submitting..." : "Start recovery"}
        </button>
      </form>
    </AuthCard>
  )
}
