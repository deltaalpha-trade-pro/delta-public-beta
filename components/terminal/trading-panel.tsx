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
  const [timeframe, setTimeframe] = useState("1h")

  // Explicitly illustrative simulation instruments; these are not live market quotes.
  const instruments = [
    { symbol: "BTC/USD", quoteCurrency: "USD", price: 42850.0, change: 2.4, volume: "1.2M" },
    { symbol: "ETH/USD", quoteCurrency: "USD", price: 2280.5, change: -0.8, volume: "890K" },
    { symbol: "BTC/USDT", quoteCurrency: "USDT", price: 42900.0, change: 0.6, volume: "980K" },
  ]

  const [selectedInstrument, setSelectedInstrument] = useState(instruments[0])

  // Illustrative order-book levels scale with the selected instrument.
  const asks = [
    { price: selectedInstrument.price * 1.00012, size: 0.85, total: selectedInstrument.price * 1.00012 * 0.85 },
    { price: selectedInstrument.price * 1.00006, size: 1.2, total: selectedInstrument.price * 1.00006 * 1.2 },
    { price: selectedInstrument.price * 1.00002, size: 0.45, total: selectedInstrument.price * 1.00002 * 0.45 },
  ]

  const bids = [
    { price: selectedInstrument.price * 0.99995, size: 0.92, total: selectedInstrument.price * 0.99995 * 0.92 },
    { price: selectedInstrument.price * 0.99990, size: 1.55, total: selectedInstrument.price * 0.99990 * 1.55 },
    { price: selectedInstrument.price * 0.99985, size: 0.78, total: selectedInstrument.price * 0.99985 * 0.78 },
  ]

  return (
    <div className="space-y-4">
      <div role="note" className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">SIMULATION ONLY</span> · All displayed prices, changes, volumes, and order-book levels are illustrative sample data, not live market quotes or executable market prices.
      </div>
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
            {/* Chart visualization */}
            <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Simulated Price Chart · {timeframe}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{selectedInstrument.price.toLocaleString()} {selectedInstrument.quoteCurrency} · illustrative</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simulated Order Book */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground text-base">Demo Order Book</CardTitle>
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
                  {selectedInstrument.price.toLocaleString()} {selectedInstrument.quoteCurrency}
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

      {/* Demo Order Entry */}
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
                  Demo Buy
                </Button>
                <Button
                  variant={side === "sell" ? "default" : "outline"}
                  className={side === "sell" ? "bg-red-600 hover:bg-red-700" : ""}
                  onClick={() => setSide("sell")}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Demo Sell
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Demo Amount</Label>
                  <Input placeholder="0.00" className="font-mono bg-secondary border-border" />
                </div>
                {orderType === "limit" && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Demo Limit Price</Label>
                    <Input placeholder="0.00" className="font-mono bg-secondary border-border" />
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-secondary/50 rounded-lg border border-border space-y-3">
              <h4 className="text-sm font-medium text-foreground">Demo Order Preview</h4>
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
                  <span className="text-foreground font-mono">{selectedInstrument.price.toLocaleString()} {selectedInstrument.quoteCurrency}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground">
                  Synthetic demo order only. No broker execution, custody, live settlement, or live trading is enabled.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
