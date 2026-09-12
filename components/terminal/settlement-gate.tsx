"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, CheckCircle, XCircle, AlertTriangle, Zap, Clock, ArrowRight } from "lucide-react"

type AuthorizationState = "checking" | "authorized" | "denied" | "slow"

export function SettlementGate() {
  const [authState, setAuthState] = useState<AuthorizationState>("authorized")

  // Simulated settlement state for the public beta experience.
  const settlementState = {
    whzLocked: 50,
    whzRequired: 50,
    exposure: 12500,
    maxExposure: 25000,
    pendingSettlements: 2,
    bondSatisfied: true,
    canAccelerate: true,
  }

  const simulateCheck = () => {
    setAuthState("checking")
    setTimeout(() => {
      if (settlementState.bondSatisfied && settlementState.exposure < settlementState.maxExposure) {
        setAuthState("authorized")
      } else if (!settlementState.bondSatisfied) {
        setAuthState("slow")
      } else {
        setAuthState("denied")
      }
    }, 1500)
  }

  const getAuthDisplay = () => {
    switch (authState) {
      case "checking":
        return {
          icon: <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />,
          title: "Checking Demo Settlement State",
          description: "Simulating WHZ bond and exposure checks...",
          badge: null,
          color: "text-muted-foreground",
        }
      case "authorized":
        return {
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
          title: "Accelerated Settlement Simulated",
          description: "Demo WHZ bond state satisfies the simulated acceleration rules.",
          badge: (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Zap className="w-3 h-3 mr-1" />
              SIMULATED T+0
            </Badge>
          ),
          color: "text-emerald-400",
        }
      case "slow":
        return {
          icon: <Clock className="w-8 h-8 text-amber-400" />,
          title: "Standard Settlement Simulated",
          description: "Demo bond state produces the simulated standard-speed outcome.",
          badge: (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Clock className="w-3 h-3 mr-1" />
              SIMULATED T+2
            </Badge>
          ),
          color: "text-amber-400",
        }
      case "denied":
        return {
          icon: <XCircle className="w-8 h-8 text-red-400" />,
          title: "Demo Execution Blocked",
          description: "The simulated exposure limit has been exceeded.",
          badge: (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <XCircle className="w-3 h-3 mr-1" />
              SIMULATED BLOCK
            </Badge>
          ),
          color: "text-red-400",
        }
    }
  }

  const auth = getAuthDisplay()

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2 text-base">
          <Shield className="w-5 h-5 text-primary" />
          Demo Settlement Simulation
        </CardTitle>
        <p className="text-xs text-muted-foreground">Synthetic authorization state for beta demonstration only</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simulated Authorization Status */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
          <div className="flex justify-center mb-3">{auth.icon}</div>
          <h4 className={`text-sm font-medium ${auth.color} mb-1`}>{auth.title}</h4>
          <p className="text-xs text-muted-foreground mb-3">{auth.description}</p>
          {auth.badge}
        </div>

        {/* WHZ Bond Simulation */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" /> Demo WHZ Locked
            </span>
            <span className="text-xs font-mono text-foreground">
              {settlementState.whzLocked} / {settlementState.whzRequired}
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                settlementState.bondSatisfied ? "bg-emerald-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min((settlementState.whzLocked / settlementState.whzRequired) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Exposure Simulation */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Demo Exposure</span>
            <span className="text-xs font-mono text-foreground">
              {settlementState.exposure.toLocaleString()} / {settlementState.maxExposure.toLocaleString()} PRN
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-primary transition-all"
              style={{ width: `${(settlementState.exposure / settlementState.maxExposure) * 100}%` }}
            />
          </div>
        </div>

        {/* Simulated Pending Settlements */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
          <span className="text-xs text-muted-foreground">Simulated Pending Settlements</span>
          <Badge variant="outline" className="text-xs">
            {settlementState.pendingSettlements}
          </Badge>
        </div>

        {/* Re-check Button */}
        <Button
          onClick={simulateCheck}
          variant="outline"
          className="w-full bg-transparent"
          disabled={authState === "checking"}
        >
          {authState === "checking" ? (
            "Checking Demo State..."
          ) : (
            <>
              Re-check Demo State
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Simulation Boundary Notice */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Simulation only:</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Bond, exposure, settlement speed, and authorization outcomes shown here are synthetic demo state. No live
                trade, custody, broker, or settlement execution is enabled.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
