"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const PieChart = dynamic(() => import("recharts").then((mod) => mod.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then((mod) => mod.Pie), { ssr: false })
const Cell = dynamic(() => import("recharts").then((mod) => mod.Cell), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false })
const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false })

const data = [
  { name: "PTN (Potential)", value: 45000000, color: "#4a90d9" },
  { name: "PRN (Proven)", value: 28000000, color: "#10b981" },
  { name: "WHZ (Whalez)", value: 12000000, color: "#f59e0b" },
  { name: "Reserved", value: 15000000, color: "#6b7280" },
]

export function TokenCirculation() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Token Circulation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0a0a0f",
                  border: "1px solid #1f2937",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
                formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M`, "Tokens"]}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value) => <span className="text-gray-400 text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
