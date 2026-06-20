"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function GuidedAccessPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      intendedUse: formData.get("intendedUse"),
    }

    try {
      const res = await fetch("/api/beta-access/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || "Unable to start guided access")
      }

      setIsSubmitted(true)
      window.setTimeout(() => router.push("/signup"), 1200)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to start guided access")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[linear-gradient(180deg,#09111d_0%,#0d1117_42%,#101826_100%)] pt-16 text-white">
        <section className="py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#8eb4e0]">Guided access</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Start with a guided platform entry</h1>
              <p className="mt-6 text-base leading-8 text-slate-300">
                Use guided access to establish your account profile, capture platform intent, and move into credentialed onboarding.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  "Create a governed account profile without exposing internal workflow states.",
                  "Move from registration into a guided onboarding workspace.",
                  "See product eligibility, restrictions, notices, and support posture after sign-in.",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-black/30 backdrop-blur">
              {isSubmitted ? (
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">Profile stored</p>
                  <h2 className="text-2xl font-semibold">Continue to account creation</h2>
                  <p className="text-sm leading-7 text-slate-300">
                    Your guided access intake has been recorded. You are being moved to the account creation surface now.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block text-sm text-slate-300">
                    Full name
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Email
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Company
                    <input
                      id="company"
                      name="company"
                      type="text"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Intended platform use
                    <textarea
                      id="intendedUse"
                      name="intendedUse"
                      rows={4}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-[#7ea6d9]"
                    />
                  </label>

                  {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

                  <button
                    disabled={isLoading}
                    className="w-full rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950 disabled:opacity-60"
                  >
                    {isLoading ? "Starting guided access..." : "Start guided access"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
