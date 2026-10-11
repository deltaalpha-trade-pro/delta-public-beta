import Link from "next/link"
import { ArrowRight, Brain, Building2, CircleDollarSign, LockKeyhole, Network, ShieldCheck, Sparkles } from "lucide-react"

const stages = [
  { icon: Brain, title: "AI Coaching", body: "Whalez-AI helps participants understand market context, risk, habits, and decision quality instead of reducing finance to a buy-or-sell button.", href: "/coaching", label: "Explore coaching" },
  { icon: CircleDollarSign, title: "Investment Intelligence", body: "Portfolio modeling keeps external market observations, simulated positions, and execution authority clearly separated.", href: "/investment", label: "Open investment" },
  { icon: Network, title: "Signals & Market Observation", body: "Market observation, signal processing, pattern analysis, and strategy context help turn changing information into usable intelligence.", href: "/terminal", label: "Open terminal" },
  { icon: LockKeyhole, title: "Escrow & Settlement", body: "Escrow coordinates obligations while settlement workflows remain subject to explicit authorization and service availability.", href: "/settlement", label: "See settlement" },
  { icon: Building2, title: "Digital Finance", body: "Banking-style account, payment, conversion, and movement experiences are assembled behind eligibility, provider, and jurisdiction controls.", href: "/banking", label: "View banking" },
]

export function EcosystemStorySection() {
  return (
    <section className="border-y border-border bg-card/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="text-sm font-medium uppercase tracking-[0.22em] text-primary">The bigger picture</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Not another trading app. An intelligent financial ecosystem.</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
            DeltaAlpha-TradePro is the public operating doorway into Whalez-AI. The goal is to help people understand
            and navigate financial activity through one coherent experience—from learning and coaching to market
            observation, investment, escrow, settlement, and digital finance.
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
            <p className="mt-3 text-sm leading-7 text-muted-foreground">Specialized capabilities remain part of one Whalez-AI identity and are presented through a consistent customer experience.</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-6">
            <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold text-foreground">Built in stages, not promises</h3></div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">A capability moves from designed → implemented → tested → partner-ready → jurisdiction-eligible → live. Public descriptions do not imply the later stages are complete.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
