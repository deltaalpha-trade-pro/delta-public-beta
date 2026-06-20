import Link from "next/link"

import type { PublicPlatformState } from "@/lib/platform/types"

const gateTone: Record<string, string> = {
  available: "text-emerald-300",
  onboarding_required: "text-amber-300",
  verification_required: "text-amber-300",
  activity_required: "text-amber-300",
  policy_review: "text-sky-300",
  restricted: "text-rose-300",
}

export function EngineHub({ state }: { state: PublicPlatformState }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Engine Hub</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Account-gated product surfaces</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-300">
          Availability is evaluated against account level, verification, activity posture, entitlements, and live restrictions.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {state.engines.map((engine) => (
          <div key={engine.key} className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-medium text-white">{engine.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{engine.summary}</p>
              </div>
              <span className={`text-xs uppercase tracking-[0.2em] ${gateTone[engine.gate]}`}>
                {engine.gate.replace(/_/g, " ")}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-400">{engine.reason}</p>
            <div className="mt-5">
              {engine.gate === "available" ? (
                <Link
                  href={engine.key === "market-intelligence" ? "/deltaalpha" : "/platform"}
                  className="inline-flex min-h-[44px] items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950"
                >
                  Enter surface
                </Link>
              ) : (
                <Link
                  href="/onboarding"
                  className="inline-flex min-h-[44px] items-center rounded-full border border-white/15 px-4 py-2 text-sm text-white"
                >
                  Resolve requirements
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
