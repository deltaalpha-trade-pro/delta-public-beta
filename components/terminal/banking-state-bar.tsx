"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Lock, Unlock, Vault, AlertCircle, CheckCircle } from "lucide-react"

export function BankingStateBar() {
  // Synthetic state shown for the public beta experience.
  const bankingState = {
    participantId: "WHL-DEMO-0042",
    accountStatus: "DEMO_SETTLEMENT",
    whz: {
      total: 75,
      locked: 50,
      available: 25,
      minRequired: 50,
    },
    escrowActive: 2,
    settlementTier: "SIMULATED_ACCELERATED",
  }

  const bondSatisfied = bankingState.whz.locked >= bankingState.whz.minRequired

  return (
    <Card className="bg-card/80 backdrop-blur border-border p-3">
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        {/* Demo Account Identity */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Demo Account:</span>
          <span className="text-xs font-mono text-foreground">{bankingState.participantId}</span>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${
              bankingState.accountStatus === "DEMO_SETTLEMENT"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }`}
          >
            {bankingState.accountStatus === "DEMO_SETTLEMENT" ? (
              <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
            ) : (
              <AlertCircle className="w-2.5 h-2.5 mr-0.5" />
            )}
            {bankingState.accountStatus}
          </Badge>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-border" />

        {/* WHZ Bond Simulation */}
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-amber-500" />
          <span className="text-xs text-muted-foreground">Demo WHZ Bond:</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-mono text-amber-400">{bankingState.whz.locked}</span>
            </div>
            <span className="text-xs text-muted-foreground">/</span>
            <div className="flex items-center gap-1">
              <Unlock className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400">{bankingState.whz.available}</span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${
              bondSatisfied
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
          >
            {bondSatisfied ? "SIMULATED BOND" : "INSUFFICIENT"}
          </Badge>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-border" />

        {/* Escrow Simulation */}
        <div className="flex items-center gap-2">
          <Vault className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Demo Escrow:</span>
          <span className="text-xs font-mono text-foreground">{bankingState.escrowActive} simulated</span>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-6 bg-border" />

        {/* Settlement Simulation Tier */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Demo Settlement:</span>
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${
              bankingState.settlementTier === "SIMULATED_ACCELERATED"
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {bankingState.settlementTier}
          </Badge>
        </div>
      </div>
    </Card>
  )
}
