import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Orbit, ShieldCheck, Sparkles } from "lucide-react"

const principles = [
  {
    icon: Orbit,
    title: "One intelligence",
    copy: "Models, agents and runtimes are specialized capabilities under one Whalez-AI identity—not competing AIs.",
  },
  {
    icon: Sparkles,
    title: "A living product world",
    copy: "DeltaAlpha-Trade-Pro brings investment, market intelligence, trading, digital finance, escrow and member services into one public doorway.",
  },
  {
    icon: ShieldCheck,
    title: "Governed by design",
    copy: "WhalezChain carries native state and provenance. Access, provider routes, settlement and jurisdiction eligibility remain distinct gates.",
  },
]

export function EcosystemBlueprintSection() {
  return (
    <section id="ecosystem-blueprint" aria-labelledby="ecosystem-blueprint-title" className="relative overflow-hidden border-y border-white/10 py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_20%,rgba(34,211,238,0.12),transparent_38%),radial-gradient(ellipse_at_82%_70%,rgba(129,140,248,0.11),transparent_35%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            The ecosystem, in one view
          </span>
          <h2 id="ecosystem-blueprint-title" className="mt-5 text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl md:text-5xl">
            Not a collection of apps. A connected world.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            This blueprint preserves the original model: WHALEZ-AI at the centre, delegated operational capabilities around it,
            WhalezChain as the native state and provenance rail, and DeltaAlpha-Trade-Pro as the public financial gateway.
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-[1.75rem] border border-cyan-300/20 bg-[#050b17] shadow-[0_0_90px_rgba(34,211,238,0.10)]">
          <a
            href="/brand/whalez-ai-ecosystem-blueprint.svg"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the full Whalez-AI ecosystem blueprint in a new tab"
            className="group relative block"
          >
            <Image
              src="/brand/whalez-ai-ecosystem-blueprint.svg"
              alt="Illustrative Whalez-AI and DeltaAlpha-Trade-Pro ecosystem blueprint, showing the Truth Triad, delegated operational agents, conceptual wealth and energy model, survival ratio, wallet roles, WhalezChain Core, public exchange layer, and WHZ, PTN, and PRN."
              width={1600}
              height={1120}
              sizes="(max-width: 768px) 1100px, 1280px"
              className="h-auto w-full transition duration-700 group-hover:scale-[1.008]"
              priority={false}
            />
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#061426]/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-xl">
              Open full blueprint <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </div>

        <div className="mt-5 flex flex-col gap-2 text-xs leading-6 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Illustrative architecture · labels and concepts retained from the source blueprint.</p>
          <p>Not a live health dashboard or proof of real-money execution, provider readiness, external liquidity or settlement certification.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {principles.map((principle, index) => {
            const Icon = principle.icon
            return (
              <article key={principle.title} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-white/[0.055]">
                <div aria-hidden="true" className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/10 blur-3xl transition group-hover:bg-primary/20" />
                <div className="relative flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.2em] text-primary">0{index + 1}</span>
                  <Icon className="h-5 w-5 text-cyan-200 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="relative mt-5 text-lg font-semibold text-foreground">{principle.title}</h3>
                <p className="relative mt-3 text-sm leading-7 text-muted-foreground">{principle.copy}</p>
              </article>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/deltaalpha" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110">Explore DeltaAlpha</Link>
          <Link href="/whalezchain" className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:bg-white/10">Explore WhalezChain</Link>
        </div>
      </div>
    </section>
  )
}
