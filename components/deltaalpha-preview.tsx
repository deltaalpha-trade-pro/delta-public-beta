import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Brain, Eye, ShieldCheck } from "lucide-react"

export function DeltaAlphaPreview() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Public operating platform</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">DeltaAlpha-TradePro is the operating doorway</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              It is where the participant meets Whalez-AI: learn, understand, observe, simulate, invest, trade, coordinate,
              settle, and eventually participate in qualified financial operations as the surrounding infrastructure becomes ready.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                [Brain, "AI coaching and financial learning"],
                [BarChart3, "Market intelligence, signals, and portfolio modeling"],
                [Eye, "Trading, investment, escrow, and settlement simulations"],
                [ShieldCheck, "Native WHZ, PTN, PRN relationships with clear economic boundaries"],
              ].map(([Icon, text]) => {
                const ItemIcon = Icon as typeof Brain
                return <li key={String(text)} className="flex items-start gap-3"><ItemIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" /><span className="text-sm leading-6 text-muted-foreground">{text}</span></li>
              })}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild><Link href="/deltaalpha">Explore the full DeltaAlpha story <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <Button variant="outline" asChild><Link href="/whalezchain">Understand WhalezChain</Link></Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {["AI Coach", "Live Market Observation", "Investment Intelligence", "Trading Simulation", "Escrow & Settlement", "WhalezChain Assets"].map((label, index) => (
                  <div key={label} className={`rounded-xl border border-border bg-background/70 p-5 ${index === 0 ? "border-primary/30 bg-primary/5" : ""}`}>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Capability</div>
                    <div className="mt-2 text-sm font-semibold text-foreground">{label}</div>
                    <div className="mt-3 h-1.5 rounded-full bg-secondary"><div className={index < 3 ? "h-1.5 w-3/4 rounded-full bg-primary" : "h-1.5 w-1/2 rounded-full bg-primary/60"} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
