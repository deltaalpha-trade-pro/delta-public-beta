import { Brain, BarChart3, Wallet, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Intelligence Agents",
    description:
      "Autonomous analysis systems that process market data, identify patterns, and generate actionable insights through advanced machine learning models.",
  },
  {
    icon: BarChart3,
    title: "Quantitative Analysis Models",
    description:
      "Sophisticated mathematical frameworks for evaluating market dynamics, risk assessment, and systematic strategy development.",
  },
  {
    icon: Wallet,
    title: "Internal Ledger Systems",
    description:
      "Secure, transparent record-keeping infrastructure for tracking positions, transactions, and portfolio analytics.",
  },
  {
    icon: Shield,
    title: "Digital Asset Logic",
    description:
      "Structured frameworks for understanding digital asset behavior, correlation analysis, and market microstructure.",
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
            architecture to deliver financial intelligence. This is not a trading platform—it is an analytical
            infrastructure designed for insight generation and informed decision-making.
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
          WHALEZ-AI does not provide financial advice, trading recommendations, or investment guarantees. All outputs
          are informational and experimental.
        </p>
      </div>
    </section>
  )
}
