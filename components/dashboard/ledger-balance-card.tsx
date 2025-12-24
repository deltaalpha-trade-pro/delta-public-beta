"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Unlock } from "lucide-react"

interface LedgerBalanceCardProps {
  token: string
  symbol: string
  totalBalance: string
  lockedBalance?: string
  availableBalance?: string
  description: string
  color: string
  showLockStatus?: boolean
}

export function LedgerBalanceCard({
  token,
  symbol,
  totalBalance,
  lockedBalance,
  availableBalance,
  description,
  color,
  showLockStatus = false,
}: LedgerBalanceCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          {token}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-foreground">{totalBalance}</p>
            <p className="text-xs text-muted-foreground">{symbol}</p>
          </div>

          {showLockStatus && lockedBalance && availableBalance && (
            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Lock className="w-3 h-3 text-amber-500" />
                  Locked
                </span>
                <span className="text-foreground font-medium">{lockedBalance}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Unlock className="w-3 h-3 text-emerald-500" />
                  Available
                </span>
                <span className="text-foreground font-medium">{availableBalance}</span>
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground pt-2 border-t border-border">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
