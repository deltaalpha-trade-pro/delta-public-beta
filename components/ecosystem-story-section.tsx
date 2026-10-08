import Link from "next/link"
import { ArrowRight, Brain, Building2, CircleDollarSign, LockKeyhole, Network, ShieldCheck, Sparkles, Wallet } from "lucide-react"

const stages = [
  { icon: Brain, title: "AI Coaching", body: "Whalez-AI helps participants understand market context, risk, habits, and decision quality instead of reducing finance to a buy-or-sell button.", href: "/coaching", label: "Explore coaching" },
  { icon: CircleDollarSign, title: "Investment Intelligence", body: "Portfolio modeling combines native WhalezChain assets and external positions while keeping reference values, market observations, and execution authority separate.", href: "/investment", label: "Open investment" },
  { icon: Network, title: "Signals & Market Observation", body: "Market observation, signal processing, pattern analysis, and strategy context are designed to turn changing information into usable intelligence.", href: "/terminal", label: "Open terminal" },
  { icon: LockKeyhole, title: "Escrow & Settlement", body: "Escrow coordinates obligations while settlement uses governed state transitions, including the WHZ settlement-bond concept and finality-aware workflows.", href: "/settlement", label: "See settlement" },
  { icon: Building2, title: "Digital Finance", body: "Banking-style account, payment, conversion, movement, and settlement experiences are assembled behind eligibility, provider, and jurisdiction controls.", href: "/banking", label: "View banking" },
  { icon: Wallet, title: "Native Ecosystem Assets", body: "WHZ, PTN, and PRN are native ecosystem assets. Their platform roles can be demonstrated now; external liquidity, custody, and market trading are separate readiness stages.", href: "/whalezchain", label: "Understand the assets" },
]

export function EcosystemStorySection() {
  return (
    <section className="border-y border-border bg-card/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="text-sm font-medium uppercase tracking-[0.22em] text-primary">The bigger picture</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Not another trading app. An intelligent economic ecosystem.</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
            DeltaAlpha-TradePro is the public operating doorway into Whalez-AI. The long-term objective is to help people
            understand, participate in, and coordinate across financial activity through one coherent intelligence layer—
            from learning and coaching to market observation, investment, escrow, payment, settlement, and native economic state.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stages.map((stage) => {
            const Icon = stage.icon
            return (
              <Link key={stage.title} href={stage.href} className="group rounded-2xl border border-border bg-background/80 p-6 transition hover:-translate-y-0.5 hover:border-primary/40">
                <div className="inline-flex rounded-xl border border-white/10 bg-card p-3 text-primary"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{stage.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{stage.body}</p>
                <span className="mt-5 inline-flex items-center text-sm font-medium text-primary">{stage.label}<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            )
          })}
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold text-foreground">One intelligence · many capabilities</h3></div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">Different models, agents, tools, and runtimes can perform specialized jobs. They remain delegated capabilities of one Whalez-AI identity, with Founder Authority above them.</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-6">
            <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold text-foreground">Built in stages, not promises</h3></div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">A capability moves from designed → implemented → tested → partner-ready → jurisdiction-eligible → live. The public beta shows the journey without pretending the later stages already exist.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
