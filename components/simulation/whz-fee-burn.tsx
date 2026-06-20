"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Flame, Vault, Calculator, Info } from "lucide-react"

interface FeeCalculation {
  baseFee: number
  velocity: number
  riskFactor: number
  utilization: number
  totalFee: number
  burned: number
  treasury: number
}

export function WhzFeeBurnSimulation() {
  const [inputs, setInputs] = useState({
    baseFee: 0.01, // B: base fee coefficient
    velocity: 1000, // V: transaction velocity (notional)
    riskFactor: 1.2, // R: risk adjustment factor
    utilization: 0.75, // U: system utilization (0-1)
  })

  const [result, setResult] = useState<FeeCalculation | null>(null)
  const [history, setHistory] = useState<{ burned: number; treasury: number }[]>([])

  // WHZ friction function: WHZ_fee = B × V × R × log(1 + U)
  const calculateFee = useCallback(() => {
    const { baseFee, velocity, riskFactor, utilization } = inputs
    const totalFee = baseFee * velocity * riskFactor * Math.log(1 + utilization)
    const burned = totalFee * 0.7 // 70% burned
    const treasury = totalFee * 0.3 // 30% to SYSTEM_TREASURY

    const calculation: FeeCalculation = {
      baseFee,
      velocity,
      riskFactor,
      utilization,
      totalFee,
      burned,
      treasury,
    }

    setResult(calculation)
    setHistory((prev) => [...prev.slice(-9), { burned, treasury }])
  }, [inputs])

  const totalBurned = history.reduce((sum, h) => sum + h.burned, 0)
  const totalTreasury = history.reduce((sum, h) => sum + h.treasury, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            WHZ Fee-Burn Simulation
          </CardTitle>
          <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
            Friction Model
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-mono">WHZ_fee = B × V × R × log(1 + U)</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Parameters */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">B (Base Fee)</Label>
            <Input
              type="number"
              step="0.001"
              value={inputs.baseFee}
              onChange={(e) => setInputs((p) => ({ ...p, baseFee: Number.parseFloat(e.target.value) || 0 }))}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">V (Velocity)</Label>
            <Input
              type="number"
              value={inputs.velocity}
              onChange={(e) => setInputs((p) => ({ ...p, velocity: Number.parseFloat(e.target.value) || 0 }))}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">R (Risk Factor)</Label>
            <Input
              type="number"
              step="0.1"
              value={inputs.riskFactor}
              onChange={(e) => setInputs((p) => ({ ...p, riskFactor: Number.parseFloat(e.target.value) || 0 }))}
              className="bg-secondary/50 border-border"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">U (Utilization 0-1)</Label>
            <Input
              type="number"
              step="0.05"
              min="0"
              max="1"
              value={inputs.utilization}
              onChange={(e) => setInputs((p) => ({ ...p, utilization: Number.parseFloat(e.target.value) || 0 }))}
              className="bg-secondary/50 border-border"
            />
          </div>
        </div>

        <Button onClick={calculateFee} className="w-full">
          <Calculator className="w-4 h-4 mr-2" />
          Calculate WHZ Fee
        </Button>

        {/* Result Display */}
        {result && (
          <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total WHZ Fee</span>
              <span className="font-mono font-bold text-foreground">{result.totalFee.toFixed(4)} WHZ</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                <Flame className="w-4 h-4 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-orange-400">{result.burned.toFixed(4)}</p>
                <p className="text-xs text-orange-400/80">70% Burned</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <Vault className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-primary">{result.treasury.toFixed(4)}</p>
                <p className="text-xs text-primary/80">30% Treasury</p>
              </div>
            </div>
          </div>
        )}

        {/* Historical Totals */}
        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Session Totals (Simulation)</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded bg-secondary/30">
              <p className="text-sm font-mono font-bold text-foreground">{(totalBurned + totalTreasury).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total WHZ</p>
            </div>
            <div className="p-2 rounded bg-orange-500/10">
              <p className="text-sm font-mono font-bold text-orange-400">{totalBurned.toFixed(2)}</p>
              <p className="text-xs text-orange-400/80">Burned</p>
            </div>
            <div className="p-2 rounded bg-primary/10">
              <p className="text-sm font-mono font-bold text-primary">{totalTreasury.toFixed(2)}</p>
              <p className="text-xs text-primary/80">Treasury</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-start gap-2 p-3 bg-secondary/30 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Burned WHZ is permanently removed from circulation. Treasury WHZ is non-circulating system reserve. This is
            not a speculative mechanism.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
