"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, TrendingUp, Lock, Flame, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface EpochData {
  epoch: number
  ptnLocked: number
  volatility: number
  ratio: number
}

export function PtnPrnGraduation() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [epochs, setEpochs] = useState<EpochData[]>([])
  const [graduationStatus, setGraduationStatus] = useState<"idle" | "tracking" | "eligible" | "graduated" | "failed">(
    "idle",
  )
  const [prnIssued, setPrnIssued] = useState(0)
  const [ptnBurned, setPtnBurned] = useState(0)

  // Configuration
  const threshold = 2.5 // PTN_locked_avg / volatility threshold
  const requiredEpochs = 5 // N epochs required

  const generateEpoch = useCallback((epochNum: number): EpochData => {
    // Simulate PTN locked and volatility
    const ptnLocked = 1000 + Math.random() * 500 // 1000-1500 PTN locked
    const volatility = 200 + Math.random() * 400 // Volatility between 200-600
    const ratio = ptnLocked / volatility

    return {
      epoch: epochNum,
      ptnLocked: Math.round(ptnLocked),
      volatility: Math.round(volatility),
      ratio: Number.parseFloat(ratio.toFixed(2)),
    }
  }, [])

  const runSimulation = useCallback(() => {
    setIsSimulating(true)
    setEpochs([])
    setGraduationStatus("tracking")
    setPrnIssued(0)
    setPtnBurned(0)

    let currentEpoch = 0
    const interval = setInterval(() => {
      currentEpoch++
      const newEpoch = generateEpoch(currentEpoch)

      setEpochs((prev) => {
        const updated = [...prev, newEpoch]

        // Check graduation condition after N epochs
        if (updated.length >= requiredEpochs) {
          const recentEpochs = updated.slice(-requiredEpochs)
          const allAboveThreshold = recentEpochs.every((e) => e.ratio >= threshold)
          const avgRatio = recentEpochs.reduce((sum, e) => sum + e.ratio, 0) / requiredEpochs

          if (allAboveThreshold && avgRatio >= threshold) {
            setGraduationStatus("eligible")
          }
        }

        return updated
      })

      if (currentEpoch >= 8) {
        clearInterval(interval)
        setIsSimulating(false)
      }
    }, 1000)
  }, [generateEpoch, requiredEpochs, threshold])

  const executeGraduation = useCallback(() => {
    if (graduationStatus !== "eligible") return

    setGraduationStatus("graduated")
    // Slow, capped PRN issuance: 10% of locked PTN converts
    const lockedPtn = epochs[epochs.length - 1]?.ptnLocked || 0
    const newPrn = Math.floor(lockedPtn * 0.1)
    const burnedPtn = Math.floor(lockedPtn * 0.15) // PTN burn during graduation

    setPrnIssued(newPrn)
    setPtnBurned(burnedPtn)
  }, [graduationStatus, epochs])

  const reset = () => {
    setIsSimulating(false)
    setEpochs([])
    setGraduationStatus("idle")
    setPrnIssued(0)
    setPtnBurned(0)
  }

  const eligibleEpochCount = epochs.filter((e) => e.ratio >= threshold).length
  const progressPercent = Math.min((eligibleEpochCount / requiredEpochs) * 100, 100)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-500" />
            PTN → PRN Graduation
          </CardTitle>
          <Badge
            variant="outline"
            className={
              graduationStatus === "graduated"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : graduationStatus === "eligible"
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-secondary text-muted-foreground border-border"
            }
          >
            {graduationStatus === "idle" && "Ready"}
            {graduationStatus === "tracking" && "Tracking Epochs"}
            {graduationStatus === "eligible" && "Eligible"}
            {graduationStatus === "graduated" && "Graduated"}
            {graduationStatus === "failed" && "Failed"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">
          if (PTN_locked_avg / volatility ≥ {threshold}) over {requiredEpochs} epochs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Graduation Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Stability Epochs</span>
            <span className="text-foreground font-mono">
              {eligibleEpochCount} / {requiredEpochs}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Epoch History */}
        {epochs.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <p className="text-xs text-muted-foreground">Epoch History</p>
            {epochs.map((epoch) => (
              <div
                key={epoch.epoch}
                className={`flex items-center justify-between p-2 rounded text-xs ${
                  epoch.ratio >= threshold ? "bg-emerald-500/10" : "bg-red-500/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  {epoch.ratio >= threshold ? (
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-muted-foreground">Epoch {epoch.epoch}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">
                    <Lock className="w-3 h-3 inline mr-1" />
                    {epoch.ptnLocked} PTN
                  </span>
                  <span className="text-muted-foreground">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Vol: {epoch.volatility}
                  </span>
                  <span className={epoch.ratio >= threshold ? "text-emerald-400" : "text-red-400"}>
                    Ratio: {epoch.ratio}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Graduation Result */}
        {graduationStatus === "graduated" && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-3">
            <p className="text-sm font-medium text-emerald-400 text-center">Graduation Complete</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold text-emerald-400">{prnIssued} PRN</p>
                <p className="text-xs text-emerald-400/80">Issued (Slow, Capped)</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-orange-400">
                  <Flame className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold text-orange-400">{ptnBurned} PTN</p>
                <p className="text-xs text-orange-400/80">Burned/Frozen</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {graduationStatus === "idle" && (
            <Button onClick={runSimulation} className="flex-1">
              <Clock className="w-4 h-4 mr-2" />
              Start Epoch Tracking
            </Button>
          )}
          {graduationStatus === "eligible" && (
            <Button onClick={executeGraduation} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <GraduationCap className="w-4 h-4 mr-2" />
              Execute Graduation
            </Button>
          )}
          {(graduationStatus === "graduated" || (!isSimulating && epochs.length > 0)) && (
            <Button variant="outline" onClick={reset} className="flex-1 bg-transparent">
              Reset
            </Button>
          )}
          {isSimulating && (
            <Button disabled className="flex-1">
              <Clock className="w-4 h-4 mr-2 animate-pulse" />
              Tracking...
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground p-3 bg-secondary/30 rounded-lg">
          PRN issuance is slow, capped, and non-user-triggered. Graduation requires sustained stability across multiple
          epochs. This is not a yield mechanism.
        </div>
      </CardContent>
    </Card>
  )
}
