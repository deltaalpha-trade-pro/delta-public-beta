"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scale, Play, CheckCircle, Clock, AlertTriangle } from "lucide-react"

type SimulationStep = {
  label: string
  status: "pending" | "active" | "complete" | "failed"
}

export function SettlementSimulator() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [steps, setSteps] = useState<SimulationStep[]>([
    { label: "Validate WHZ bond requirement", status: "pending" },
    { label: "Create escrow hold", status: "pending" },
    { label: "Execute pre-settlement", status: "pending" },
    { label: "Await finality confirmation", status: "pending" },
    { label: "Release escrow / finalize", status: "pending" },
  ])

  const runSimulation = () => {
    setIsRunning(true)
    setCurrentStep(0)

    const runStep = (index: number) => {
      if (index >= steps.length) {
        setIsRunning(false)
        return
      }

      setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, status: "active" } : s)))

      setTimeout(() => {
        setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, status: "complete" } : s)))
        setCurrentStep(index + 1)
        runStep(index + 1)
      }, 1000)
    }

    runStep(0)
  }

  const reset = () => {
    setIsRunning(false)
    setCurrentStep(-1)
    setSteps(steps.map((s) => ({ ...s, status: "pending" })))
  }

  const getStepIcon = (status: SimulationStep["status"]) => {
    switch (status) {
      case "pending":
        return <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
      case "active":
        return <Clock className="w-3 h-3 text-primary animate-pulse" />
      case "complete":
        return <CheckCircle className="w-3 h-3 text-emerald-400" />
      case "failed":
        return <AlertTriangle className="w-3 h-3 text-red-400" />
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Scale className="w-5 h-5 text-primary" />
          Settlement Flow
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Simulate the complete settlement lifecycle from bond validation to finality
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                step.status === "active"
                  ? "bg-primary/10 border border-primary/20"
                  : step.status === "complete"
                    ? "bg-emerald-500/5"
                    : "bg-secondary/30"
              }`}
            >
              {getStepIcon(step.status)}
              <span
                className={`text-sm ${
                  step.status === "complete"
                    ? "text-foreground"
                    : step.status === "active"
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
              {step.status === "active" && (
                <Badge variant="outline" className="ml-auto bg-primary/10 text-primary border-primary/30 text-[10px]">
                  Processing
                </Badge>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={runSimulation} disabled={isRunning} className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Run Simulation
          </Button>
          <Button variant="outline" onClick={reset} disabled={isRunning} className="bg-transparent">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
