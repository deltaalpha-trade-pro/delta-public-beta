"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, CheckCircle, XCircle, AlertTriangle, Zap, Clock, ArrowRight } from "lucide-react"

type AuthorizationState = "checking" | "authorized" | "denied" | "slow"

export function SettlementGate() {
  const [authState, setAuthState] = useState<AuthorizationState>("authorized")

  // Simulated settlement state
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
          title: "Verifying Settlement Authority",
          description: "Checking WHZ bond and exposure limits...",
          badge: null,
          color: "text-muted-foreground",
        }
      case "authorized":
        return {
          icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
          title: "Accelerated Settlement Authorized",
          description: "WHZ bond active. Pre-finality execution enabled.",
          badge: (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <Zap className="w-3 h-3 mr-1" />
              T+0 Available
            </Badge>
          ),
          color: "text-emerald-400",
        }
      case "slow":
        return {
          icon: <Clock className="w-8 h-8 text-amber-400" />,
          title: "Standard Settlement Only",
          description: "Insufficient WHZ bond. Trades allowed at standard speed.",
          badge: (
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              <Clock className="w-3 h-3 mr-1" />
              T+2 Settlement
            </Badge>
          ),
          color: "text-amber-400",
        }
      case "denied":
        return {
          icon: <XCircle className="w-8 h-8 text-red-400" />,
          title: "Execution Blocked",
          description: "Exposure limit exceeded. Reduce positions or increase bond.",
          badge: (
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <XCircle className="w-3 h-3 mr-1" />
              Blocked
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
          Settlement Gate
        </CardTitle>
        <p className="text-xs text-muted-foreground">Authorization required for accelerated settlement</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Authorization Status */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border text-center">
          <div className="flex justify-center mb-3">{auth.icon}</div>
          <h4 className={`text-sm font-medium ${auth.color} mb-1`}>{auth.title}</h4>
          <p className="text-xs text-muted-foreground mb-3">{auth.description}</p>
          {auth.badge}
        </div>

        {/* WHZ Bond Status */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" /> WHZ Locked
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

        {/* Exposure */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Current Exposure</span>
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

        {/* Pending Settlements */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
          <span className="text-xs text-muted-foreground">Pending Settlements</span>
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
            "Checking..."
          ) : (
            <>
              Re-verify Authorization
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Authority Hierarchy Notice */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Authority Hierarchy:</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Trading is permitted. Settlement speed is governed separately. The system may{" "}
                <strong className="text-foreground">deny speed</strong> while{" "}
                <strong className="text-foreground">allowing trades</strong>.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
