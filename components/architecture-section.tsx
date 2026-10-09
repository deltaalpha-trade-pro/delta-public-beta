import Image from "next/image"
import { ArrowUpRight, ShieldCheck } from "lucide-react"

export function ArchitectureSection() {
  return (
    <section aria-labelledby="resilience-blueprint-title" className="relative overflow-hidden border-y border-white/10 bg-[#06101b] py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100">
              <ShieldCheck className="h-3.5 w-3.5" /> Layered resilience
            </span>
            <h2 id="resilience-blueprint-title" className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Designed to connect. Built to recover.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Your private-cloud reference is retained as a layered model: networking, compute, storage, databases,
              security, observability, automation and backup. The public view shows the resilience principles without
              exposing private vendor wiring or implying that every design option is already deployed.
            </p>
          </div>
          <div className="max-w-sm rounded-2xl border border-amber-200/15 bg-amber-200/[0.045] p-5">
            <p className="text-sm font-semibold text-amber-100">Blueprint, not status telemetry</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Provider choice, redundancy, security controls and recovery readiness must be proven for each deployment.
              This graphic is not a certification or uptime claim.
            </p>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-cyan-200/15 bg-[#050b15] shadow-[0_0_80px_rgba(59,130,246,0.09)]">
          <a href="/brand/whalez-resilience-layers.svg" target="_blank" rel="noreferrer" aria-label="Open full resilience architecture overview in a new tab" className="group block">
            <Image
              src="/brand/whalez-resilience-layers.svg"
              alt="Layered resilience architecture overview showing networking, compute, storage, data, security, observability and recovery; an illustrative design rather than a live deployment inventory."
              width={1500}
              height={690}
              sizes="(max-width: 768px) 1200px, 1280px"
              className="h-auto w-full transition duration-700 group-hover:scale-[1.006]"
            />
            <span className="mx-4 mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-foreground">
              View the full resilience map <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
