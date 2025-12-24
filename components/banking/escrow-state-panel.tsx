"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vault, Clock, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react"

interface EscrowState {
  id: string
  type: "BRIDGE" | "SETTLEMENT" | "CONVERSION"
  asset: string
  amount: number
  status: "HELD" | "RELEASING" | "FINALIZED" | "FAILED"
  counterparty: string
  expiresAt?: string
  progress?: number
}

export function EscrowStatePanel() {
  // Simulated escrow states
  const escrowStates: EscrowState[] = [
    {
      id: "ESC-001",
      type: "BRIDGE",
      asset: "PRN",
      amount: 500,
      status: "HELD",
      counterparty: "External Chain Bridge",
      expiresAt: "2024-12-19T18:00:00Z",
      progress: 65,
    },
    {
      id: "ESC-002",
      type: "SETTLEMENT",
      asset: "PTN",
      amount: 1200,
      status: "RELEASING",
      counterparty: "WHL-0087",
      progress: 90,
    },
    {
      id: "ESC-003",
      type: "CONVERSION",
      asset: "PTN",
      amount: 2000,
      status: "FINALIZED",
      counterparty: "PRN Conversion Pool",
    },
  ]

  const getStatusIcon = (status: EscrowState["status"]) => {
    switch (status) {
      case "HELD":
        return <Clock className="w-4 h-4 text-amber-400" />
      case "RELEASING":
        return <ArrowRight className="w-4 h-4 text-primary" />
      case "FINALIZED":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case "FAILED":
        return <AlertTriangle className="w-4 h-4 text-red-400" />
    }
  }

  const getStatusBadge = (status: EscrowState["status"]) => {
    switch (status) {
      case "HELD":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
            Held in Escrow
          </Badge>
        )
      case "RELEASING":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            Releasing
          </Badge>
        )
      case "FINALIZED":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            Finalized
          </Badge>
        )
      case "FAILED":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
            Failed
          </Badge>
        )
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2">
          <Vault className="w-5 h-5 text-primary" />
          Escrow & Bridge States
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Active escrow holds and cross-system bridge operations. Assets are held until finality is confirmed.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {escrowStates.map((escrow) => (
          <div key={escrow.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(escrow.status)}
                <span className="text-sm font-medium text-foreground">{escrow.type}</span>
                <span className="text-xs text-muted-foreground">#{escrow.id}</span>
              </div>
              {getStatusBadge(escrow.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Amount</p>
                <p className="text-sm font-mono text-foreground">
                  {escrow.amount.toLocaleString()} {escrow.asset}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Counterparty</p>
                <p className="text-sm text-foreground truncate">{escrow.counterparty}</p>
              </div>
            </div>

            {escrow.progress !== undefined && escrow.status !== "FINALIZED" && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{escrow.progress}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      escrow.status === "FAILED" ? "bg-red-500" : "bg-primary"
                    }`}
                    style={{ width: `${escrow.progress}%` }}
                  />
                </div>
              </div>
            )}

            {escrow.expiresAt && escrow.status === "HELD" && (
              <p className="text-xs text-muted-foreground mt-2">
                Expires:{" "}
                {new Date(escrow.expiresAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        ))}

        <p className="text-xs text-muted-foreground pt-3 border-t border-border text-center">
          Escrow ensures atomic settlement. If bridge fails, escrowed assets return; WHZ may be slashed per exposure.
        </p>
      </CardContent>
    </Card>
  )
}
