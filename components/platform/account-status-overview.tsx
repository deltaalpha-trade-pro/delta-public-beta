import type { PublicPlatformState } from "@/lib/platform/types"

const toLabel = (value: string) => value.replace(/_/g, " ")

export function AccountStatusOverview({ state }: { state: PublicPlatformState }) {
  const metrics = [
    ["Account level", state.user.accountLevel],
    ["Verification", state.user.kycState],
    ["Activity", state.user.activityState],
    ["Policy", state.user.policyState],
  ]

  return (
    <section className="grid gap-4 md:grid-cols-4">
      {metrics.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
          <p className="mt-3 text-xl font-semibold capitalize text-white">{toLabel(value)}</p>
        </div>
      ))}
    </section>
  )
}
