"use client"

import { useEffect, useMemo, useState } from "react"
import { Activity, AlertTriangle, Clock3 } from "lucide-react"

type Quote = {
  symbol: string
  quotes: Array<{
    source_id: string
    venue: string
    asset_class: string
    bid: string | null
    ask: string | null
    last: string | null
    mid: string | null
    spread: string | null
    received_at: string
    stale: boolean
    status: string
  }>
}

const SYMBOLS = ["BTC/USD", "ETH/USD", "EUR/USD", "GBP/USD", "USD/JPY", "USD/NGN"]

export function LiveMarketData() {
  const [data, setData] = useState<Record<string, Quote | null>>({})
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const results = await Promise.all(
      SYMBOLS.map(async (symbol) => {
        try {
          const response = await fetch(
            `/api/market-data/quote?symbol=${encodeURIComponent(symbol)}`,
            { cache: "no-store" },
          )
          if (!response.ok) return [symbol, null] as const
          const body = await response.json()
          return [symbol, (body.marketData as Quote) ?? null] as const
        } catch {
          return [symbol, null] as const
        }
      }),
    )
    setData(Object.fromEntries(results))
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    const timer = window.setInterval(refresh, 5000)
    return () => window.clearInterval(timer)
  }, [])

  const rows = useMemo(
    () =>
      SYMBOLS.map((symbol) => ({
        symbol,
        quote: data[symbol],
      })),
    [data],
  )

  return (
    <section className="rounded-lg border border-border bg-card/60 p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold">Live Market Data</h2>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Observation from configured external market-data sources. Not execution pricing.
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {loading ? "Connecting" : "5s refresh"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
        {rows.map(({ symbol, quote }) => {
          const primary = quote?.quotes?.[0]
          const stale = primary?.stale ?? false
          const unavailable = !primary

          return (
            <div key={symbol} className="rounded-md border border-border/70 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{symbol}</span>
                <span
                  className={
                    unavailable || stale
                      ? "text-[10px] text-amber-500"
                      : "text-[10px] text-emerald-500"
                  }
                >
                  {unavailable ? "UNAVAILABLE" : stale ? "STALE" : "LIVE"}
                </span>
              </div>

              {primary ? (
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <div className="text-muted-foreground">Bid</div>
                    <div className="font-mono">{primary.bid ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Ask</div>
                    <div className="font-mono">{primary.ask ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Mid/Last</div>
                    <div className="font-mono">{primary.mid ?? primary.last ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Source</div>
                    <div className="truncate">{primary.venue}</div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <AlertTriangle className="w-3 h-3" />
                  Private market-data runtime not returning a current quote.
                </div>
              )}

              {primary && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock3 className="w-3 h-3" />
                  {new Date(primary.received_at).toLocaleTimeString()}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
