const highlights = [
  {
    title: "Premium account access",
    body: "Create an account, establish your platform posture, and move through guided onboarding without email-based request queues.",
  },
  {
    title: "Gated engine delivery",
    body: "Product access is determined by account level, verification state, recent activity, entitlements, and restrictions.",
  },
  {
    title: "Operational clarity",
    body: "Statements, notices, notifications, and support posture are surfaced directly inside the platform with safe public wording.",
  },
]

export function LandingHighlights() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {highlights.map((highlight) => (
          <div key={highlight.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#8fb4df]">{highlight.title}</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">{highlight.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
