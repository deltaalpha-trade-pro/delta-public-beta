"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowUpRight, ArrowDownLeft, Minus } from "lucide-react"

interface LedgerEntry {
  id: string
  timestamp: string
  type: "CREDIT" | "DEBIT" | "ESCROW_HOLD" | "ESCROW_RELEASE"
  asset: "PTN" | "PRN" | "WHZ"
  amount: number
  counterparty: string
  memo: string
  status: "FINALIZED" | "PENDING" | "BRIDGING"
}

export function LedgerEntries() {
  // Simulated ledger entries
  const entries: LedgerEntry[] = [
    {
      id: "LE-001",
      timestamp: "2024-12-19T14:30:00Z",
      type: "CREDIT",
      asset: "PTN",
      amount: 1250,
      counterparty: "SYSTEM",
      memo: "Beta allocation credit",
      status: "FINALIZED",
    },
    {
      id: "LE-002",
      timestamp: "2024-12-19T14:25:00Z",
      type: "ESCROW_HOLD",
      asset: "PRN",
      amount: 500,
      counterparty: "ESCROW-BRIDGE-01",
      memo: "Cross-chain bridge escrow",
      status: "BRIDGING",
    },
    {
      id: "LE-003",
      timestamp: "2024-12-19T14:20:00Z",
      type: "DEBIT",
      asset: "PTN",
      amount: 200,
      counterparty: "WHL-0087",
      memo: "Settlement transfer",
      status: "FINALIZED",
    },
    {
      id: "LE-004",
      timestamp: "2024-12-19T14:15:00Z",
      type: "CREDIT",
      asset: "PRN",
      amount: 875,
      counterparty: "CONVERSION",
      memo: "PTN → PRN conversion",
      status: "FINALIZED",
    },
    {
      id: "LE-005",
      timestamp: "2024-12-19T14:10:00Z",
      type: "ESCROW_RELEASE",
      asset: "PRN",
      amount: 300,
      counterparty: "ESCROW-SETTLE-04",
      memo: "Bridge finalized - escrow released",
      status: "FINALIZED",
    },
  ]

  const getTypeIcon = (type: LedgerEntry["type"]) => {
    switch (type) {
      case "CREDIT":
        return <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
      case "DEBIT":
        return <ArrowUpRight className="w-3 h-3 text-red-400" />
      case "ESCROW_HOLD":
        return <Minus className="w-3 h-3 text-amber-400" />
      case "ESCROW_RELEASE":
        return <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
    }
  }

  const getTypeLabel = (type: LedgerEntry["type"]) => {
    switch (type) {
      case "CREDIT":
        return "Credit"
      case "DEBIT":
        return "Debit"
      case "ESCROW_HOLD":
        return "Escrow Hold"
      case "ESCROW_RELEASE":
        return "Escrow Release"
    }
  }

  const getStatusBadge = (status: LedgerEntry["status"]) => {
    switch (status) {
      case "FINALIZED":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
            Finalized
          </Badge>
        )
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">
            Pending
          </Badge>
        )
      case "BRIDGING":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-[10px]">
            Bridging
          </Badge>
        )
    }
  }

  const getAssetColor = (asset: LedgerEntry["asset"]) => {
    switch (asset) {
      case "PTN":
        return "text-blue-400"
      case "PRN":
        return "text-emerald-400"
      case "WHZ":
        return "text-amber-400"
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Ledger Entries
        </CardTitle>
        <p className="text-xs text-muted-foreground">Double-entry accounting records. Every credit has a debit.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                  {getTypeIcon(entry.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{getTypeLabel(entry.type)}</span>
                    {getStatusBadge(entry.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{entry.memo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-mono font-medium ${getAssetColor(entry.asset)}`}>
                  {entry.type === "DEBIT" || entry.type === "ESCROW_HOLD" ? "-" : "+"}
                  {entry.amount.toLocaleString()} {entry.asset}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border text-center">
          Showing simulated ledger entries for structural demonstration
        </p>
      </CardContent>
    </Card>
  )
}
