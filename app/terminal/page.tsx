"use client"

import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TradingPanel } from "@/components/terminal/trading-panel"
import { BankingStateBar } from "@/components/terminal/banking-state-bar"
import { SettlementGate } from "@/components/terminal/settlement-gate"
import { LiveMarketData } from "@/components/terminal/live-market-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Terminal, Shield, ArrowRight } from "lucide-react"

export default function TerminalPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Demo Trading Terminal</h1>
                <p className="text-xs text-muted-foreground">Live market observation with governed simulation execution</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 w-fit">
                <Shield className="w-3 h-3 mr-1" /> Public Beta Simulation
              </Badge>
              <Link href="/investment/terminal"><Button variant="outline" size="sm">Investment Terminal</Button></Link>
              <Link href="/escrow/terminal"><Button variant="outline" size="sm">Escrow Terminal</Button></Link>
              <Link href="/trading"><Button size="sm">Trading Workspace <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
            </div>
          </div>

          <div className="mb-4"><BankingStateBar /></div>
          <div className="mb-4"><LiveMarketData /></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3"><TradingPanel /></div>
            <div className="lg:col-span-1"><SettlementGate /></div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Execution boundary:</strong> Market quotes are observations from configured external sources when available.
              Order entry, WHZ bond simulation, exposure, escrow, and settlement outcomes remain simulation-only. No live trading, broker execution,
              custody, or settlement execution is enabled.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
