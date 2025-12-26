"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Database, Zap, Users } from "lucide-react"

const stats = [
  {
    label: "Active Nodes",
    value: "5",
    change: "+2 this week",
    icon: Database,
    color: "text-primary",
  },
  {
    label: "Total Transactions",
    value: "12,847",
    change: "+342 today",
    icon: Activity,
    color: "text-emerald-400",
  },
  {
    label: "Block Time",
    value: "8.2s",
    change: "Avg last 100",
    icon: Zap,
    color: "text-amber-400",
  },
  {
    label: "Network Participants",
    value: "156",
    change: "+12 this month",
    icon: Users,
    color: "text-accent",
  },
]

export function NetworkStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
