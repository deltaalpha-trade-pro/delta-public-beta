"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false })
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })

const data = [
  { date: "Jan", value: 10000 },
  { date: "Feb", value: 12500 },
  { date: "Mar", value: 11800 },
  { date: "Apr", value: 15200 },
  { date: "May", value: 14800 },
  { date: "Jun", value: 18500 },
  { date: "Jul", value: 17200 },
  { date: "Aug", value: 21000 },
  { date: "Sep", value: 19800 },
  { date: "Oct", value: 24500 },
  { date: "Nov", value: 23200 },
  { date: "Dec", value: 28750 },
]

export function PortfolioChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a90d9" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4a90d9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0f",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
              />
              <Area type="monotone" dataKey="value" stroke="#4a90d9" strokeWidth={2} fill="url(#portfolioGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
