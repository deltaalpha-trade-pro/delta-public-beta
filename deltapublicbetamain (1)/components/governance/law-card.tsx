"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

interface LawCardProps {
  id: string
  title: string
  category: "allocation" | "governance" | "compliance" | "operations"
  description: string
  status: "active" | "pending" | "draft"
}

const categoryColors = {
  allocation: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  governance: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  compliance: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  operations: "bg-accent/20 text-accent border-accent/30",
}

const statusColors = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  draft: "bg-muted text-muted-foreground border-border",
}

export function LawCard({ id, title, category, description, status }: LawCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-mono text-muted-foreground">{id}</p>
            <CardTitle className="text-foreground group-hover:text-primary transition-colors">{title}</CardTitle>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={categoryColors[category]}>
            {category}
          </Badge>
          <Badge variant="outline" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
