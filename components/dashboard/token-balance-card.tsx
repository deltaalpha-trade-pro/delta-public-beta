"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TokenBalanceCardProps {
  token: string
  symbol: string
  balance: string
  value: string
  change: number
  color: string
}

export function TokenBalanceCard({ token, symbol, balance, value, change, color }: TokenBalanceCardProps) {
  const isPositive = change >= 0

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          {token}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{balance}</p>
            <p className="text-xs text-muted-foreground">{symbol}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{value}</p>
            <div className={`flex items-center gap-1 text-xs ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {isPositive ? "+" : ""}
              {change}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
