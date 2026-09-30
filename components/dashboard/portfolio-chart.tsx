"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PortfolioResponse = {
  portfolio?: {
    name?: string
    reference_currency?: string
    total_reference_value?: string
    status?: string
  } | null
  source_of_truth?: string
}

export function PortfolioChart() {
  const [data, setData] = useState<PortfolioResponse | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/platform/portfolio", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("portfolio_unavailable")
        return response.json()
      })
      .then((value) => setData(value))
      .catch(() => setError(true))
  }, [])

  const portfolio = data?.portfolio
  const value = portfolio?.total_reference_value
  const currency = portfolio?.reference_currency || "USD"

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Portfolio State</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 p-6 text-sm text-muted-foreground">
            Portfolio service unavailable. No synthetic performance series is displayed.
          </div>
        ) : portfolio ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Reference value" value={value && value !== "0" ? `${currency} ${Number(value).toLocaleString()}` : "Not connected"} />
            <Metric label="State" value={portfolio.status || "UNKNOWN"} />
            <Metric label="Source" value={data?.source_of_truth || "Provider / WhalezChain"} />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-muted-foreground">
            Loading canonical portfolio state…
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/20 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}
