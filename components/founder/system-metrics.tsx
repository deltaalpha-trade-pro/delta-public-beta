"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Cpu, HardDrive, Activity } from "lucide-react"

const metrics = [
  {
    label: "AI Engine Status",
    value: "Operational",
    detail: "All 4 submodels active",
    icon: Cpu,
    status: "healthy",
  },
  {
    label: "Whalezchain Nodes",
    value: "5/5 Online",
    detail: "Consensus stable",
    icon: Server,
    status: "healthy",
  },
  {
    label: "Ledger Integrity",
    value: "Verified",
    detail: "Last check: 2 min ago",
    icon: HardDrive,
    status: "healthy",
  },
  {
    label: "API Latency",
    value: "42ms",
    detail: "Avg last 1000 req",
    icon: Activity,
    status: "healthy",
  },
]

const statusColors = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
}

export function SystemMetrics() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-primary" />
                {metric.label}
              </div>
              <div className={`w-2 h-2 rounded-full ${statusColors[metric.status as keyof typeof statusColors]}`} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold text-foreground">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
