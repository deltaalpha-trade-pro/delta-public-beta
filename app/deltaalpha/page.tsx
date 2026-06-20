import Link from "next/link"
import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "DeltaAlpha-TradePro | Platform Surface",
  description:
    "Account-aware platform surface for market intelligence, guided onboarding, dashboard visibility, and controlled engine activation.",
}

const features = [
  {
    title: "Market intelligence",
    description: "Research streams and monitored product visibility for activated accounts.",
  },
  {
    title: "Strategy workspace",
    description: "Qualification-gated workspace for strategy development and governed activation.",
  },
  {
    title: "Portfolio oversight",
    description: "Statements, notices, and account posture visibility from a single dashboard surface.",
  },
  {
    title: "Eligibility controls",
    description: "Access conditions tied to verification, activity, policy state, entitlements, and restrictions.",
  },
]

export default function DeltaAlphaPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[linear-gradient(180deg,#09111d_0%,#0d1117_45%,#101826_100%)] pt-16 text-white">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm uppercase tracking-[0.24em] text-[#8eb4e0]">Platform overview</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">DeltaAlpha-TradePro</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
              DeltaAlpha-TradePro is the public-facing platform surface for account creation, guided onboarding, and
              entitlement-aware product access. It communicates safe product states without exposing internal system structure.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/signup" className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950">
                Create account
              </Link>
              <Link href="/dashboard" className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white">
                Open dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-medium text-white">{feature.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
