"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { login } from "@/lib/auth/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setBusy(true)

    try {
      const res = await login(email, password)
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload?.detail || "Unable to sign in")
      }
      router.push("/dashboard")
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Unable to sign in")
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Sign in"
      subtitle="Resume your DeltaAlpha-TradePro account and continue through gated platform surfaces."
      footer={
        <div className="flex items-center justify-between gap-4">
          <Link className="underline hover:text-white" href="/signup">
            Create an account
          </Link>
          <Link className="underline hover:text-white" href="/recover">
            Recover access
          </Link>
        </div>
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

        <label className="block text-sm text-slate-300">
          Password
          <input
            type="password"
            required
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {err ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{err}</div> : null}

        <button
          disabled={busy}
          className="w-full rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthCard>
  )
}
