"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, Brain, CircleGauge, GraduationCap, ShieldCheck, Sparkles } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const topics = [
  { id: "market", title: "Understand the market", prompt: "Explain the current market situation in plain language.", response: "Start with context before action: trend, volatility, liquidity, and the event moving the market. A strong decision begins by knowing what changed and what did not." },
  { id: "risk", title: "Build a risk habit", prompt: "Help me think about risk before I commit capital.", response: "Define the amount you can actually afford to expose, identify what would invalidate your thesis, and separate confidence in the idea from the risk of the position. Risk control is a process, not a prediction." },
  { id: "investing", title: "Learn investing", prompt: "Teach me how to evaluate an investment idea.", response: "Frame the thesis, time horizon, downside, expected drivers, liquidity, and evidence quality. Then compare the opportunity with alternatives instead of evaluating it in isolation." },
  { id: "discipline", title: "Improve discipline", prompt: "Help me stop making impulsive decisions.", response: "Use a written decision process: why am I acting, what evidence supports it, what would change my mind, and what is my maximum acceptable downside? Good process reduces emotional drift." },
] as const

export default function CoachingPage() {
  const [activeId, setActiveId] = useState<(typeof topics)[number]["id"]>("market")
  const active = useMemo(() => topics.find((topic) => topic.id === activeId) ?? topics[0], [activeId])
  return (
    <>
      <Navigation />
      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary"><Brain className="mr-1 h-3.5 w-3.5" /> Whalez-AI capability preview</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">AI Coaching for financial understanding</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">Coaching sits above the market tools: explain what is happening, help the participant reason about risk, build better habits, and turn complex financial information into decisions they can understand.</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-primary" /> Coaching paths</CardTitle></CardHeader><CardContent className="space-y-2">
              {topics.map((topic) => <button key={topic.id} type="button" onClick={() => setActiveId(topic.id)} className={`w-full rounded-xl border px-4 py-4 text-left transition ${active.id === topic.id ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/25"}`}><div className="text-sm font-medium text-foreground">{topic.title}</div><div className="mt-1 text-xs leading-5 text-muted-foreground">{topic.prompt}</div></button>)}
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><CircleGauge className="h-5 w-5 text-primary" /> Guided session</CardTitle></CardHeader><CardContent>
              <div className="rounded-2xl border border-border bg-secondary/30 p-5"><p className="text-xs uppercase tracking-[0.18em] text-primary">Your coaching prompt</p><p className="mt-3 text-base font-medium leading-7 text-foreground">{active.prompt}</p><div className="my-5 h-px bg-border" /><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Whalez-AI guidance</p><p className="mt-3 text-sm leading-7 text-muted-foreground">{active.response}</p></div>
              <div className="mt-5 flex flex-wrap gap-3"><Link href="/investment"><Button>Open Investment <ArrowRight className="ml-2 h-4 w-4" /></Button></Link><Link href="/terminal"><Button variant="outline">Open Market Terminal</Button></Link></div>
            </CardContent></Card>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6"><ShieldCheck className="h-5 w-5 text-primary" /><h2 className="mt-4 text-lg font-semibold text-foreground">The role of coaching</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Coaching is not a promise engine. Its job is to improve understanding, reasoning, and disciplined participation while keeping uncertainty visible.</p></div>
            <div className="rounded-2xl border border-border bg-card p-6"><Sparkles className="h-5 w-5 text-primary" /><h2 className="mt-4 text-lg font-semibold text-foreground">Beta posture</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">This public page demonstrates the coaching experience. A production intelligence bridge is a separate activation stage and will not be implied by this UI.</p></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
