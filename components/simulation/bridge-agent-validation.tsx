"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle, Zap, FileCheck } from "lucide-react"

type ValidationStep =
  | "idle"
  | "external_confirmation"
  | "exposure_calculation"
  | "whz_bond_check"
  | "pre_settlement"
  | "finality"
  | "success"
  | "failure"

interface ValidationState {
  step: ValidationStep
  externalConfirmed: boolean | null
  exposureAmount: number
  exposureValid: boolean | null
  whzBondSufficient: boolean | null
  preSettlementApproved: boolean | null
  finalityReached: boolean | null
  whzSlashed: number
  ledgerRecorded: boolean
}

const stepLabels: Record<ValidationStep, string> = {
  idle: "Ready to Validate",
  external_confirmation: "External Confirmation",
  exposure_calculation: "Exposure Calculation",
  whz_bond_check: "WHZ Bond Check",
  pre_settlement: "Pre-Settlement",
  finality: "Finality Resolution",
  success: "Settlement Complete",
  failure: "Settlement Failed",
}

export function BridgeAgentValidation() {
  const [state, setState] = useState<ValidationState>({
    step: "idle",
    externalConfirmed: null,
    exposureAmount: 0,
    exposureValid: null,
    whzBondSufficient: null,
    preSettlementApproved: null,
    finalityReached: null,
    whzSlashed: 0,
    ledgerRecorded: false,
  })

  const [inputs, setInputs] = useState({
    transactionAmount: 5000,
    availableWhz: 100,
    simulateFailure: false,
  })

  const runValidation = useCallback(() => {
    const { transactionAmount, availableWhz, simulateFailure } = inputs
    const exposureRequired = transactionAmount * 0.02 // 2% exposure requirement

    // Step 1: External Confirmation
    setState((s) => ({ ...s, step: "external_confirmation" }))

    setTimeout(() => {
      setState((s) => ({ ...s, externalConfirmed: true, step: "exposure_calculation" }))

      // Step 2: Exposure Calculation
      setTimeout(() => {
        const exposureValid = availableWhz >= exposureRequired
        setState((s) => ({
          ...s,
          exposureAmount: exposureRequired,
          exposureValid,
          step: "whz_bond_check",
        }))

        // Step 3: WHZ Bond Check
        setTimeout(() => {
          const bondSufficient = exposureValid && availableWhz >= exposureRequired
          setState((s) => ({
            ...s,
            whzBondSufficient: bondSufficient,
            step: bondSufficient ? "pre_settlement" : "failure",
          }))

          if (!bondSufficient) {
            // Failed at bond check
            setState((s) => ({
              ...s,
              step: "failure",
              ledgerRecorded: true,
            }))
            return
          }

          // Step 4: Pre-Settlement
          setTimeout(() => {
            setState((s) => ({
              ...s,
              preSettlementApproved: true,
              step: "finality",
            }))

            // Step 5: Finality
            setTimeout(() => {
              const finalitySuccess = !simulateFailure
              if (finalitySuccess) {
                setState((s) => ({
                  ...s,
                  finalityReached: true,
                  step: "success",
                  ledgerRecorded: true,
                }))
              } else {
                // Simulate failure and WHZ slashing
                const slashAmount = Math.ceil(exposureRequired * 0.5) // 50% slash on failure
                setState((s) => ({
                  ...s,
                  finalityReached: false,
                  step: "failure",
                  whzSlashed: slashAmount,
                  ledgerRecorded: true,
                }))
              }
            }, 1200)
          }, 1000)
        }, 1000)
      }, 1000)
    }, 1000)
  }, [inputs])

  const reset = () => {
    setState({
      step: "idle",
      externalConfirmed: null,
      exposureAmount: 0,
      exposureValid: null,
      whzBondSufficient: null,
      preSettlementApproved: null,
      finalityReached: null,
      whzSlashed: 0,
      ledgerRecorded: false,
    })
  }

  const getStepIcon = (step: ValidationStep, current: ValidationStep, result: boolean | null) => {
    const steps: ValidationStep[] = [
      "external_confirmation",
      "exposure_calculation",
      "whz_bond_check",
      "pre_settlement",
      "finality",
    ]
    const stepIndex = steps.indexOf(step)
    const currentIndex = steps.indexOf(current)

    if (current === "success" || current === "failure") {
      if (result === true) return <CheckCircle className="w-4 h-4 text-emerald-400" />
      if (result === false) return <XCircle className="w-4 h-4 text-red-400" />
    }

    if (stepIndex < currentIndex) return <CheckCircle className="w-4 h-4 text-emerald-400" />
    if (stepIndex === currentIndex) return <Clock className="w-4 h-4 text-primary animate-pulse" />
    return <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Bridge Agent Validation
          </CardTitle>
          <Badge
            variant="outline"
            className={
              state.step === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : state.step === "failure"
                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                  : state.step !== "idle"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-secondary text-muted-foreground border-border"
            }
          >
            {stepLabels[state.step]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Inputs */}
        {state.step === "idle" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Transaction Amount</Label>
              <Input
                type="number"
                value={inputs.transactionAmount}
                onChange={(e) => setInputs((p) => ({ ...p, transactionAmount: Number.parseInt(e.target.value) || 0 }))}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Available WHZ</Label>
              <Input
                type="number"
                value={inputs.availableWhz}
                onChange={(e) => setInputs((p) => ({ ...p, availableWhz: Number.parseInt(e.target.value) || 0 }))}
                className="bg-secondary/50 border-border"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.simulateFailure}
                  onChange={(e) => setInputs((p) => ({ ...p, simulateFailure: e.target.checked }))}
                  className="rounded border-border"
                />
                <span className="text-xs text-muted-foreground">Simulate Finality Failure (WHZ Slashing)</span>
              </label>
            </div>
          </div>
        )}

        {/* Validation Flow */}
        {state.step !== "idle" && (
          <div className="space-y-2">
            {/* Step 1: External Confirmation */}
            <div className="flex items-center gap-3 p-2 rounded bg-secondary/30">
              {getStepIcon("external_confirmation", state.step, state.externalConfirmed)}
              <span className="text-sm text-muted-foreground flex-1">External Confirmation</span>
              {state.externalConfirmed && (
                <Badge variant="outline" className="text-xs">
                  Confirmed
                </Badge>
              )}
            </div>

            {/* Step 2: Exposure Calculation */}
            <div className="flex items-center gap-3 p-2 rounded bg-secondary/30">
              {getStepIcon("exposure_calculation", state.step, state.exposureValid)}
              <span className="text-sm text-muted-foreground flex-1">Exposure Calculation</span>
              {state.exposureAmount > 0 && (
                <span className="text-xs font-mono text-foreground">
                  {state.exposureAmount.toFixed(2)} WHZ required
                </span>
              )}
            </div>

            {/* Step 3: WHZ Bond Check */}
            <div className="flex items-center gap-3 p-2 rounded bg-secondary/30">
              {getStepIcon("whz_bond_check", state.step, state.whzBondSufficient)}
              <span className="text-sm text-muted-foreground flex-1">WHZ Bond Check</span>
              {state.whzBondSufficient !== null && (
                <Badge variant="outline" className={state.whzBondSufficient ? "text-emerald-400" : "text-red-400"}>
                  {state.whzBondSufficient ? "Sufficient" : "Insufficient"}
                </Badge>
              )}
            </div>

            {/* Step 4: Pre-Settlement */}
            <div className="flex items-center gap-3 p-2 rounded bg-secondary/30">
              {getStepIcon("pre_settlement", state.step, state.preSettlementApproved)}
              <span className="text-sm text-muted-foreground flex-1">Pre-Settlement</span>
              {state.preSettlementApproved && (
                <Badge variant="outline" className="text-emerald-400">
                  Approved
                </Badge>
              )}
            </div>

            {/* Step 5: Finality */}
            <div className="flex items-center gap-3 p-2 rounded bg-secondary/30">
              {getStepIcon("finality", state.step, state.finalityReached)}
              <span className="text-sm text-muted-foreground flex-1">Finality Resolution</span>
              {state.finalityReached !== null && (
                <Badge variant="outline" className={state.finalityReached ? "text-emerald-400" : "text-red-400"}>
                  {state.finalityReached ? "Success" : "Failed"}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Result Display */}
        {state.step === "success" && (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-400">Settlement Complete</p>
            <p className="text-xs text-emerald-400/80 mt-1">WHZ bond preserved. Ledger recorded.</p>
          </div>
        )}

        {state.step === "failure" && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 space-y-3">
            <div className="text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-red-400">Settlement Failed</p>
            </div>
            {state.whzSlashed > 0 && (
              <div className="flex items-center justify-center gap-2 p-2 bg-red-500/20 rounded">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-mono text-red-400">-{state.whzSlashed} WHZ Slashed</span>
              </div>
            )}
            {state.ledgerRecorded && (
              <p className="text-xs text-red-400/80 text-center">
                <FileCheck className="w-3 h-3 inline mr-1" />
                Failure recorded to ledger
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {state.step === "idle" && (
            <Button onClick={runValidation} className="flex-1">
              <Zap className="w-4 h-4 mr-2" />
              Run Validation
            </Button>
          )}
          {(state.step === "success" || state.step === "failure") && (
            <Button variant="outline" onClick={reset} className="flex-1 bg-transparent">
              Reset Simulation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
