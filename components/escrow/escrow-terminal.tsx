"use client"

import { useMemo, useState } from "react"
import { ArrowDownToLine, ArrowUpRight, CheckCircle2, CircleAlert, ShieldCheck, Vault } from "lucide-react"
import { advanceEscrow, createEscrowSimulation, escrowProgress, failEscrow, refundEscrow, type EscrowSimulation } from "@/lib/whalez-ai/engines/escrow-engine"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EscrowTerminal() {
  const [escrow, setEscrow] = useState<EscrowSimulation>(() => createEscrowSimulation({ type: "TRADE", asset: "PTN", amount: 2500, counterparty: "Demo Buyer" }))
  const progress = escrowProgress(escrow)
  const steps = useMemo(() => [
    { label: "Validate WHZ bond requirement", done: escrow.stepIndex >= 1 },
    { label: "Create escrow hold", done: escrow.stepIndex >= 2 },
    { label: "Prepare external settlement", done: escrow.stepIndex >= 3 },
    { label: "Await finality confirmation", done: escrow.stepIndex >= 4 },
    { label: "Release or refund", done: escrow.stage === "RELEASED" || escrow.stage === "REFUNDED" },
  ], [escrow])
  const terminal = ["RELEASED", "REFUNDED", "FAILED"].includes(escrow.stage)

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Vault className="h-5 w-5 text-primary" />Escrow Coordination Terminal</CardTitle><p className="text-sm text-muted-foreground">Prepare, observe, and simulate a settlement lifecycle under the Whalez-AI capability model.</p></CardHeader><CardContent className="space-y-4">
        {steps.map((step, index) => <div key={step.label} className={"flex items-center gap-3 rounded-xl border p-4 " + (step.done ? "border-primary/40 bg-primary/5" : "border-border bg-secondary/20")}>{step.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <div className="h-4 w-4 rounded-full border border-muted-foreground/40" />}<div className="flex-1"><div className="text-sm font-medium">{step.label}</div><div className="text-xs text-muted-foreground">Step {index + 1}</div></div>{index === escrow.stepIndex && !terminal && <Badge variant="outline">Current</Badge>}</div>)}
        <div className="rounded-xl border border-border bg-secondary/30 p-4"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wider text-muted-foreground">Simulation progress</span><span className="font-mono text-sm">{progress}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-background"><div className="h-full rounded-full bg-primary transition-all" style={{ width: progress + "%" }} /></div></div>
        <div className="flex flex-wrap gap-3"><Button onClick={() => setEscrow((current) => advanceEscrow(current))} disabled={terminal}><ArrowUpRight className="mr-2 h-4 w-4" />Advance</Button><Button variant="outline" onClick={() => setEscrow((current) => refundEscrow(current))} disabled={terminal}><ArrowDownToLine className="mr-2 h-4 w-4" />Refund</Button><Button variant="outline" onClick={() => setEscrow((current) => failEscrow(current))} disabled={terminal}><CircleAlert className="mr-2 h-4 w-4" />Trigger Safety Stop</Button></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Whalez-AI Control Boundary</CardTitle></CardHeader><CardContent className="space-y-4 text-sm text-muted-foreground"><p>Escrow coordination is a delegated capability of Whalez-AI. It is not a separate AI identity and it does not self-authorize transactions.</p><div className="rounded-xl border border-border bg-secondary/20 p-4"><div className="text-xs uppercase tracking-wider">Current mode</div><div className="mt-2 font-medium text-foreground">SIMULATION ONLY</div></div><div className="space-y-2"><p>✓ WHZ settlement-bond relationship represented</p><p>✓ Asset / provider rail separation preserved</p><p>✓ Release and refund paths modeled</p><p>✓ Failure / safety-stop path modeled</p><p>✕ No external settlement call</p></div></CardContent></Card>
    </div>
  )
}