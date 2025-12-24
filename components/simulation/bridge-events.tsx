"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftRight, Clock, CheckCircle, XCircle, Flame } from "lucide-react"

interface BridgeEvent {
  id: string
  timestamp: string
  type: "PENDING" | "FINALIZED" | "FAILED"
  amount: string
  asset: string
  exposureWhz: number
  slashedWhz?: number
}

const mockEvents: BridgeEvent[] = [
  {
    id: "BR-0x7f3a...9c2d",
    timestamp: "2025-01-19T14:32:00Z",
    type: "PENDING",
    amount: "1,250.00",
    asset: "PTN",
    exposureWhz: 12.5,
  },
  {
    id: "BR-0x4e1b...8a3f",
    timestamp: "2025-01-19T14:28:00Z",
    type: "FINALIZED",
    amount: "800.00",
    asset: "PRN",
    exposureWhz: 8,
  },
  {
    id: "BR-0x2c9d...1e7b",
    timestamp: "2025-01-19T14:15:00Z",
    type: "FINALIZED",
    amount: "2,100.00",
    asset: "PTN",
    exposureWhz: 21,
  },
  {
    id: "BR-0x8f2e...5d4c",
    timestamp: "2025-01-19T13:45:00Z",
    type: "FAILED",
    amount: "500.00",
    asset: "PTN",
    exposureWhz: 5,
    slashedWhz: 5,
  },
]

export function BridgeEvents() {
  const [events, setEvents] = useState<BridgeEvent[]>(mockEvents)

  // Simulate event updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => {
        const updated = [...prev]
        // Randomly progress a pending event
        const pendingIndex = updated.findIndex((e) => e.type === "PENDING")
        if (pendingIndex !== -1 && Math.random() > 0.7) {
          const willFail = Math.random() > 0.85
          updated[pendingIndex] = {
            ...updated[pendingIndex],
            type: willFail ? "FAILED" : "FINALIZED",
            slashedWhz: willFail ? updated[pendingIndex].exposureWhz : undefined,
          }
        }
        return updated
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (event: BridgeEvent) => {
    switch (event.type) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        )
      case "FINALIZED":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <CheckCircle className="w-3 h-3 mr-1" /> Finalized
          </Badge>
        )
      case "FAILED":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        )
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          Bridge Events
        </CardTitle>
        <p className="text-sm text-muted-foreground">Pre-settlement bridge transactions and their finality status</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="p-3 bg-secondary/50 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-muted-foreground">{event.id}</span>
                {getStatusBadge(event)}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {event.amount} {event.asset}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">WHZ Exposure</p>
                  <p className="text-sm font-mono text-amber-400">{event.exposureWhz} WHZ</p>
                </div>
              </div>
              {event.type === "FAILED" && event.slashedWhz && (
                <div className="mt-2 pt-2 border-t border-border flex items-center gap-2 text-red-400">
                  <Flame className="w-3 h-3" />
                  <span className="text-xs">{event.slashedWhz} WHZ slashed and burned</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
          Bridge events show pre-settlement transactions. Failed settlements result in WHZ slashing to maintain system
          integrity.
        </p>
      </CardContent>
    </Card>
  )
}
