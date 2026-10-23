import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Activity,
  AudioLines,
  Cpu,
  Shield,
  Sparkles,
  Waves,
} from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[92vh] overflow-hidden pt-16">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_15%_15%,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      <div className="pointer-events-none absolute -left-40 top-24 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs text-foreground/85 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <Shield className="h-3.5 w-3.5 text-primary" />
            AI coordination · governed settlement
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            One ecosystem. Many capabilities.
          </p>
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] text-foreground sm:text-6xl md:text-7xl">
            Intelligence that moves with <span className="bg-gradient-to-r from-primary via-cyan-300 to-primary bg-clip-text text-transparent">purpose.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            WHALEZ-AI brings market intelligence, account experiences, and settlement coordination into one coherent platform—built around clear states, accountable decisions, and user control.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="min-h-[48px] w-full shadow-lg shadow-primary/15 sm:w-auto"
              asChild
            >
              <Link href="/banking">
                Explore the platform
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-h-[48px] w-full border-white/15 bg-white/[0.03] backdrop-blur sm:w-auto"
              asChild
            >
              <Link href="/beta-access">Request access</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Governed by design</span>
            <span className="inline-flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Evidence-led status</span>
            <span className="inline-flex items-center gap-2"><Waves className="h-4 w-4 text-primary" /> Connected ecosystem</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute inset-8 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-background/65 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Whalez intelligence</p>
                <p className="mt-1 text-sm font-medium text-foreground">Coordination interface</p>
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/10 p-2.5 text-primary">
                <Cpu className="h-5 w-5" />
              </div>
            </div>

            <div className="relative flex min-h-[270px] items-center justify-center sm:min-h-[320px]">
              <div className="absolute h-56 w-56 rounded-full border border-primary/20 sm:h-64 sm:w-64" />
              <div className="absolute h-44 w-44 rounded-full border border-cyan-300/20 [transform:rotateX(65deg)] sm:h-52 sm:w-52" />
              <div className="absolute h-36 w-36 rounded-full border border-primary/30 [transform:rotateY(65deg)] sm:h-44 sm:w-44" />
              <div className="absolute h-28 w-28 rounded-full bg-gradient-to-br from-primary/25 via-cyan-300/10 to-transparent blur-xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.8rem] border border-primary/35 bg-gradient-to-br from-primary/20 via-background to-cyan-300/10 shadow-[0_0_55px_rgba(34,211,238,0.12)] sm:h-28 sm:w-28">
                <div className="absolute inset-2 rounded-[1.3rem] border border-white/10" />
                <Sparkles className="h-10 w-10 text-primary sm:h-12 sm:w-12" />
              </div>

              <div className="absolute left-0 top-8 rounded-2xl border border-white/10 bg-background/90 p-3 shadow-xl backdrop-blur sm:left-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs font-medium text-foreground">Market intelligence</span>
                </div>
                <p className="mt-1 pl-6 text-[11px] text-muted-foreground">Signals & context</p>
              </div>
              <div className="absolute bottom-7 left-0 rounded-2xl border border-white/10 bg-background/90 p-3 shadow-xl backdrop-blur sm:bottom-9 sm:left-2">
                <div className="flex items-center gap-2">
                  <Waves className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-foreground">WhalezChain</span>
                </div>
                <p className="mt-1 pl-6 text-[11px] text-muted-foreground">Ledger & finality</p>
              </div>
              <div className="absolute right-0 top-1/2 rounded-2xl border border-white/10 bg-background/90 p-3 shadow-xl backdrop-blur sm:right-2">
                <div className="flex items-center gap-2">
                  <AudioLines className="h-4 w-4 text-cyan-300" />
                  <span className="text-xs font-medium text-foreground">AI Coach</span>
                </div>
                <p className="mt-1 pl-6 text-[11px] text-muted-foreground">Guided explanations</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-4 sm:gap-3">
              {[
                { label: "Intelligence", value: "Context" },
                { label: "Coordination", value: "Governed" },
                { label: "Experience", value: "Unified" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                  <p className="text-[10px] text-muted-foreground sm:text-xs">{item.label}</p>
                  <p className="mt-1 text-xs font-semibold text-foreground sm:text-sm">{item.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
              Conceptual interface preview. Live connectivity and financial states are shown only when verified by their authoritative services.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
