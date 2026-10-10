"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, ArrowRight, Shield } from "lucide-react"

export function ExposureCalculator() {
  const [amount, setAmount] = useState("")
  const [coverageRatio, setCoverageRatio] = useState("10")
  const [result, setResult] = useState<{
    obligationAmount: number
    coverageRatio: number
    illustrativeCoverage: number
  } | null>(null)

  const calculate = () => {
    const obligationAmount = Number.parseFloat(amount)
    const ratio = Number.parseFloat(coverageRatio)
    if (!Number.isFinite(obligationAmount) || obligationAmount <= 0 || !Number.isFinite(ratio)) {
      setResult(null)
      return
    }

    setResult({
      obligationAmount,
      coverageRatio: ratio,
      illustrativeCoverage: obligationAmount * ratio / 100,
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Illustrative Coverage Calculator
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Model a hypothetical coverage ratio. This tool does not read account balances or determine settlement eligibility.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Illustrative Coverage Ratio</Label>
              <Select value={coverageRatio} onValueChange={setCoverageRatio}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="10">10% scenario</SelectItem>
                  <SelectItem value="20">20% scenario</SelectItem>
                  <SelectItem value="30">30% scenario</SelectItem>
                  <SelectItem value="40">40% scenario</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Hypothetical Obligation Amount</Label>
              <Input
                type="number"
                min="0"
                step="any"
                placeholder="Enter a scenario amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <Button onClick={calculate} disabled={!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0} className="w-full">
              Calculate Illustration
            </Button>
          </div>

          <div className="space-y-4">
            {result ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scenario Output</span>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    Illustrative only
                  </Badge>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Hypothetical Obligation</span>
                    <span className="font-mono text-foreground">{result.obligationAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">Selected Coverage Ratio</span>
                    <span className="font-mono text-foreground">{result.coverageRatio}%</span>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Illustrative Coverage
                    </span>
                    <span className="font-mono text-foreground font-medium">{result.illustrativeCoverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-6 rounded-lg bg-secondary/30 border border-dashed border-border">
                <p className="text-sm text-muted-foreground text-center">
                  Enter a hypothetical amount and select a ratio to calculate an illustration.
                </p>
              </div>
            )}
          </div>
        </div>
        <p className="mt-5 text-xs leading-6 text-muted-foreground border-t border-border pt-4">
          This illustration does not represent assets held, verify collateral, determine account eligibility, or authorize a transfer. Actual requirements must come from an approved and verified service.
        </p>
      </CardContent>
    </Card>
  )
}
