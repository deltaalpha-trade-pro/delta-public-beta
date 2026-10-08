"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Activity, Brain, CircleDot, ShieldCheck } from "lucide-react"

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
  const [heartbeat, setHeartbeat] = useState(0)

  useEffect(() => {
    const capabilityTimer = window.setInterval(() => {
      setIndex((current) => (current + 1) % capabilities.length)
    }, 2200)
    const heartbeatTimer = window.setInterval(() => {
      setHeartbeat((current) => current + 1)
    }, 1000)
    return () => {
      window.clearInterval(capabilityTimer)
      window.clearInterval(heartbeatTimer)
    }
  }, [])

  return (
    <section aria-labelledby="whalez-ai-presence-title" className="py-20 md:py-24 border-y border-border bg-card/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <CircleDot className="h-3.5 w-3.5 animate-pulse" />
              Whalez-AI live presence
            </div>
            <h2 id="whalez-ai-presence-title" className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              One intelligence, visibly present across the ecosystem.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              The public surface presents Whalez-AI as one coherent intelligence identity while different capabilities
              rotate underneath the same governed experience. No private model, agent, or control-plane internals are exposed here.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {capabilities.map((capability, itemIndex) => (
                <span
                  key={capability}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-all ${itemIndex === index ? "border-primary/40 bg-primary/10 text-primary" : "border-white/10 bg-white/5 text-muted-foreground"}`}
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-primary/20 bg-background/80 p-5 shadow-[0_0_70px_rgba(96,165,250,0.09)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">WHALEZ-AI</p>
                  <p className="text-xs text-muted-foreground">Public capability presence</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                ONLINE
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card/80 p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Current capability</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{capabilities[index]}</p>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-2/3 rounded-full bg-primary transition-all duration-700" />
              </div>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                Governed public presence · heartbeat {heartbeat % 1000} · capability routing remains policy-controlled.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                ["/whz-icon.svg", "WHZ", "Whalez-Mint"],
                ["/ptn-icon.svg", "PTN", "Plutonium"],
                ["/prn-icon.svg", "PRN", "Plutoranium"],
              ].map(([src, symbol, name]) => (
                <div key={symbol} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                  <Image src={src} alt={`${symbol} ${name} icon`} width={52} height={52} className="mx-auto h-11 w-11 object-contain" />
                  <p className="mt-2 text-xs font-semibold text-foreground">{symbol}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{name}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Identity and capability boundaries remain explicit in Controlled Live.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
