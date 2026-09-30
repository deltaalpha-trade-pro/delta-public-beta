"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, LockKeyhole, RotateCcw, ShieldCheck, Vault } from "lucide-react"
import { advanceEscrow, createEscrowSimulation, escrowProgress, refundEscrow, type EscrowSimulation } from "@/lib/whalez-ai/engines/escrow-engine"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EscrowDashboard() {
  const [escrow, setEscrow] = useState<EscrowSimulation>(() => createEscrowSimulation())
  const progress = escrowProgress(escrow)
  const statusLabel = useMemo(() => ({
    CREATED: "Created", BOND_CHECKED: "WHZ Bond Checked", HELD: "Held", PRE_SETTLEMENT: "Pre-Settlement",
    FINALITY_WAIT: "Awaiting Finality", RELEASED: "Released", REFUNDED: "Refunded", FAILED: "Failed",
  } as Record<EscrowSimulation["stage"], string>)[escrow.stage], [escrow.stage])
  const terminal = ["RELEASED", "REFUNDED", "FAILED"].includes(escrow.stage)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Escrow Asset</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{escrow.amount.toLocaleString()} {escrow.asset}</div><p className="mt-1 text-xs text-muted-foreground">Synthetic value</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">WHZ Bond</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{escrow.whzBondRequired.toLocaleString()} WHZ</div><p className="mt-1 text-xs text-muted-foreground">Simulated requirement</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Stage</CardTitle></CardHeader><CardContent><Badge variant="outline">{statusLabel}</Badge><p className="mt-2 text-xs text-muted-foreground">{progress}% simulated progress</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Counterparty</CardTitle></CardHeader><CardContent><div className="font-medium">{escrow.counterparty}</div><p className="mt-1 text-xs text-muted-foreground">{escrow.type} flow</p></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Vault className="h-5 w-5 text-primary" />Escrow Lifecycle</CardTitle><p className="text-sm text-muted-foreground">WHZ is represented as the platform settlement-bond concept; this page does not claim custody, reserve, or chain finality.</p></CardHeader><CardContent className="space-y-5">
        <div className="h-3 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all" style={{ width: progress + "%" }} /></div>
        <div className="grid gap-3 md:grid-cols-3">{["CREATED","BOND_CHECKED","HELD","PRE_SETTLEMENT","FINALITY_WAIT","RELEASED"].map((stage, index) => <div key={stage} className={"rounded-xl border p-4 " + (index <= escrow.stepIndex ? "border-primary/40 bg-primary/5" : "border-border bg-secondary/20")}><div className="text-xs uppercase tracking-wider text-muted-foreground">Step {index + 1}</div><div className="mt-1 text-sm font-medium">{stage.replaceAll("_", " ")}</div></div>)}</div>
        <div className="flex flex-wrap gap-3"><Button onClick={() => setEscrow((current) => advanceEscrow(current))} disabled={terminal}><ArrowRight className="mr-2 h-4 w-4" />Advance Simulation</Button><Button variant="outline" onClick={() => setEscrow((current) => refundEscrow(current))} disabled={terminal}>Simulate Refund</Button><Button variant="outline" onClick={() => setEscrow(createEscrowSimulation())}><RotateCcw className="mr-2 h-4 w-4" />New Escrow</Button></div>
      </CardContent></Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5 text-primary" />Settlement Bond Relationship</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p>The simulation preserves the DeltaAlpha relationship: an escrow flow can include a WHZ settlement-bond requirement while the transaction asset and external provider rails remain separate.</p><p>WhalezChain remains the native-state/provenance rail; external custody or settlement is never fabricated.</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" />Execution Boundary</CardTitle></CardHeader><CardContent className="space-y-3 text-sm text-muted-foreground"><p>No funds move. No counterparty is contacted. No custody account is touched. No external settlement is initiated.</p><Link href="/escrow/terminal" className="inline-flex items-center text-primary hover:underline">Open Escrow Terminal <ArrowRight className="ml-1 h-4 w-4" /></Link></CardContent></Card>
      </div>
    </div>
  )
}