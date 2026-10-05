import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, BarChart3, Brain, Building2, Eye, LineChart, LockKeyhole, Network, Shield, TrendingUp, WalletCards, Zap } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DeltaAlpha-TradePro | WHALEZ-AI",
  description: "The public financial operating surface of the WHALEZ-AI ecosystem: coaching, market intelligence, investment, trading, digital finance, escrow, settlement, and native asset context.",
}

const features = [
  { icon: Brain, title: "AI Investment Coaching", description: "Guided financial reasoning, risk education, habit building, and plain-language explanations designed to help participants make better-informed decisions.", href: "/coaching" },
  { icon: LineChart, title: "Market Insights Dashboard", description: "Market conditions, trends, key metrics, and multi-timeframe context presented for systematic analysis.", href: "/terminal" },
  { icon: Zap, title: "Signal Processing", description: "Structured signal interpretation, pattern recognition, and confidence-aware context rather than unexplained alerts.", href: "/terminal" },
  { icon: Eye, title: "Strategy Analysis", description: "Scenario evaluation, systematic strategy review, and risk-reward context before execution authority exists.", href: "/trading" },
  { icon: BarChart3, title: "Investment Intelligence", description: "Portfolio modeling across native WhalezChain assets and external positions, with reference values clearly separated from market prices.", href: "/investment" },
  { icon: Building2, title: "Digital Finance", description: "Account, payment, conversion, banking-style movement and settlement experiences assembled behind eligibility and provider controls.", href: "/banking" },
  { icon: LockKeyhole, title: "Escrow & Settlement", description: "Escrow coordination, WHZ settlement-bond modeling, finality-aware transitions, and controlled settlement workflows.", href: "/settlement" },
  { icon: Network, title: "WhalezChain Native Rail", description: "Native asset state, receipts, provenance, and governed finality concepts for the ecosystem.", href: "/whalezchain" },
  { icon: TrendingUp, title: "Trend Detection", description: "Identification of momentum shifts, emerging structures, and changes in market regime.", href: "/terminal" },
  { icon: Shield, title: "Risk Assessment", description: "Exposure monitoring, correlation context, and risk framing designed to keep uncertainty visible.", href: "/investment" },
  { icon: Activity, title: "Participant Progress", description: "An ecosystem model in which learning, eligibility, action, settlement, and long-term participation can connect over time.", href: "/dashboard" },
  { icon: WalletCards, title: "Ecosystem Support", description: "A controlled place for official project support information without exposing private infrastructure or unverified payment addresses.", href: "/support" },
]

export default function DeltaAlphaPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <span className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Public financial operating surface</span>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">DeltaAlpha-TradePro</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
                DeltaAlpha-TradePro is the public doorway into the Whalez-AI Ecosystem: an intelligent financial operating
                environment designed to connect learning, coaching, market intelligence, investment, trading, digital finance,
                escrow, settlement, and native economic state through one coherent user experience.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/coaching"><Button>Try AI Coaching</Button></Link>
                <Link href="/investment"><Button variant="outline">Explore Investment</Button></Link>
                <Link href="/terminal"><Button variant="outline">Open Market Terminal</Button></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-card py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">What DeltaAlpha provides</h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                DeltaAlpha is not designed around a single trade. It is a connected set of capabilities that can grow from
                education and simulated participation toward qualified financial operations when the legal, partner,
                jurisdiction, identity, and infrastructure conditions are satisfied.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Link key={feature.title} href={feature.href} className="group rounded-2xl border border-border bg-background/80 p-6 transition hover:-translate-y-0.5 hover:border-primary/40">
                    <Icon className="h-7 w-7 text-primary" />
                    <h3 className="mt-5 text-base font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">{feature.description}</p>
                    <span className="mt-5 inline-flex text-sm font-medium text-primary">Open capability <span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="text-sm font-medium uppercase tracking-[0.22em] text-primary">How the ecosystem works</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">From understanding to participation</h2>
                <div className="mt-8 space-y-6">
                  {[
                    ["01", "Identity & eligibility", "A participant starts with identity, jurisdiction, KYC/KYB, eligibility, and capability access."],
                    ["02", "Intelligence & coaching", "Whalez-AI turns market context, risk, learning, and signals into understandable guidance."],
                    ["03", "Action & coordination", "Trading, investment, banking, escrow, and payment workflows can operate within governed boundaries."],
                    ["04", "Settlement & provenance", "Where qualified, settlement can move through approved provider rails while WhalezChain preserves native state, receipts, and provenance."],
                    ["05", "Economic participation", "Native ecosystem assets can carry defined platform roles, with external transferability and market access treated as separate qualification stages."],
                  ].map(([step, title, body]) => (
                    <div key={step} className="flex gap-4">
                      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-border bg-card text-xs font-semibold text-primary">{step}</div>
                      <div><h3 className="font-semibold text-foreground">{title}</h3><p className="mt-1 text-sm leading-7 text-muted-foreground">{body}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <h3 className="text-lg font-semibold text-foreground">Why the native assets matter</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    WHZ, PTN, and PRN are not inserted into DeltaAlpha merely to make the interface look like an exchange.
                    They are intended to represent native economic and provenance relationships inside the ecosystem.
                    Their platform roles can exist before the separate conditions for external liquidity, custody, or public
                    trading are satisfied.
                  </p>
                  <Link href="/whalezchain" className="mt-5 inline-flex items-center text-sm font-medium text-primary">Read the native-asset model →</Link>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">How settlement fits</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Escrow coordinates the obligation. Settlement verifies the provider event and governed state transition.
                    WhalezChain is the native provenance/finality rail. No public screen should imply that these layers are the same thing.
                  </p>
                  <Link href="/settlement" className="mt-5 inline-flex items-center text-sm font-medium text-primary">See settlement simulation →</Link>
                </div>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="text-lg font-semibold text-foreground">What is real in the beta</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    The public release can show routed product surfaces, simulation engines, ecosystem-native asset concepts,
                    and read-only market-data plumbing. Live execution, custody, regulated brokerage, and public asset liquidity
                    are not implied merely because a page exists.
                  </p>
                  <Link href="/beta-disclaimer" className="mt-5 inline-flex items-center text-sm font-medium text-primary">Read the beta boundary →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
