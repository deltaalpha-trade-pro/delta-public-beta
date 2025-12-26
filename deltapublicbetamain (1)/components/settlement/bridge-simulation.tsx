"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Unlink, Play, CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react"

type BridgeState = "idle" | "initiated" | "locked" | "bridging" | "finalizing" | "complete" | "failed"

export function BridgeSimulation() {
  const [state, setState] = useState<BridgeState>("idle")
  const [whzSlashed, setWhzSlashed] = useState(0)

  const stateLabels: Record<BridgeState, string> = {
    idle: "Ready",
    initiated: "Initiated",
    locked: "Assets Locked",
    bridging: "Cross-Chain Transfer",
    finalizing: "Finalizing",
    complete: "Complete",
    failed: "Failed - WHZ Slashed",
  }

  const runBridge = (shouldFail: boolean) => {
    setState("initiated")
    setWhzSlashed(0)

    const sequence: BridgeState[] = shouldFail
      ? ["initiated", "locked", "bridging", "failed"]
      : ["initiated", "locked", "bridging", "finalizing", "complete"]

    sequence.forEach((s, i) => {
      setTimeout(
        () => {
          setState(s)
          if (s === "failed") {
            setWhzSlashed(5) // 5 WHZ slashed on failure
          }
        },
        (i + 1) * 1200,
      )
    })
  }

  const reset = () => {
    setState("idle")
    setWhzSlashed(0)
  }

  const getStateColor = () => {
    switch (state) {
      case "idle":
        return "bg-muted-foreground/10 text-muted-foreground"
      case "complete":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/30"
      default:
        return "bg-primary/10 text-primary border-primary/30"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Unlink className="w-5 h-5 text-primary" />
          Bridge Simulation
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Simulate cross-chain bridge with success/failure scenarios and WHZ slashing
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* State Display */}
        <div className="p-6 rounded-lg bg-secondary/50 text-center">
          <Badge variant="outline" className={`${getStateColor()} mb-3`}>
            {state === "idle" ? (
              <Clock className="w-3 h-3 mr-1" />
            ) : state === "complete" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : state === "failed" ? (
              <AlertTriangle className="w-3 h-3 mr-1" />
            ) : (
              <ArrowRight className="w-3 h-3 mr-1 animate-pulse" />
            )}
            {stateLabels[state]}
          </Badge>

          <div className="text-3xl font-mono font-bold text-foreground mb-1">500 PRN</div>
          <p className="text-xs text-muted-foreground">Bridge Amount</p>

          {whzSlashed > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400 font-medium">-{whzSlashed} WHZ Slashed</p>
              <p className="text-xs text-red-400/70">Bond penalty for failed bridge</p>
            </div>
          )}

          {state === "complete" && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-emerald-400 font-medium">Bridge Successful</p>
              <p className="text-xs text-emerald-400/70">No WHZ slashed - bond preserved</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => runBridge(false)}
            disabled={state !== "idle"}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Success Path
          </Button>
          <Button
            onClick={() => runBridge(true)}
            disabled={state !== "idle"}
            variant="outline"
            className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Failure Path
          </Button>
        </div>

        {(state === "complete" || state === "failed") && (
          <Button variant="outline" onClick={reset} className="w-full bg-transparent">
            Reset Simulation
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
