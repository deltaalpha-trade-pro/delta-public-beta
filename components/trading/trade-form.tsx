"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ASSETS = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF", "EUR/GBP", "BTC/USD", "ETH/USD"] as const

type OrderResult = {
  success: boolean
  error?: string
  simulationOnly?: boolean
  asset?: string
  side?: string
  size?: number
  sessionId?: string
  position?: {
    positionId?: string
    entryPrice?: number
  }
  verification?: {
    verified?: boolean
  }
}

export function TradeForm() {
  const [asset, setAsset] = useState<(typeof ASSETS)[number]>("EUR/USD")
  const [amount, setAmount] = useState("")
  const [result, setResult] = useState<OrderResult | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function placeOrder(side: "buy" | "sell") {
    const size = Number.parseFloat(amount)

    if (!Number.isFinite(size) || size <= 0) {
      setResult({ success: false, error: "Enter a valid simulation size greater than zero." })
      return
    }

    setSubmitting(true)
    setResult(null)

    try {
      const response = await fetch("/api/public/simulation/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asset, side, size }),
      })

      const data = (await response.json()) as OrderResult
      setResult(data)
    } catch {
      setResult({ success: false, error: "Unable to reach the DeltaAlpha simulation service." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Simulation Order</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Asset</Label>
            <select
              value={asset}
              onChange={(event) => setAsset(event.target.value as (typeof ASSETS)[number])}
              className="flex h-10 w-full rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground outline-none"
            >
              {ASSETS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
              >
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Simulation Size</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Button
                type="button"
                disabled={submitting}
                onClick={() => placeOrder("buy")}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {submitting ? "Processing…" : "Place Simulated Buy"}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Simulation Size</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Button
                type="button"
                disabled={submitting}
                onClick={() => placeOrder("sell")}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                {submitting ? "Processing…" : "Place Simulated Sell"}
              </Button>
            </TabsContent>
          </Tabs>

          {result && (
            <div className="rounded-lg border border-border bg-secondary/40 p-4 text-sm">
              {result.success ? (
                <div className="space-y-1 text-emerald-400">
                  <p className="font-medium">Simulation order verified.</p>
                  <p className="text-muted-foreground">
                    {result.side?.toUpperCase()} {result.asset} • size {result.size}
                  </p>
                  <p className="text-muted-foreground">
                    Session {result.sessionId} • Position {result.position?.positionId}
                  </p>
                  <p className="text-muted-foreground">
                    Entry {result.position?.entryPrice} • Verified: {result.verification?.verified ? "YES" : "NO"}
                  </p>
                </div>
              ) : (
                <p className="text-red-400">{result.error}</p>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Public beta simulation only — synthetic in-memory state, no broker, custody, settlement, or live execution.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
