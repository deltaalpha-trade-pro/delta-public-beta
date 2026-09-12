import { Brain, BarChart3, Wallet, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Intelligence",
    description:
      "AI-assisted analysis that processes market context, identifies patterns, and helps users interpret complex information.",
  },
  {
    icon: BarChart3,
    title: "Quantitative Analysis",
    description:
      "Systematic models for evaluating market dynamics, risk context, and strategy behavior without presenting outputs as guaranteed outcomes.",
  },
  {
    icon: Wallet,
    title: "Portfolio & Account Views",
    description:
      "User-facing previews for balances, portfolio context, movement history, and simulated financial states during the controlled beta.",
  },
  {
    icon: Shield,
    title: "Digital Asset Intelligence",
    description:
      "Structured tools for understanding digital-asset behavior, correlations, market structure, and related risk factors.",
  },
]

export function WhatIsSection() {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            What WHALEZ-AI Is
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
            WHALEZ-AI is an integrated ecosystem combining artificial intelligence, quantitative methods, and systematic
            analysis to deliver financial intelligence. The public beta focuses on insight, modeling, controlled
            simulations, and informed decision-making—not live financial execution.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-medium text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          WHALEZ-AI does not provide financial advice, trading recommendations, or investment guarantees. All public-beta
          outputs are informational, experimental, or simulated where explicitly stated.
        </p>
      </div>
    </section>
  )
}
