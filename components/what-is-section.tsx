const features = [
  {
    title: "Account foundation",
    description: "Credentialed access, recovery posture, and onboarding state are handled directly inside the platform.",
  },
  {
    title: "Controlled eligibility",
    description: "Each engine evaluates account level, verification, activity posture, and restrictions before activation.",
  },
  {
    title: "Operational notices",
    description: "Statements, notifications, and support posture are surfaced with clear public-safe language.",
  },
  {
    title: "Premium public surface",
    description: "The public experience is launch-grade, while sensitive internal structure remains outside the public layer.",
  },
]

export function WhatIsSection() {
  return (
    <section className="bg-[#0f1724] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.22em] text-[#8eb4e0]">Platform posture</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for public access with controlled activation
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            DeltaAlpha-TradePro exposes a precise public platform layer: account creation, sign-in, guided onboarding,
            dashboard visibility, and stateful engine gating.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h3 className="text-lg font-medium text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
