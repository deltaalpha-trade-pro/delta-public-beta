const pillars = [
  {
    title: "Public platform controls",
    description: "A controlled access layer for registration, sign-in, onboarding, and entitlement-aware activation.",
  },
  {
    title: "Product availability states",
    description: "Clear product posture for available, pending, restricted, and review-based access states.",
  },
  {
    title: "Account eligibility rules",
    description: "State evaluation that considers account level, verification, activity, entitlements, and restrictions.",
  },
  {
    title: "Operational messaging",
    description: "Safe notices, events, and support posture displayed without exposing internal system topology.",
  },
]

export function ArchitectureSection() {
  return (
    <section className="bg-[#0f1724] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.22em] text-[#8eb4e0]">Platform foundation</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Public-safe design with real backend state
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            The public layer communicates what an account can do, what it needs next, and what conditions currently apply.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-base font-medium text-white">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
