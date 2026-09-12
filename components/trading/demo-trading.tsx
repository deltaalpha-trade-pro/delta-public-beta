"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TradeForm } from "@/components/trading/trade-form"

type DemoOrder = {
  id: string
  timestamp: string
  asset: string
  side: string
  direction?: string
  size: number
  entryPrice?: number
  sessionId?: string
  verified: boolean
}

type DemoIdentity = {
  email?: string
  user_id?: string
  mode?: string
}

const STARTING_BALANCE = 100_000

function storageKey(email: string) {
  return `deltaalpha-demo-account:${email.toLowerCase()}`
}

export function DemoTrading() {
  const [identity, setIdentity] = useState<DemoIdentity | null>(null)
  const [orders, setOrders] = useState<DemoOrder[]>([])
  const [balance, setBalance] = useState(STARTING_BALANCE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadIdentity() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
        })

        if (!response.ok) {
          if (!cancelled) setLoaded(true)
          return
        }

        const data = (await response.json()) as DemoIdentity

        if (cancelled) return

        setIdentity(data)

        const email = data.email?.trim().toLowerCase()

        if (email) {
          const saved = window.localStorage.getItem(storageKey(email))

          if (saved) {
            try {
              const parsed = JSON.parse(saved) as {
                balance?: number
                orders?: DemoOrder[]
              }

              if (typeof parsed.balance === "number") {
                setBalance(parsed.balance)
              }

              if (Array.isArray(parsed.orders)) {
                setOrders(parsed.orders)
              }
            } catch {
              window.localStorage.removeItem(storageKey(email))
            }
          }
        }
      } catch {
        // Demo UI remains usable even if identity lookup fails.
      } finally {
        if (!cancelled) {
          setLoaded(true)
        }
      }
    }

    loadIdentity()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const email = identity?.email?.trim().toLowerCase()

    if (!email || !loaded) return

    window.localStorage.setItem(
      storageKey(email),
      JSON.stringify({
        balance,
        orders,
      }),
    )
  }, [identity, balance, orders, loaded])

  function recordOrder(result: {
    success: boolean
    asset?: string
    side?: string
    direction?: string
    size?: number
    sessionId?: string
    position?: {
      entryPrice?: number
    }
    verification?: {
      verified?: boolean
    }
  }) {
    if (!result.success || !result.asset || !result.side || !result.size) {
      return
    }

    const order: DemoOrder = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      asset: result.asset,
      side: result.side,
      direction: result.direction,
      size: result.size,
      entryPrice: result.position?.entryPrice,
      sessionId: result.sessionId,
      verified: result.verification?.verified === true,
    }

    setOrders((current) => [order, ...current].slice(0, 50))

    setBalance((current) =>
      Math.max(0, current - Math.min(current, result.size ?? 0)),
    )
  }

  function resetAccount() {
    if (!window.confirm("Reset this Demo Trading account to $100,000?")) {
      return
    }

    setBalance(STARTING_BALANCE)
    setOrders([])

    const email = identity?.email?.trim().toLowerCase()

    if (email) {
      window.localStorage.removeItem(storageKey(email))
    }
  }

  const totalExposure = useMemo(
    () => orders.reduce((total, order) => total + order.size, 0),
    [orders],
  )

  const email = identity?.email ?? "Demo user"

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-400">
              DEMO TRADING
            </p>
            <p className="text-sm text-muted-foreground">
              Synthetic execution only. No real funds or live market orders.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={resetAccount}
            className="border-border"
          >
            Reset Demo Account
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Demo Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              ${balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Demo Exposure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {totalExposure.toLocaleString("en-US")}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-foreground">
              {orders.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">
              Demo Order History
            </CardTitle>
          </CardHeader>

          <CardContent>
            {orders.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No demo orders yet.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Place a simulated order to begin experimenting.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-foreground">
                        {order.side.toUpperCase()} {order.asset}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(order.timestamp).toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                      <span>Size: {order.size}</span>
                      <span>
                        Entry: {order.entryPrice ?? "—"}
                      </span>
                      <span>
                        Session: {order.sessionId ?? "—"}
                      </span>
                      <span>
                        Verified: {order.verified ? "YES" : "NO"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <TradeForm onOrderRecorded={recordOrder} />

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground">
                Account: {email}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Demo account state is stored locally in this browser. Clearing
                browser storage or changing devices can remove this history.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
