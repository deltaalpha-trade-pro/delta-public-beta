"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Unlock, AlertCircle, Flame } from "lucide-react"

export function SettlementBondCard() {
  const whzState = {
    totalHeld: 75,
    locked: 50,
    available: 25,
    burned: 12.5, // Historical burned WHZ
    minRequired: 50,
    bondStatus: "ACTIVE" as const,
    settlementTier: "Standard",
    slashRisk: 0,
  }

  const bondSatisfied = whzState.locked >= whzState.minRequired

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            WHZ Settlement Bond
          </CardTitle>
          <Badge
            variant="outline"
            className={
              bondSatisfied
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-red-500/10 text-red-400 border-red-500/30"
            }
          >
            {bondSatisfied ? "Bond Active" : "Insufficient Bond"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          WHZ is a settlement bond, not a speculative asset. Locked WHZ enables pre-finality privileges.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <p className="text-xl font-bold text-foreground">{whzState.totalHeld}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Lock className="w-3 h-3 text-amber-500" />
            </div>
            <p className="text-xl font-bold text-amber-400">{whzState.locked}</p>
            <p className="text-xs text-amber-400/80">Locked</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Unlock className="w-3 h-3 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-emerald-400">{whzState.available}</p>
            <p className="text-xs text-emerald-400/80">Available</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Flame className="w-3 h-3 text-orange-500" />
            </div>
            <p className="text-xl font-bold text-orange-400">{whzState.burned}</p>
            <p className="text-xs text-orange-400/80">Burned</p>
          </div>
        </div>

        {/* Lock Requirement Bar */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Minimum Lock Requirement</span>
            <span className="text-xs text-muted-foreground">{whzState.minRequired} WHZ</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${bondSatisfied ? "bg-emerald-500" : "bg-red-500"}`}
              style={{ width: `${Math.min((whzState.locked / whzState.minRequired) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Settlement Tier */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Settlement Tier</p>
            <p className="text-sm font-medium text-foreground">{whzState.settlementTier}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current Slash Risk</p>
            <p className="text-sm font-medium text-foreground">{whzState.slashRisk}%</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
          <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Locked WHZ is not spent—it is bonded. If a bridge or settlement fails, locked WHZ may be slashed
            proportionally. Burned WHZ is permanently removed from circulation. WHZ is not tradable on external markets.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
