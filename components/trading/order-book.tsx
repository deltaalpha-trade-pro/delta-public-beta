"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Order {
  price: string
  amount: string
  total: string
}

const bids: Order[] = [
  { price: "1.3680", amount: "12,500", total: "17,100" },
  { price: "1.3675", amount: "8,200", total: "11,209" },
  { price: "1.3670", amount: "15,800", total: "21,588" },
  { price: "1.3665", amount: "6,400", total: "8,746" },
  { price: "1.3660", amount: "22,100", total: "30,188" },
]

const asks: Order[] = [
  { price: "1.3720", amount: "9,800", total: "13,446" },
  { price: "1.3725", amount: "14,200", total: "19,490" },
  { price: "1.3730", amount: "7,600", total: "10,435" },
  { price: "1.3735", amount: "18,500", total: "25,410" },
  { price: "1.3740", amount: "11,200", total: "15,389" },
]

export function OrderBook() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-3 text-xs text-muted-foreground pb-2 border-b border-border">
            <span>Price</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sell Orders) */}
          <div className="space-y-1">
            {asks
              .slice()
              .reverse()
              .map((order, i) => (
                <div key={`ask-${i}`} className="grid grid-cols-3 text-sm relative">
                  <div
                    className="absolute inset-0 bg-red-500/10 rounded"
                    style={{
                      width: `${(Number.parseInt(order.amount.replace(/,/g, "")) / 25000) * 100}%`,
                      right: 0,
                      left: "auto",
                    }}
                  />
                  <span className="text-red-400 relative z-10">{order.price}</span>
                  <span className="text-right text-foreground relative z-10">{order.amount}</span>
                  <span className="text-right text-muted-foreground relative z-10">{order.total}</span>
                </div>
              ))}
          </div>

          {/* Spread */}
          <div className="py-2 text-center border-y border-border">
            <span className="text-lg font-bold text-foreground">1.3700</span>
            <span className="text-xs text-muted-foreground ml-2">Spread: 0.29%</span>
          </div>

          {/* Bids (Buy Orders) */}
          <div className="space-y-1">
            {bids.map((order, i) => (
              <div key={`bid-${i}`} className="grid grid-cols-3 text-sm relative">
                <div
                  className="absolute inset-0 bg-emerald-500/10 rounded"
                  style={{
                    width: `${(Number.parseInt(order.amount.replace(/,/g, "")) / 25000) * 100}%`,
                    right: 0,
                    left: "auto",
                  }}
                />
                <span className="text-emerald-400 relative z-10">{order.price}</span>
                <span className="text-right text-foreground relative z-10">{order.amount}</span>
                <span className="text-right text-muted-foreground relative z-10">{order.total}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
