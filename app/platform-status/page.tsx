import type { Metadata } from "next"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Platform Status | DeltaAlpha-TradePro",
  description:
    "Public-only operational verification snapshot for DeltaAlpha-TradePro. Distinguishes confirmed availability from features still under certification.",
}

const checks = [
  {
    title: "Public gateway",
    state: "Verified",
    detail:
      "The official website responded successfully during the November 12, 2026 infrastructure check.",
  },
  {
    title: "Communications",
    state: "Partially verified",
    detail:
      "Controlled outbound-email delivery tests succeeded. The event-notification receiver is configured and rejects unsigned requests; independent real-event delivery acceptance is still outstanding.",
  },
  {
    title: "Account and platform capabilities",
    state: "Controlled beta",
    detail:
      "Account-gated capabilities are introduced progressively. An accessible page or configured service does not imply that all functionality is production-certified.",
  },
  {
    title: "Trading, custody, and settlement",
    state: "Not production-certified",
    detail:
      "No public claim is made that live trading, asset custody, mainnet finality, or live settlement execution is available.",
  },
] as const

export default function PlatformStatusPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <section className="border-b border-border py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              Public operational information
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-foreground md:text-5xl">
              Platform verification status
            </h1>
            <p className="mt-5 max-w-3xl text-muted-foreground">
              This is a dated, evidence-based snapshot of public-facing capabilities,
              not a real-time uptime monitor or a blanket production certification.
              Restricted operational architecture is intentionally excluded.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last verified: November 12, 2026 (West Africa Time)
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto grid max-w-5xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            {checks.map((check) => (
              <article key={check.title} className="rounded-xl border border-border bg-card p-6">
                <span className="text-xs font-medium uppercase tracking-widest text-accent">
                  {check.state}
                </span>
                <h2 className="mt-3 text-xl font-medium text-foreground">{check.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{check.detail}</p>
              </article>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-border p-6">
              <h2 className="text-lg font-medium text-foreground">What the statuses mean</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Verified means a specific observed check succeeded. Partially verified
                means some required checks remain. Controlled beta means access and
                availability may be limited. Not production-certified means a capability
                should not be represented as available for live use.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm">
                <Link href="/beta-access" className="font-medium text-accent hover:underline">
                  Beta access
                </Link>
                <Link href="/support" className="font-medium text-accent hover:underline">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
