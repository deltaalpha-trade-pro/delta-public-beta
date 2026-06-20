"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, BarChart3, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"

export function TradingPanel() {
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [side, setSide] = useState<"buy" | "sell">("buy")

  // Simulated market data
  const instruments = [
    { symbol: "BTC/PRN", price: 42850.0, change: 2.4, volume: "1.2M" },
    { symbol: "ETH/PRN", price: 2280.5, change: -0.8, volume: "890K" },
    { symbol: "PTN/PRN", price: 1.0001, change: 0.01, volume: "45M" },
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
      {/* Instrument Selector */}
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
                <span className="font-mono text-sm">{inst.price.toLocaleString()}</span>
                <span className={`flex items-center text-xs ${inst.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {inst.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(inst.change)}%
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price Chart Placeholder */}
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
                    className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground rounded bg-secondary/50 hover:bg-secondary"
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chart visualization */}
            <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Price Chart</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{selectedInstrument.price.toLocaleString()} PRN</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Book */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground text-base">Order Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Asks */}
            <div className="space-y-1">
              {asks.map((ask, i) => (
                <div key={i} className="grid grid-cols-3 text-xs">
                  <span className="text-red-400 font-mono">{ask.price.toFixed(2)}</span>
                  <span className="text-muted-foreground font-mono text-center">{ask.size.toFixed(2)}</span>
                  <span className="text-muted-foreground font-mono text-right">{(ask.total / 1000).toFixed(1)}K</span>
                </div>
              ))}
            </div>

            {/* Spread */}
            <div className="py-2 border-y border-border">
              <div className="text-center">
                <span className="text-lg font-mono font-bold text-foreground">
                  {selectedInstrument.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bids */}
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

      {/* Order Entry */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            Order Entry
            <Badge variant="outline" className="text-[10px] bg-secondary text-muted-foreground">
              <Clock className="w-2.5 h-2.5 mr-1" />
              Settlement Speed Governed by WHZ Bond
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Type & Side */}
            <div className="space-y-4">
              <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "market" | "limit")}>
                <TabsList className="w-full bg-secondary">
                  <TabsTrigger value="market" className="flex-1">
                    Market
                  </TabsTrigger>
                  <TabsTrigger value="limit" className="flex-1">
                    Limit
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={side === "buy" ? "default" : "outline"}
                  className={side === "buy" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  onClick={() => setSide("buy")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Buy
                </Button>
                <Button
                  variant={side === "sell" ? "default" : "outline"}
                  className={side === "sell" ? "bg-red-600 hover:bg-red-700" : ""}
                  onClick={() => setSide("sell")}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Sell
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Amount</Label>
                  <Input placeholder="0.00" className="font-mono bg-secondary border-border" />
                </div>
                {orderType === "limit" && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Limit Price</Label>
                    <Input placeholder="0.00" className="font-mono bg-secondary border-border" />
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border space-y-3">
              <h4 className="text-sm font-medium text-foreground">Order Preview</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instrument</span>
                  <span className="text-foreground font-mono">{selectedInstrument.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Side</span>
                  <span className={side === "buy" ? "text-emerald-400" : "text-red-400"}>{side.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="text-foreground">{orderType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Price</span>
                  <span className="text-foreground font-mono">{selectedInstrument.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground">
                  Trade execution allowed. Settlement speed determined by Settlement Authority.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
