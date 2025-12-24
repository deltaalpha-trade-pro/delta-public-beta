"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TradingPanel } from "@/components/terminal/trading-panel"
import { BankingStateBar } from "@/components/terminal/banking-state-bar"
import { SettlementGate } from "@/components/terminal/settlement-gate"
import { Badge } from "@/components/ui/badge"
import { Terminal, Shield } from "lucide-react"

export default function TerminalPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Execution Terminal</h1>
                <p className="text-xs text-muted-foreground">Trading governed by Settlement Authority</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 w-fit">
              <Shield className="w-3 h-3 mr-1" />
              Authority Hierarchy Active
            </Badge>
          </div>

          {/* Banking State Bar - Always Visible at Top */}
          <div className="mb-4">
            <BankingStateBar />
          </div>

          {/* Main Terminal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Trading Panel - 3 columns */}
            <div className="lg:col-span-3">
              <TradingPanel />
            </div>

            {/* Settlement Gate - 1 column */}
            <div className="lg:col-span-1">
              <SettlementGate />
            </div>
          </div>

          {/* Authority Notice */}
          <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Authority Hierarchy:</strong> Trades may execute, but settlement speed
              depends on WHZ bond status. Insufficient bond results in SLOW_SETTLEMENT (standard T+2). The system can
              deny speed while allowing trades.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
