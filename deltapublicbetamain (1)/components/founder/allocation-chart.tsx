"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })

const data = [
  { name: "Genesis Reserve", PTN: 25000000, PRN: 15000000, WHZ: 8000000 },
  { name: "Development", PTN: 8000000, PRN: 5000000, WHZ: 2000000 },
  { name: "Operations", PTN: 5000000, PRN: 4000000, WHZ: 1000000 },
  { name: "AI Research", PTN: 4000000, PRN: 2500, WHZ: 500000 },
  { name: "Liquidity", PTN: 2000000, PRN: 1000000, WHZ: 300000 },
  { name: "Founder", PTN: 1000000, PRN: 500000, WHZ: 200000 },
]

export function AllocationChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Token Allocations by Fund</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 11 }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0f",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
                formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M`, ""]}
              />
              <Bar dataKey="PTN" stackId="a" fill="#4a90d9" radius={[0, 0, 0, 0]} />
              <Bar dataKey="PRN" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="WHZ" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#4a90d9]" />
            <span className="text-xs text-muted-foreground">PTN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#10b981]" />
            <span className="text-xs text-muted-foreground">PRN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#f59e0b]" />
            <span className="text-xs text-muted-foreground">WHZ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
