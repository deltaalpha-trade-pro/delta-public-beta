"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TradeForm() {
  const [amount, setAmount] = useState("")
  const [price, setPrice] = useState("1.3700")

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
              Sell
            </TabsTrigger>
          </TabsList>
          <TabsContent value="buy" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Price</Label>
              <Input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Amount (PTN)</Label>
              <Input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground py-2 border-t border-border">
              <span>Total</span>
              <span>{amount ? (Number.parseFloat(amount) * Number.parseFloat(price)).toFixed(2) : "0.00"} USD</span>
            </div>
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Place Buy Order</Button>
            <p className="text-xs text-muted-foreground text-center">Simulated order - No real transactions</p>
          </TabsContent>
          <TabsContent value="sell" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Price</Label>
              <Input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Amount (PTN)</Label>
              <Input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground py-2 border-t border-border">
              <span>Total</span>
              <span>{amount ? (Number.parseFloat(amount) * Number.parseFloat(price)).toFixed(2) : "0.00"} USD</span>
            </div>
            <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Place Sell Order</Button>
            <p className="text-xs text-muted-foreground text-center">Simulated order - No real transactions</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
