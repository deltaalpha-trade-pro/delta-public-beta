import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield } from "lucide-react"
import { EcosystemMark, WhalezchainMark, DeltaAlphaMark } from "@/components/brand-marks"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary via-background to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 mb-8">
            <Shield className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Public beta gateway for real ecosystem wiring</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground text-balance">
            WHALEZ-AI
          </h1>

          <p className="mt-4 text-lg sm:text-xl md:text-2xl text-primary tracking-wide">
            Trading Terminal · Banking · Investment · Escrow · Settlement
          </p>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            A public coordination layer for the Whalez-AI ecosystem: communications, market intelligence, mail
            routing, settlement visibility, and the launch surfaces that support controlled execution.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <EcosystemMark className="h-4 w-4 text-primary" />
              Whalez-AI Ecosystem
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <WhalezchainMark className="h-4 w-4 text-primary" />
              Whalezchain
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <DeltaAlphaMark className="h-4 w-4 text-primary" />
              DeltaAlpha-TradePro
            </span>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto min-h-[44px] bg-foreground text-background hover:bg-foreground/90"
              asChild
            >
              <Link href="/mail">
                Open Whalez-mail
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[44px] bg-transparent" asChild>
              <Link href="/#communications">Review live communications wiring</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
