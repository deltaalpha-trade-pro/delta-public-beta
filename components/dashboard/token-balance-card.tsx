"use client"

import Image from "next/image"
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

const assetIcons: Record<string, { src: string; alt: string }> = {
  WHZ: { src: "/whz-icon.svg", alt: "WHZ · Whalez-Mint" },
  PTN: { src: "/ptn-icon.svg", alt: "PTN · Plutonium" },
  PRN: { src: "/prn-icon.svg", alt: "PRN · Plutoranium" },
}

export function TokenBalanceCard({ token, symbol, balance, value, change }: TokenBalanceCardProps) {
  const isPositive = change >= 0
  const icon = assetIcons[symbol.toUpperCase()]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {icon ? (
            <Image src={icon.src} alt={icon.alt} width={28} height={28} className="h-7 w-7 rounded-lg object-contain" />
          ) : (
            <span className="w-3 h-3 rounded-full" aria-hidden="true" />
          )}
          <span>{token}</span>
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
