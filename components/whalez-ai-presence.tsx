"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Brain, CircleDot, ShieldCheck, Sparkles } from "lucide-react"

const capabilities = [
  "Market intelligence",
  "Risk reasoning",
  "Investment context",
  "Trading analysis",
  "Settlement awareness",
  "WhalezChain state",
]

export function WhalezAIPresence() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const capabilityTimer = window.setInterval(() => {
      setIndex((current) => (current + 1) % capabilities.length)
    }, 2600)
    return () => window.clearInterval(capabilityTimer)
  }, [])

  return (
    <section aria-labelledby="whalez-ai-presence-title" className="border-y border-white/10 bg-card/50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <CircleDot className="h-3.5 w-3.5 motion-safe:animate-pulse" />
              Capability spotlight · illustrative
            </div>
            <h2 id="whalez-ai-presence-title" className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              One intelligence, visibly present across the ecosystem.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              The same Whalez-AI identity can focus on different jobs without splintering into separate brands or independent authorities.
              What changes is the delegated capability—not the identity or the governing vision.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {capabilities.map((capability, itemIndex) => (
                <span
                  key={capability}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-500 ${itemIndex === index ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_18px_rgba(96,165,250,0.12)]" : "border-white/10 bg-white/5 text-muted-foreground"}`}
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-background/80 p-5 shadow-[0_0_70px_rgba(96,165,250,0.09)]">
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                  <span aria-hidden="true" className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-cyan-200" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">WHALEZ-AI</p>
                  <p className="text-xs text-muted-foreground">Unified intelligence identity</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                Many capabilities
              </div>
            </div>

            <div className="relative mt-5 rounded-2xl border border-border bg-card/80 p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Capability in focus</p>
              <p className="mt-2 min-h-[2rem] text-xl font-semibold text-foreground transition-all duration-500">{capabilities[index]}</p>
              <div aria-hidden="true" className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 transition-all duration-700" style={{ width: `${((index + 1) / capabilities.length) * 100}%` }} />
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Animated capability spotlight only; this panel does not report live runtime health, uptime or execution authority.
              </p>
            </div>

            <div className="relative mt-4 grid grid-cols-3 gap-3">
              {[
                ["/whz-icon.svg", "WHZ", "Whalez-Mint"],
                ["/ptn-icon.svg", "PTN", "Plutonium"],
                ["/prn-icon.svg", "PRN", "Plutoranium"],
              ].map(([src, symbol, name]) => (
                <div key={symbol} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-center transition hover:border-primary/30 hover:bg-white/[0.06]">
                  <Image src={src} alt={`${symbol} — ${name}`} width={52} height={52} className="mx-auto h-11 w-11 object-contain" />
                  <p className="mt-2 text-xs font-semibold text-foreground">{symbol}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{name}</p>
                </div>
              ))}
            </div>

            <div className="relative mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Founder Authority remains above delegated capabilities; public access, jurisdiction and settlement gates stay separate.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
