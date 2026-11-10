"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Pause, Play, Sparkles, ShieldCheck, MessageSquare } from "lucide-react"

const chapters = [
  { eyebrow: "CHAPTER 01 · ORIGINS", title: "Before the first signal.", line: "Every new world begins with a question.", hue: "from-violet-500/25 via-slate-900 to-slate-950" },
  { eyebrow: "CHAPTER 02 · AWAKENING", title: "The city begins to listen.", line: "Intelligence grows. Human choice must endure.", hue: "from-cyan-500/20 via-blue-950 to-slate-950" },
  { eyebrow: "CHAPTER 03 · TOMORROW", title: "The future is still unwritten.", line: "A new generation discovers the world ahead.", hue: "from-amber-400/15 via-indigo-950 to-slate-950" },
] as const

const prompts = [
  { question: "What can I explore?", answer: "You can review market intelligence, product information, and educational material. Authenticated account features require verification and separate entitlement checks." },
  { question: "Where do I get help?", answer: "Use the customer support channels below. Tidio and WhatsApp are available only when configured, and Telegram is for public updates unless separately staffed for support." },
  { question: "What about WhalezChain?", answer: "Only approved public asset metadata and educational context may appear here. Mainnet finality, custody, and live settlement are not certified." },
] as const

const buildings = [29, 46, 36, 58, 41, 72, 34, 63, 47, 82, 39, 69, 54, 92, 47, 78, 59, 68, 35, 87, 53, 74, 43, 60, 34, 72, 51, 87, 37, 59]

export function AlphaAIShowcase() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setActive(current => (current + 1) % chapters.length), 9000)
    return () => window.clearInterval(timer)
  }, [playing])

  const chapter = chapters[active]
  return (
    <section id="alpha-ai" aria-labelledby="alpha-showcase-title" className="relative overflow-hidden border-y border-white/10 bg-[#070b15] py-16 text-white sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(106,73,210,0.15),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300"><Sparkles className="h-4 w-4" aria-hidden="true" /> Visual stories · public preview</p>
            <h2 id="alpha-showcase-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Meet Alpha-AI. Explore what comes next.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">Experience the ideas, people and future worlds behind our fictional story universe. Scenes are illustrative and are not live system telemetry.</p>
          </div>
          <span className="rounded-full border border-amber-300/30 px-3 py-1.5 text-xs text-amber-200">Staging preview · no financial execution</span>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-[#0c1325] shadow-[0_20px_65px_rgba(0,0,0,0.25)]">
            <div className={"relative isolate flex min-h-[265px] flex-col justify-end overflow-hidden bg-gradient-to-t "+chapter.hue+" p-6 sm:min-h-[355px] sm:p-9"}>
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-70" style={{backgroundImage:"radial-gradient(circle at 74% 29%,rgba(135,214,255,.35),transparent 20%), radial-gradient(circle at 20% 20%,rgba(164,104,255,.22),transparent 33%)"}} />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[54%] items-end justify-around gap-[2px] opacity-65">
                {buildings.map((height, i) => <span key={i} className={"block w-full rounded-t-sm border-t border-cyan-300/20 bg-gradient-to-t from-[#0e1b39] to-[#25406d] "+(playing?"motion-safe:animate-pulse":"")} style={{height:height+"%",animationDelay:(i*87)+"ms",animationDuration:"3s"}} />)}
              </div>
              <div className="relative z-10 max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-200">{chapter.eyebrow}</p>
                <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{chapter.title}</h3>
                <p className="mt-3 max-w-md text-sm text-slate-200">{chapter.line}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing?"Pause scenes":"Play scenes"} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 px-3 text-xs hover:bg-white/10">{playing?<Pause className="h-4 w-4"/>:<Play className="h-4 w-4"/>}{playing?"Pause":"Play"}</button>
                <button type="button" onClick={() => setActive(value=>(value+1)%chapters.length)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/20 px-3 text-xs hover:bg-white/10">Next chapter <ArrowRight className="h-4 w-4" /></button>
              </div>
              <div role="group" aria-label="Choose a chapter" className="flex gap-2">{chapters.map((scene, i)=><button type="button" key={scene.eyebrow} onClick={()=>setActive(i)} aria-label={"Chapter "+(i+1)} aria-pressed={i===active} className={"h-2 w-8 rounded-full "+(i===active?"bg-cyan-300":"bg-white/20")} />)}</div>
            </div>
          </div>
          <div className="flex flex-col rounded-3xl border border-white/15 bg-[#0c1325] p-5 sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.65)]" /><h3 className="font-semibold">Alpha-AI · guided preview</h3></div>
              <span className="text-xs text-slate-400">Scripted, not live AI</span>
            </div>
            <div aria-live="polite" className="flex-1 space-y-4">
              <div className="ml-auto max-w-[92%] rounded-xl border border-white/15 bg-[#162237] p-4 text-sm">{prompts[selected].question}</div>
              <div className="max-w-[95%] rounded-xl border border-violet-400/25 bg-violet-500/10 p-4 text-sm leading-7 text-slate-200">{prompts[selected].answer}</div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">{prompts.map((prompt,i)=><button key={prompt.question} type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)} className={"rounded-full border px-3 py-2 text-xs transition-colors "+(selected===i?"border-cyan-300/50 bg-cyan-300/10 text-cyan-100":"border-white/20 text-slate-200 hover:bg-white/5")}>{prompt.question}</button>)}</div>
            <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
              <Link className="inline-flex items-center gap-2 rounded-xl bg-cyan-200 px-4 py-3 text-sm font-semibold text-slate-950" href="/signup">Create an account <ArrowRight className="h-4 w-4"/></Link>
              <Link className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm text-white" href="/#communications"><MessageSquare className="h-4 w-4"/> Customer support</Link>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-400"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0"/> Private tools, user records, wallets and settlement operations are not accessible from this preview.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
