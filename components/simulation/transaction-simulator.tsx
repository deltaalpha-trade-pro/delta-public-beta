"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Calculator, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface ExposureCalculation {
  transactionAmount: number
  exposureMultiplier: number
  calculatedExposure: number
  requiredWhz: number
  lockedWhz: number
  preSettlementAllowed: boolean
}

export function TransactionSimulator() {
  const [amount, setAmount] = useState("")
  const [assetType, setAssetType] = useState("PTN")
  const [calculation, setCalculation] = useState<ExposureCalculation | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Simulated account state
  const accountLockedWhz = 50
  const exposureMultiplier = 0.1 // 10% exposure requirement

  const calculateExposure = () => {
    setIsCalculating(true)

    // Simulate calculation delay
    setTimeout(() => {
      const txAmount = Number.parseFloat(amount) || 0
      const calculatedExposure = txAmount * exposureMultiplier
      const requiredWhz = Math.ceil(calculatedExposure)

      setCalculation({
        transactionAmount: txAmount,
        exposureMultiplier,
        calculatedExposure,
        requiredWhz,
        lockedWhz: accountLockedWhz,
        preSettlementAllowed: accountLockedWhz >= requiredWhz,
      })
      setIsCalculating(false)
    }, 500)
  }

  const resetSimulation = () => {
    setAmount("")
    setCalculation(null)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Transaction Simulation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Simulate a transaction to see exposure calculation and pre-settlement eligibility
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Asset Type</Label>
              <Select value={assetType} onValueChange={setAssetType}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="PTN">PTN (Potential)</SelectItem>
                  <SelectItem value="PRN">PRN (Proven)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Amount</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <Button onClick={calculateExposure} disabled={!amount || isCalculating} className="w-full">
            {isCalculating ? "Calculating..." : "Calculate Exposure"}
          </Button>
        </div>

        {/* Results Section */}
        {calculation && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Exposure Calculation</span>
              <Badge
                variant="outline"
                className={
                  calculation.preSettlementAllowed
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    : "bg-red-500/10 text-red-400 border-red-500/30"
                }
              >
                {calculation.preSettlementAllowed ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" /> Pre-Settlement Allowed
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 mr-1" /> Pre-Settlement Denied
                  </>
                )}
              </Badge>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transaction Amount</span>
                <span className="text-foreground font-mono">
                  {calculation.transactionAmount.toLocaleString()} {assetType}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Exposure Multiplier</span>
                <span className="text-foreground font-mono">{calculation.exposureMultiplier * 100}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center py-2">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Calculated Exposure</span>
                <span className="text-foreground font-mono">{calculation.calculatedExposure.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">WHZ Required</span>
                <span className="text-amber-400 font-mono font-medium">{calculation.requiredWhz} WHZ</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Locked WHZ</span>
                <span className="text-foreground font-mono">{calculation.lockedWhz} WHZ</span>
              </div>
            </div>

            {!calculation.preSettlementAllowed && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-400">
                  Insufficient WHZ locked. You need {calculation.requiredWhz - calculation.lockedWhz} more WHZ locked to
                  enable pre-settlement for this transaction.
                </p>
              </div>
            )}

            <Button variant="outline" onClick={resetSimulation} className="w-full bg-transparent">
              Reset Simulation
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          This simulation demonstrates the WHZ exposure model. WHZ is locked as a bond for pre-finality settlement, not
          spent as a fee. If finality fails, locked WHZ may be slashed.
        </p>
      </CardContent>
    </Card>
  )
}
