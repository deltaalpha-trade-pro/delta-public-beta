import { Brain, BarChart3, Wallet, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Intelligence Agents",
    description:
      "Analysis systems that process market data, identify patterns, and generate reviewable insights through model-assisted research workflows.",
  },
  {
    icon: BarChart3,
    title: "Quantitative Analysis Models",
    description:
      "Mathematical frameworks for evaluating market dynamics, risk conditions, and systematic strategy research.",
  },
  {
    icon: Wallet,
    title: "Portfolio Simulation Views",
    description:
      "Non-custodial beta interfaces for tracking synthetic balances, simulated positions, and portfolio analytics.",
  },
  {
    icon: Shield,
    title: "Verification-First Posture",
    description:
      "Structured beta boundaries, append-only audit records, and public trust language designed for accountability and review.",
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
            architecture to deliver financial intelligence. DeltaAlpha-TradePro exposes a controlled public beta layer
            for insight generation, signal visualization, portfolio modeling, and informed research.
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
          WHALEZ-AI does not provide financial advice, live trade execution, custody, trading recommendations, or
          investment guarantees during beta. All outputs are informational and educational.
        </p>
      </div>
    </section>
  )
}
