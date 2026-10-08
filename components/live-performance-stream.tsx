"use client"

import { useEffect, useMemo, useState } from "react"
import { Pause, Play, Radio, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LivePerformanceStream() {
  const [playing, setPlaying] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 140)
    return () => window.clearInterval(timer)
  }, [])

  const bars = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => {
        const phase = (tick + index * 3) / 5
        return 18 + Math.abs(Math.sin(phase)) * 58 + ((index % 4) * 4)
      }),
    [tick],
  )

  return (
    <section aria-labelledby="live-performance-title" className="py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-3 py-1.5 text-xs font-medium text-red-300">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              LIVE VISUAL STREAM
            </div>
            <h2 id="live-performance-title" className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A living ecosystem, not a static page.
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              A browser-native performance visualizer gives the launch surface a live-broadcast feel without pulling an
              unverified third-party stream into the financial product experience.
            </p>
          </div>
          <Button variant="outline" onClick={() => setPlaying((value) => !value)} className="w-fit">
            {playing ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {playing ? "Pause stream" : "Play stream"}
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#05070b] p-4 shadow-[0_0_90px_rgba(37,99,235,0.12)]">
          <div className={`relative aspect-video overflow-hidden rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_22%,rgba(96,165,250,0.22),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(167,139,250,0.16),transparent_30%),#05070b] ${playing ? "" : "opacity-80"}`}>
            <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white/80 backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              LIVE · ECOSYSTEM PERFORMANCE
            </div>

            <div className="absolute inset-x-0 top-1/2 mx-auto h-40 w-40 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute left-1/2 top-[44%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-white/5 shadow-[0_0_70px_rgba(96,165,250,0.25)] backdrop-blur-md" />
            <div className="absolute left-1/2 top-[44%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-primary/30 bg-primary/10" />

            <div className="absolute inset-x-8 bottom-14 flex h-24 items-end justify-center gap-1">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className={`w-full max-w-3 rounded-full bg-primary/70 transition-[height] duration-100 ${playing ? "" : "h-4!"}`}
                  style={{ height: playing ? `${height}%` : "12%" }}
                />
              ))}
            </div>

            <div className="absolute inset-x-8 bottom-5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/50">
              <span>Whalez-AI presence</span>
              <span className="flex items-center gap-1"><Volume2 className="h-3 w-3" /> ambient visualizer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
