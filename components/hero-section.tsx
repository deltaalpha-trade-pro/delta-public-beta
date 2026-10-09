import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EcosystemMark, DeltaAlphaMark } from "@/components/brand-marks"

const domains = [
  "AI Coaching",
  "Market Intelligence",
  "Investment",
  "Trading · Simulation Beta",
  "Digital Finance",
  "Payments & Escrow",
  "Settlement",
  "WHZ · PTN · PRN",
]

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden pt-24 sm:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_14%_22%,rgba(34,211,238,0.16),transparent_38%),radial-gradient(ellipse_at_82%_30%,rgba(79,70,229,0.17),transparent_38%),linear-gradient(180deg,rgba(4,10,22,0.15),rgba(4,10,22,0.7))]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-8 sm:px-6 md:pb-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4 lg:px-8 lg:pt-10">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1.5 text-xs font-semibold text-cyan-100">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.85)]" />
            One ecosystem · public beta
          </div>
          <h1 className="text-5xl font-black tracking-[-0.055em] text-foreground text-balance sm:text-6xl md:text-7xl xl:text-8xl">
            WHALEZ<span className="text-cyan-200">-AI</span>
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-semibold leading-snug text-foreground sm:text-2xl md:text-3xl">
            One intelligence. Many capabilities. One coherent user experience.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Whalez-AI is the single intelligence identity for the ecosystem. DeltaAlpha-Trade-Pro is its public financial
            gateway, while WhalezChain carries native state, economic records and provenance. Specialized models, agents and
            runtimes work as delegated capabilities—not as separate competing AIs.
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {domains.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-xs text-muted-foreground transition hover:border-cyan-300/35 hover:text-cyan-50">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="min-h-[48px] w-full bg-cyan-200 font-bold text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.17)] hover:bg-cyan-100 sm:w-auto" asChild>
              <Link href="/deltaalpha">Explore the ecosystem <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="min-h-[48px] w-full border-white/15 bg-white/[0.04] hover:bg-white/[0.08] sm:w-auto" asChild>
              <Link href="/coaching"><Sparkles className="mr-2 h-4 w-4" />Meet Whalez-AI</Link>
            </Button>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><EcosystemMark className="h-4 w-4 text-primary" />Whalez-AI Ecosystem</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2"><DeltaAlphaMark className="h-4 w-4 text-primary" />DeltaAlpha-Trade-Pro</span>
            <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-2 text-amber-100/80">Live-money execution not certified</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[760px] lg:-mr-10">
          <div aria-hidden="true" className="pointer-events-none absolute inset-8 rounded-full bg-cyan-400/10 blur-3xl" />
          <Image
            src="/brand/whalez-ecosystem-hero.svg"
            alt="Luminous Whalez-AI whale emblem surrounded by orbital nodes for intelligence, markets, trust, WhalezChain and WHZ, PTN, PRN."
            width={920}
            height={760}
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="whalez-orbit-float relative h-auto w-full drop-shadow-[0_0_35px_rgba(34,211,238,0.16)]"
          />
        </div>
      </div>
    </section>
  )
}
