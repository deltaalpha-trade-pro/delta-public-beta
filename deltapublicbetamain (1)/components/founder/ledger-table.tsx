"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react"

interface Transaction {
  id: string
  type: "allocation" | "transfer" | "rebalance"
  token: "PTN" | "PRN" | "WHZ"
  amount: string
  from: string
  to: string
  timestamp: string
  status: "completed" | "pending"
}

const transactions: Transaction[] = [
  {
    id: "TXN-001",
    type: "allocation",
    token: "PTN",
    amount: "1,000,000",
    from: "Genesis Reserve",
    to: "Development Fund",
    timestamp: "2024-01-15 09:32:14",
    status: "completed",
  },
  {
    id: "TXN-002",
    type: "transfer",
    token: "PRN",
    amount: "250,000",
    from: "Development Fund",
    to: "Operations Pool",
    timestamp: "2024-01-15 11:45:22",
    status: "completed",
  },
  {
    id: "TXN-003",
    type: "rebalance",
    token: "WHZ",
    amount: "50,000",
    from: "Treasury",
    to: "Liquidity Reserve",
    timestamp: "2024-01-15 14:18:45",
    status: "pending",
  },
  {
    id: "TXN-004",
    type: "allocation",
    token: "PTN",
    amount: "500,000",
    from: "Genesis Reserve",
    to: "AI Research Fund",
    timestamp: "2024-01-14 16:22:33",
    status: "completed",
  },
  {
    id: "TXN-005",
    type: "transfer",
    token: "PRN",
    amount: "125,000",
    from: "Operations Pool",
    to: "Founder Allocation",
    timestamp: "2024-01-14 10:08:19",
    status: "completed",
  },
]

const typeIcons = {
  allocation: ArrowDownLeft,
  transfer: ArrowUpRight,
  rebalance: RefreshCw,
}

const tokenColors = {
  PTN: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  PRN: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  WHZ: "bg-amber-500/10 text-amber-400 border-amber-500/30",
}

export function LedgerTable() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Internal Ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-3 px-2">ID</th>
                <th className="text-left py-3 px-2">Type</th>
                <th className="text-left py-3 px-2">Token</th>
                <th className="text-right py-3 px-2">Amount</th>
                <th className="text-left py-3 px-2">From</th>
                <th className="text-left py-3 px-2">To</th>
                <th className="text-left py-3 px-2">Time</th>
                <th className="text-left py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const Icon = typeIcons[tx.type]
                return (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{tx.id}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-3 h-3 text-primary" />
                        <span className="text-sm text-foreground capitalize">{tx.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={tokenColors[tx.token]}>
                        {tx.token}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-mono text-sm text-foreground">{tx.amount}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{tx.from}</td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">{tx.to}</td>
                    <td className="py-3 px-2 text-xs text-muted-foreground">{tx.timestamp}</td>
                    <td className="py-3 px-2">
                      <Badge
                        variant="outline"
                        className={
                          tx.status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
