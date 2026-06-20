"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"

const ComposedChart = dynamic(() => import("recharts").then((mod) => mod.ComposedChart), { ssr: false })
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), { ssr: false })
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })

const data = [
  { time: "09:00", price: 1.245, volume: 12500 },
  { time: "09:30", price: 1.268, volume: 18200 },
  { time: "10:00", price: 1.252, volume: 15800 },
  { time: "10:30", price: 1.289, volume: 22400 },
  { time: "11:00", price: 1.312, volume: 28900 },
  { time: "11:30", price: 1.298, volume: 19600 },
  { time: "12:00", price: 1.325, volume: 31200 },
  { time: "12:30", price: 1.318, volume: 25400 },
  { time: "13:00", price: 1.342, volume: 35800 },
  { time: "13:30", price: 1.356, volume: 42100 },
  { time: "14:00", price: 1.348, volume: 38500 },
  { time: "14:30", price: 1.372, volume: 45200 },
]

interface PriceChartProps {
  pair: string
  currentPrice: string
  change: number
}

export function PriceChart({ pair, currentPrice, change }: PriceChartProps) {
  const isPositive = change >= 0

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">{pair}</CardTitle>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground">{currentPrice}</span>
            <Badge
              variant="outline"
              className={
                isPositive
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }
            >
              {isPositive ? "+" : ""}
              {change}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a90d9" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#4a90d9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
              <YAxis
                yAxisId="price"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                domain={["auto", "auto"]}
              />
              <YAxis
                yAxisId="volume"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0f",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
              />
              <Bar yAxisId="volume" dataKey="volume" fill="#1f2937" radius={[2, 2, 0, 0]} />
              <Area
                yAxisId="price"
                type="monotone"
                dataKey="price"
                stroke="#4a90d9"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
