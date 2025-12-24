"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, ArrowRight, CheckCircle, XCircle, Shield } from "lucide-react"

export function ExposureCalculator() {
  const [amount, setAmount] = useState("")
  const [asset, setAsset] = useState("PTN")
  const [result, setResult] = useState<{
    exposure: number
    whzRequired: number
    whzLocked: number
    eligible: boolean
  } | null>(null)

  const userWhzLocked = 50

  const calculate = () => {
    const txAmount = Number.parseFloat(amount) || 0
    const exposureRate = asset === "PTN" ? 0.1 : 0.15 // 10% for PTN, 15% for PRN
    const exposure = txAmount * exposureRate
    const whzRequired = Math.ceil(exposure)

    setResult({
      exposure,
      whzRequired,
      whzLocked: userWhzLocked,
      eligible: userWhzLocked >= whzRequired,
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Exposure Calculator
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Calculate WHZ bond requirement for pre-finality settlement eligibility
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Asset Type</Label>
              <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="PTN">PTN (Potential Token)</SelectItem>
                  <SelectItem value="PRN">PRN (Proven Token)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Settlement Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <Button onClick={calculate} disabled={!amount} className="w-full">
              Calculate Exposure
            </Button>
          </div>

          {/* Result */}
          <div className="space-y-4">
            {result ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pre-Settlement Status</span>
                  <Badge
                    variant="outline"
                    className={
                      result.eligible
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    }
                  >
                    {result.eligible ? (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" /> Eligible
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 mr-1" /> Ineligible
                      </>
                    )}
                  </Badge>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Settlement Amount</span>
                    <span className="font-mono text-foreground">
                      {Number.parseFloat(amount).toLocaleString()} {asset}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Calculated Exposure</span>
                    <span className="font-mono text-foreground">{result.exposure.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Shield className="w-3 h-3" /> WHZ Required
                    </span>
                    <span className="font-mono text-amber-400 font-medium">{result.whzRequired} WHZ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Locked WHZ</span>
                    <span className="font-mono text-foreground">{result.whzLocked} WHZ</span>
                  </div>
                </div>

                {!result.eligible && (
                  <p className="text-xs text-red-400">
                    Lock {result.whzRequired - result.whzLocked} more WHZ to enable pre-settlement for this amount.
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-6 rounded-lg bg-secondary/30 border border-dashed border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Enter an amount to calculate WHZ bond requirement
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
