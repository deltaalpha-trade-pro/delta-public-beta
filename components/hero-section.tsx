import Link from "next/link"
import { ArrowRight, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EcosystemMark, DeltaAlphaMark } from "@/components/brand-marks"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary via-background to-background" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground">Controlled Live · staged public launch</span>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl lg:text-7xl">WHALEZ-AI</h1>
          <p className="mt-5 text-lg tracking-wide text-primary sm:text-xl md:text-2xl">One intelligence. Many capabilities. One coherent financial ecosystem.</p>
          <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
            DeltaAlpha-TradePro is the public operating doorway into an evolving Whalez-AI ecosystem connecting AI coaching,
            market intelligence, real-time signal processing, investment, trading, digital finance, escrow, settlement,
            communications, and WhalezChain native economic state.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            {["AI Coaching", "Signals", "Investment", "Trading", "Digital Finance", "Escrow", "Settlement", "WHZ · PTN · PRN"].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">{item}</span>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="min-h-[44px] w-full bg-foreground text-background hover:bg-foreground/90 sm:w-auto" asChild>
              <Link href="/deltaalpha">Explore DeltaAlpha <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="min-h-[44px] w-full bg-transparent sm:w-auto" asChild>
              <Link href="/coaching"><Sparkles className="mr-2 h-4 w-4" />See AI Coaching</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><EcosystemMark className="h-4 w-4 text-primary" />Whalez-AI Ecosystem</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"><DeltaAlphaMark className="h-4 w-4 text-primary" />DeltaAlpha-TradePro</span>
          </div>
        </div>
      </div>
    </section>
  )
}
