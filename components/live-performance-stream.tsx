"use client"

import Image from "next/image"
import { useState } from "react"
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  GitBranch,
  MessageSquare,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const stages: { number: string; title: string; detail: string; icon: LucideIcon }[] = [
  { number: "01", title: "Understand", detail: "Interpret the user's request", icon: MessageSquare },
  { number: "02", title: "Route", detail: "Select a suitable capability", icon: GitBranch },
  { number: "03", title: "Govern", detail: "Apply policy and permission checks", icon: ShieldCheck },
  { number: "04", title: "Verify", detail: "Check the result and its limits", icon: CheckCircle2 },
  { number: "05", title: "Respond", detail: "Explain the outcome clearly", icon: Brain },
]

export function LivePerformanceStream() {
  const [playing, setPlaying] = useState(true)

  return (
    <section aria-labelledby="live-performance-title" className="relative overflow-hidden py-20 md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(37,99,235,0.08),transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/[0.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.17em] text-sky-200">
              <Sparkles className={"h-3.5 w-3.5 " + (playing ? "motion-safe:animate-pulse" : "")} />
              Intelligence lifecycle · visual preview
            </div>
            <h2 id="live-performance-title" className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Make the intelligence process visible.
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              Users see the service move from a request to a checked response, with clear boundaries between choosing a capability,
              applying safeguards, and explaining the outcome.
            </p>
          </div>
          <Button variant="outline" onClick={() => setPlaying((value) => !value)} className="w-fit">
            {playing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {playing ? "Pause visual effects" : "Play visual effects"}
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-sky-300/15 bg-[#070b12] p-4 shadow-[0_0_90px_rgba(37,99,235,0.09)] sm:p-7">
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />

          <div className="relative flex flex-col items-center gap-4 border-b border-white/10 pb-6 text-center sm:flex-row sm:text-left">
            <div className={"relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-sky-200/20 bg-sky-200/[0.06] " + (playing ? "shadow-[0_0_30px_rgba(56,189,248,0.13)]" : "")}>
              <Image src="/brand/whalez-ai-ecosystem.svg" alt="Whalez-AI ecosystem mark" width={52} height={52} className="h-12 w-12 object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold tracking-wide text-white">WHALEZ-AI · GOVERNED INTERACTION</p>
              <p className="mt-1 text-sm text-slate-400">A model-neutral experience: understand → route → govern → verify → respond.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
              Concept flow
            </span>
          </div>

          <div className="relative grid gap-3 pt-6 sm:grid-cols-2 lg:grid-cols-5">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon
              return (
                <div key={stage.number} className="relative">
                  <div className={"h-full rounded-2xl border p-4 transition-all duration-500 " + (playing ? "border-sky-300/20 bg-white/[0.035]" : "border-white/10 bg-white/[0.02]")}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium tracking-[0.2em] text-slate-500">{stage.number}</span>
                      <StageIcon className={"h-5 w-5 text-sky-200 " + (playing ? "motion-safe:animate-pulse" : "")} />
                    </div>
                    <p className="mt-5 text-base font-semibold text-white">{stage.title}</p>
                    <p className="mt-2 text-xs leading-6 text-slate-400">{stage.detail}</p>
                  </div>
                  {index < stages.length - 1 && (
                    <ArrowRight aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-sky-200/60 lg:block" />
                  )}
                </div>
              )
            })}
          </div>

          <p className="relative mt-5 flex items-start gap-2 text-xs leading-6 text-slate-500">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-200/70" />
            Illustrative lifecycle only—not a live service trace, private reasoning dump, market-data stream, or execution confirmation.
          </p>
        </div>
      </div>
    </section>
  )
}

[executed on device: localhost (62449cdf-8b87-4c0d-821e-6218490f8c4c)]
