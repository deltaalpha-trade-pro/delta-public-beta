"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "PTN (Potential)", value: 45000000, color: "#4a90d9" },
  { name: "PRN (Proven)", value: 28000000, color: "#10b981" },
  { name: "WHZ (Whalez)", value: 12000000, color: "#f59e0b" },
  { name: "Reserved", value: 15000000, color: "#6b7280" },
]

export function TokenCirculation() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Token Circulation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex h-5 overflow-hidden rounded-full border border-border">
            {data.map((entry) => {
              const percent = (entry.value / total) * 100

              return (
                <div
                  key={entry.name}
                  title={`${entry.name}: ${(entry.value / 1000000).toFixed(1)}M`}
                  style={{ backgroundColor: entry.color, width: `${percent}%` }}
                />
              )
            })}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((entry) => {
            const percent = (entry.value / total) * 100

            return (
              <div key={entry.name} className="rounded-lg border border-border bg-secondary/30 p-3">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{entry.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(entry.value / 1000000).toFixed(1)}M tokens
                    </p>
                  </div>
                  <p className="text-sm font-mono text-foreground">{percent.toFixed(1)}%</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
