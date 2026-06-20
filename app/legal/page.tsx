import type { Metadata } from "next"

import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "Legal | DeltaAlpha-TradePro",
  description: "Legal disclosures, privacy posture, and user responsibilities for DeltaAlpha-TradePro.",
}

export default function LegalPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[linear-gradient(180deg,#09111d_0%,#0d1117_45%,#101826_100%)] pt-16 text-white">
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Legal</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300">
              Review these disclosures before using DeltaAlpha-TradePro. Access remains subject to account posture, product eligibility, and applicable policy controls.
            </p>

            <div className="mt-12 space-y-10">
              <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-medium">No financial advice</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  DeltaAlpha-TradePro does not provide personalized financial advice or trade instructions. Users remain responsible for their own decisions.
                </p>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-medium">Product availability</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  Product access may differ by account level, verification state, activity posture, entitlements, restrictions, and other policy-driven conditions.
                </p>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-medium">Privacy</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  We collect account and usage information necessary to operate the platform, maintain support posture, and manage product eligibility.
                </p>
              </section>

              <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-xl font-medium">User responsibility</h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  You agree to maintain accurate account information, review platform notices, and use the service in accordance with the published platform terms.
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
