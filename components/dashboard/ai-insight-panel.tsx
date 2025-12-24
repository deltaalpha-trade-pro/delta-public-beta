"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Sparkles, AlertTriangle, TrendingUp } from "lucide-react"

interface Insight {
  id: string
  type: "prediction" | "alert" | "recommendation" | "analysis"
  title: string
  description: string
  confidence: number
  timestamp: string
}

const insights: Insight[] = [
  {
    id: "1",
    type: "prediction",
    title: "Market Sentiment Shift Detected",
    description:
      "DeltaAlpha models indicate a 73% probability of increased volatility in the next 48 hours across tracked digital assets.",
    confidence: 73,
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "recommendation",
    title: "Portfolio Rebalancing Suggested",
    description:
      "Consider adjusting PTN allocation based on current risk metrics. AI analysis suggests optimal distribution shift.",
    confidence: 68,
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    type: "analysis",
    title: "Correlation Pattern Identified",
    description:
      "New correlation discovered between WHZ token velocity and broader market indicators. Further analysis recommended.",
    confidence: 82,
    timestamp: "6 hours ago",
  },
  {
    id: "4",
    type: "alert",
    title: "Unusual Transaction Volume",
    description:
      "Whalezchain recorded 23% higher transaction volume than baseline. Monitoring for potential significance.",
    confidence: 91,
    timestamp: "8 hours ago",
  },
]

const iconMap = {
  prediction: TrendingUp,
  alert: AlertTriangle,
  recommendation: Sparkles,
  analysis: Brain,
}

const colorMap = {
  prediction: "text-primary",
  alert: "text-amber-400",
  recommendation: "text-emerald-400",
  analysis: "text-accent",
}

export function AIInsightPanel() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Brain className="w-5 h-5 text-primary" />
          AI Intelligence Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const Icon = iconMap[insight.type]
          const colorClass = colorMap[insight.type]

          return (
            <div key={insight.id} className="p-4 rounded-lg bg-secondary/50 border border-border/50">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-background ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground truncate">{insight.title}</h4>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{insight.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{insight.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{insight.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
