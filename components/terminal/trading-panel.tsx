"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BarChart3, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"

export function TradingPanel() {
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [timeframe, setTimeframe] = useState("1h")

  // Synthetic practice instruments only. Native WHZ/PTN/PRN are not market pairs here.
  const instruments = [
    { symbol: "BTC/USD", quoteCurrency: "USD", price: 42850.0, change: 2.4, volume: "1.2M" },
    { symbol: "ETH/USD", quoteCurrency: "USD", price: 2280.5, change: -0.8, volume: "890K" },
    { symbol: "BTC/USDT", quoteCurrency: "USDT", price: 42850.0, change: 2.4, volume: "1.2M" },
  ]

  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0])

  // Simulated order book
  const asks = [
    { price: 42855.0, size: 0.85, total: 36426.75 },
    { price: 42852.5, size: 1.2, total: 51423.0 },
    { price: 42851.0, size: 0.45, total: 19282.95 },
  ]

  const bids = [
    { price: 42848.0, size: 0.92, total: 39420.16 },
    { price: 42845.5, size: 1.55, total: 66410.53 },
    { price: 42842.0, size: 0.78, total: 33416.76 },
  ]

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-2">
            {instruments.map((inst) => (
              <button
                key={inst.symbol}
                onClick={() => setSelectedInstrument(inst)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${
                  selectedInstrument.symbol === inst.symbol
                    ? "bg-primary/10 border-primary/30 text-foreground"
                    : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="font-medium text-sm">{inst.symbol}</span>
                <span className="font-mono text-sm">{inst.price.toLocaleString()} {inst.quoteCurrency}</span>
                <span className={`flex items-center text-xs ${inst.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {inst.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(inst.change)}%
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 px-1 text-xs text-muted-foreground">Illustrative simulation data — not live market quotes or executable prices.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4 text-primary" />
                {selectedInstrument.symbol}
              </CardTitle>
              <div className="flex items-center gap-2">
                {["1m", "5m", "1h", "1d"].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    aria-pressed={timeframe === tf}
                    className={`px-2 py-1 text-xs rounded transition ${timeframe === tf ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary"}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Simulated Price Chart · {timeframe}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{selectedInstrument.price.toLocaleString()} {selectedInstrument.quoteCurrency}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground text-base">Demo Order Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              {asks.map((ask, i) => (
                <div key={i} className="grid grid-cols-3 text-xs">
                  <span className="text-red-400 font-mono">{ask.price.toFixed(2)}</span>
                  <span className="text-muted-foreground font-mono text-center">{ask.size.toFixed(2)}</span>
                  <span className="text-muted-foreground font-mono text-right">{(ask.total / 1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>
            <div className="py-2 border-y border-border">
              <div className="text-center">
                <span className="text-lg font-mono font-bold text-foreground">{selectedInstrument.price.toLocaleString()} {selectedInstrument.quoteCurrency}</span>
              </div>
            </div>
            <div className="space-y-1">
              {bids.map((bid, i) => (
                <div key={i} className="grid grid-cols-3 text-xs">
                  <span className="text-emerald-400 font-mono">{bid.price.toFixed(2)}</span>
                  <span className="text-muted-foreground font-mono text-center">{bid.size.toFixed(2)}</span>
                  <span className="text-muted-foreground font-mono text-right">{(bid.total / 1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            Demo Order Entry
            <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground">
              <Clock className="w-2.5 h-2.5 mr-1" />
              Synthetic settlement simulation
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "market" | "limit")}>
                <TabsList className="w-full bg-secondary">
                  <TabsTrigger value="market" className="flex-1">Market</TabsTrigger>
                  <TabsTrigger value="limit" className="flex-1">Limit</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => setSide("buy")} variant={side === "buy" ? "default" : "outline"} className="flex-1">Buy</Button>
                <Button onClick={() => setSide("sell")} variant={side === "sell" ? "default" : "outline"} className="flex-1">Sell</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-amount">Amount</Label>
                <Input id="order-amount" type="number" min="0" step="any" placeholder="0.00" />
              </div>
              <Button className="w-full" disabled>Place simulated order — backend integration pending</Button>
              <p className="text-xs text-muted-foreground">Orders are not sent to an exchange or settlement provider from this public terminal.</p>
            </div>
            <div className="rounded-xl border border-border bg-secondary/30 p-4 text-sm">
              <p className="font-medium text-foreground">Selected practice mode</p>
              <p className="mt-2 text-muted-foreground">{side === "buy" ? "Buy" : "Sell"} · {orderType === "market" ? "Market" : "Limit"} · {selectedInstrument.symbol}</p>
              <p className="mt-3 text-xs text-muted-foreground">This is a simulated order ticket. It does not create a real trade.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
