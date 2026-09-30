"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Activity, ArrowRight, CircleDollarSign, RefreshCw, ShieldCheck } from "lucide-react"
import {
  createDefaultPortfolio, currentWeights, engineStatus, portfolioValue, previewRebalance, simulateMarketTick,
  type InvestmentPortfolio,
} from "@/lib/whalez-ai/engines/investment-engine"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function InvestmentDashboard() {
  const [portfolio, setPortfolio] = useState<InvestmentPortfolio>(() => createDefaultPortfolio())
  const weights = currentWeights(portfolio)
  const rebalance = useMemo(() => previewRebalance(portfolio), [portfolio])
  const status = engineStatus()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Reference Value</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{"$" + portfolioValue(portfolio).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div><p className="mt-1 text-xs text-muted-foreground">USD reference unit</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Simulated Return</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{portfolio.simulatedReturnPct.toFixed(2)}%</div><p className="mt-1 text-xs text-muted-foreground">Scenario output only</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Risk Band</CardTitle></CardHeader><CardContent><Badge variant="outline">{portfolio.riskBand}</Badge><p className="mt-2 text-xs text-muted-foreground">Context only; not advice</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Intelligence</CardTitle></CardHeader><CardContent><div className="flex items-center gap-2 text-sm"><Activity className="h-4 w-4 text-primary" />{status.intelligence}</div><p className="mt-1 text-xs text-muted-foreground">{status.mode}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><CardTitle>Portfolio Model</CardTitle><p className="mt-1 text-sm text-muted-foreground">Native and external assets remain modeled separately; no custody or broker execution is implied.</p></div>
          <div className="flex gap-2"><Button variant="outline" onClick={() => setPortfolio((current) => simulateMarketTick(current))}><RefreshCw className="mr-2 h-4 w-4" />Simulate Tick</Button><Link href="/investment/terminal"><Button><ArrowRight className="mr-2 h-4 w-4" />Open Terminal</Button></Link></div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-sm">
            <thead><tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="pb-3">Asset</th><th className="pb-3">Units</th><th className="pb-3">Reference</th><th className="pb-3">Weight</th><th className="pb-3">Target</th></tr></thead>
            <tbody>{portfolio.holdings.map((holding) => <tr key={holding.symbol} className="border-b border-border/50"><td className="py-4"><div className="font-medium text-foreground">{holding.symbol}</div><div className="text-xs text-muted-foreground">{holding.label} · {holding.category}</div></td><td className="py-4 font-mono">{holding.units}</td><td className="py-4 font-mono">{"$" + holding.referenceValue.toLocaleString()}</td><td className="py-4 font-mono">{weights[holding.symbol]?.toFixed(2)}%</td><td className="py-4 font-mono">{holding.targetPct.toFixed(2)}%</td></tr>)}</tbody>
          </table></div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><CircleDollarSign className="h-5 w-5 text-primary" />Rebalance Preview</CardTitle></CardHeader><CardContent className="space-y-3">{rebalance.map((item) => <div key={item.symbol} className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3"><div><span className="font-medium">{item.symbol}</span><span className="ml-2 text-xs text-muted-foreground">{item.action}</span></div><span className="font-mono text-xs">{item.deltaPct > 0 ? "+" : ""}{item.deltaPct}%</span></div>)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Execution Boundary</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p>This is a Whalez-AI Investment capability backed by a portfolio simulation engine.</p><p>No brokerage order is submitted. No asset is custodied. No settlement instruction is sent. External positions are modeled observations only.</p><Link href="/dashboard" className="inline-flex items-center text-primary hover:underline">Return to product dashboard <ArrowRight className="ml-1 h-4 w-4" /></Link></CardContent></Card>
      </div>
    </div>
  )
}