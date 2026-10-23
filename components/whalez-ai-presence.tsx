"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Database,
  Eye,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

const models = [
  {
    id: "mind",
    name: "Whalez Mind",
    role: "General intelligence",
    description: "Organizes information, explains concepts, and structures complex questions.",
    icon: Brain,
    iconTone: "text-violet-300",
    iconSurface: "bg-violet-400/10 border-violet-300/25",
    activeSurface: "border-violet-300/60 bg-violet-400/[0.09]",
    glow: "shadow-[0_0_38px_rgba(167,139,250,0.12)]",
  },
  {
    id: "vision",
    name: "Whalez Vision",
    role: "Predictive intelligence",
    description: "Represents scenario analysis, pattern exploration, and forecast-oriented work.",
    icon: Eye,
    iconTone: "text-sky-300",
    iconSurface: "bg-sky-400/10 border-sky-300/25",
    activeSurface: "border-sky-300/60 bg-sky-400/[0.09]",
    glow: "shadow-[0_0_38px_rgba(56,189,248,0.12)]",
  },
  {
    id: "guardian",
    name: "Whalez Guardian",
    role: "Security intelligence",
    description: "Represents risk review, security checks, and safer operating boundaries.",
    icon: ShieldCheck,
    iconTone: "text-rose-300",
    iconSurface: "bg-rose-400/10 border-rose-300/25",
    activeSurface: "border-rose-300/60 bg-rose-400/[0.09]",
    glow: "shadow-[0_0_38px_rgba(251,113,133,0.12)]",
  },
  {
    id: "chain",
    name: "Whalez Chain",
    role: "Ledger intelligence",
    description: "Represents provenance, ledger integrity, and evidence-aware state transitions.",
    icon: Network,
    iconTone: "text-amber-200",
    iconSurface: "bg-amber-300/10 border-amber-200/25",
    activeSurface: "border-amber-200/60 bg-amber-300/[0.09]",
    glow: "shadow-[0_0_38px_rgba(251,191,36,0.12)]",
  },
  {
    id: "agent",
    name: "Whalez Agent",
    role: "Workflow intelligence",
    description: "Represents tool-assisted tasks and workflows that remain under policy control.",
    icon: Rocket,
    iconTone: "text-cyan-300",
    iconSurface: "bg-cyan-400/10 border-cyan-300/25",
    activeSurface: "border-cyan-300/60 bg-cyan-400/[0.09]",
    glow: "shadow-[0_0_38px_rgba(34,211,238,0.12)]",
  },
  {
    id: "insight",
    name: "Whalez Insight",
    role: "Analytics intelligence",
    description: "Represents structured analysis, data visualization, and clear reporting.",
    icon: BarChart3,
    iconTone: "text-blue-300",
    iconSurface: "bg-blue-400/10 border-blue-300/25",
    activeSurface: "border-blue-300/60 bg-blue-400/[0.09]",
    glow: "shadow-[0_0_38px_rgba(96,165,250,0.12)]",
  },
  {
    id: "memory",
    name: "Whalez Memory",
    role: "Context intelligence",
    description: "Represents user-controlled continuity and context, subject to privacy settings.",
    icon: Database,
    iconTone: "text-teal-300",
    iconSurface: "bg-teal-400/10 border-teal-300/25",
    activeSurface: "border-teal-300/60 bg-teal-400/[0.09]",
    glow: "shadow-[0_0_38px_rgba(45,212,191,0.12)]",
  },
]

const presenceStages = [
  { label: "Available", detail: "The interface is ready to receive a request." },
  { label: "Listening", detail: "A real session could show that input is being received." },
  { label: "Understanding", detail: "The request is organized before a suitable capability is selected." },
  { label: "Checking safeguards", detail: "Policy and permission boundaries are checked before any consequential action." },
  { label: "Preparing a response", detail: "The interface can explain the result and distinguish confirmed facts from uncertainty." },
]

export function WhalezAIPresence() {
  const [activeModelId, setActiveModelId] = useState("mind")
  const [previewStage, setPreviewStage] = useState(0)
  const activeModel = models.find((model) => model.id === activeModelId) ?? models[0]!
  const ActiveModelIcon = activeModel.icon
  const stage = presenceStages[previewStage]

  return (
    <section
      aria-labelledby="whalez-ai-presence-title"
      className="relative isolate overflow-hidden border-y border-white/10 bg-[#070b12] py-20 md:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_12%_30%,rgba(96,165,250,0.12),transparent_33%),radial-gradient(ellipse_at_85%_65%,rgba(167,139,250,0.11),transparent_35%)]" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 xl:grid-cols-[1.05fr_0.95fr] xl:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[0.07] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.17em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Living presence · experience preview
            </div>
            <h2 id="whalez-ai-presence-title" className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Intelligence with a recognizable presence.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              One Whalez-AI identity, expressed through specialized capabilities. The interface gives people visible feedback,
              distinct model signatures, and clear explanations of what is happening—without exposing private control systems.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {models.map((model) => {
                const ModelIcon = model.icon
                const selected = activeModelId === model.id
                const buttonClass = "group min-h-[122px] rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 " +
                  (selected ? model.activeSurface + " " + model.glow : "border-white/10 bg-white/[0.025] hover:border-white/25 hover:bg-white/[0.05]")
                return (
                  <button
                    key={model.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setActiveModelId(model.id)}
                    className={buttonClass}
                  >
                    <span className={"flex h-10 w-10 items-center justify-center rounded-xl border " + model.iconSurface}>
                      <ModelIcon className={"h-5 w-5 " + model.iconTone} />
                    </span>
                    <span className="mt-3 block text-sm font-semibold text-white">{model.name}</span>
                    <span className="mt-1 block text-[11px] leading-5 text-slate-400">{model.role}</span>
                  </button>
                )
              })}
            </div>

            <p className="mt-5 flex items-start gap-2 text-xs leading-6 text-slate-400">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
              Design direction draws from the Founder Replica and intelligence-model artwork in your Library. The public experience uses the shared whale mark; the Founder Replica remains a private governance persona.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-sky-300/20 bg-[#0a111d]/90 p-5 shadow-[0_0_90px_rgba(37,99,235,0.12)] backdrop-blur-xl sm:p-7">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

            <div className="relative flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Whalez-AI</p>
                <p className="mt-1 text-sm font-semibold text-white">Public intelligence interface</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wide text-amber-100">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-200" />
                Preview mode
              </span>
            </div>

            <div className="relative mx-auto mt-8 flex min-h-[250px] max-w-sm flex-col items-center justify-center text-center">
              <div aria-hidden="true" className="absolute h-56 w-56 rounded-full border border-sky-300/15" />
              <div aria-hidden="true" className="absolute h-44 w-44 rounded-full border border-dashed border-blue-300/20 motion-safe:animate-[spin_42s_linear_infinite] motion-reduce:animate-none" />
              <div aria-hidden="true" className="absolute h-32 w-32 rounded-full bg-sky-300/10 blur-2xl" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-sky-200/25 bg-[#0e1c2d] shadow-[0_0_50px_rgba(56,189,248,0.18)]">
                <Image
                  src="/brand/whalez-ai-ecosystem.svg"
                  alt="Whalez-AI whale crest"
                  width={88}
                  height={88}
                  priority={false}
                  className="h-[5.5rem] w-[5.5rem] object-contain"
                />
              </div>
              <h3 className="relative mt-5 text-2xl font-semibold tracking-wide text-white">WHALEZ-AI</h3>
              <p className="relative mt-2 max-w-xs text-sm leading-6 text-slate-400">
                One coherent presence across many governed capabilities.
              </p>
            </div>

            <div className="relative mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className={"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border " + activeModel.iconSurface}>
                  <ActiveModelIcon className={"h-5 w-5 " + activeModel.iconTone} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Selected visual profile</p>
                  <p className="mt-1 text-base font-semibold text-white">{activeModel.name}</p>
                  <p className="mt-1 text-xs font-medium text-slate-300">{activeModel.role}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{activeModel.description}</p>
                </div>
              </div>
            </div>

            <div className="relative mt-4 rounded-2xl border border-sky-300/15 bg-sky-300/[0.035] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Presence cycle · illustrative</p>
                <Activity className="h-4 w-4 text-sky-200" />
              </div>
              <p aria-live="polite" className="mt-2 text-lg font-semibold text-white">{stage.label}</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">{stage.detail}</p>
              <div className="mt-4 flex gap-1.5" aria-label={"Preview stage " + (previewStage + 1) + " of " + presenceStages.length}>
                {presenceStages.map((item, index) => (
                  <span key={item.label} className={"h-1.5 flex-1 rounded-full transition-colors " + (index <= previewStage ? "bg-sky-300" : "bg-white/10")} />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPreviewStage((current) => (current + 1) % presenceStages.length)}
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-sky-200/25 bg-sky-200/[0.08] px-4 py-2 text-sm font-medium text-sky-100 transition hover:bg-sky-200/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200"
              >
                Preview next state
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="relative mt-4 text-[11px] leading-5 text-slate-500">
              This panel is an interaction-design preview, not a live session or health probe. Selecting a model changes its visual profile only; actual routing, availability, and responses must be reported by the connected runtime.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
