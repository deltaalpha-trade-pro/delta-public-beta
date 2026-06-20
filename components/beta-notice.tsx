import Link from "next/link"

export function BetaNotice() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.22em] text-[#8eb4e0]">Access posture</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Start with account activation</h2>
        <p className="mt-5 text-base leading-8 text-slate-300">
          Public access begins with account creation, sign-in, or guided onboarding. Higher-trust platform surfaces remain
          gated until the required account state is complete.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950"
          >
            Create Account
          </Link>
          <Link
            href="/beta-access"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white"
          >
            Guided Access
          </Link>
        </div>
      </div>
    </section>
  )
}
