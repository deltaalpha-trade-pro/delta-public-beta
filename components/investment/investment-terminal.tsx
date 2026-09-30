"use client"

import { useMemo, useState } from "react"
import { ArrowRight, BrainCircuit, CheckCircle2, Play, RotateCcw, ShieldCheck } from "lucide-react"
import { createDefaultPortfolio, previewRebalance, simulateMarketTick, portfolioValue, type InvestmentPortfolio } from "@/lib/whalez-ai/engines/investment-engine"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function InvestmentTerminal() {
  const [portfolio, setPortfolio] = useState<InvestmentPortfolio>(() => createDefaultPortfolio())
  const [decision, setDecision] = useState<"HOLD" | "REBALANCE">("HOLD")
  const rebalance = useMemo(() => previewRebalance(portfolio), [portfolio])
  const changes = rebalance.filter((item) => item.action !== "HOLD").length

  function runScenario() {
    const next = simulateMarketTick(portfolio)
    setPortfolio(next)
    setDecision(previewRebalance(next).some((item) => item.action !== "HOLD") ? "REBALANCE" : "HOLD")
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <Card><CardHeader><div className="flex items-center justify-between gap-3"><div><CardTitle>Investment Intelligence Terminal</CardTitle><p className="mt-1 text-sm text-muted-foreground">Scenario analysis, allocation drift, and governed action preparation.</p></div><Badge variant="outline"><BrainCircuit className="mr-1 h-3 w-3" />Whalez-AI</Badge></div></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-border bg-secondary/30 p-4"><div className="text-xs text-muted-foreground">Mode</div><div className="mt-2 font-medium">SIMULATION ONLY</div></div><div className="rounded-xl border border-border bg-secondary/30 p-4"><div className="text-xs text-muted-foreground">Model Value</div><div className="mt-2 font-mono">{"$" + portfolioValue(portfolio).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div></div><div className="rounded-xl border border-border bg-secondary/30 p-4"><div className="text-xs text-muted-foreground">Prepared Decision</div><div className="mt-2 font-medium">{decision}</div></div></div>
          <div className="space-y-2">{rebalance.map((item) => <div key={item.symbol} className="flex items-center justify-between rounded-xl border border-border p-4"><div><div className="font-medium">{item.symbol}</div><div className="text-xs text-muted-foreground">Current {item.currentPct}% · Target {item.targetPct}%</div></div><Badge variant={item.action === "HOLD" ? "outline" : "secondary"}>{item.action}</Badge></div>)}</div>
          <div className="flex flex-wrap gap-3"><Button onClick={runScenario}><Play className="mr-2 h-4 w-4" />Run Allocation Scenario</Button><Button variant="outline" onClick={() => { setPortfolio(createDefaultPortfolio()); setDecision("HOLD") }}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button></div>
          <p className="text-xs text-muted-foreground">Detected allocation deviations: {changes}. This is an analytical result, not an investment instruction.</p>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Prepared, not executed</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-muted-foreground">{["Whalez-AI analyzes the modeled portfolio.","Allocation changes are prepared as a scenario.","Policy, identity, jurisdiction, and approvals remain outside this public beta surface.","No broker, custody, or settlement API is called."].map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-primary" /><span>{item}</span></div>)}<div className="rounded-xl border border-border bg-secondary/30 p-4"><div className="text-xs uppercase tracking-wider text-muted-foreground">Intelligence boundary</div><p className="mt-2">The terminal is a product surface for the single Whalez-AI intelligence layer—not a separate public AI.</p></div><a href="/investment" className="inline-flex items-center text-primary hover:underline">Back to Investment Dashboard <ArrowRight className="ml-1 h-4 w-4" /></a></CardContent></Card>
    </div>
  )
}