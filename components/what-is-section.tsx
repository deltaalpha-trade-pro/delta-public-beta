import { Brain, BarChart3, Wallet, Shield } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Intelligence Agents",
    description:
      "Coordinated intelligence systems designed to model, interpret, and present complex operational and financial states.",
  },
  {
    icon: BarChart3,
    title: "Quantitative Analysis Models",
    description:
      "Structured analytical frameworks for interpreting market behavior, system posture, and bounded trading-oriented previews.",
  },
  {
    icon: Wallet,
    title: "Ledger & Account State Modeling",
    description:
      "Preview representations of how internal account, ledger, and asset logic may be surfaced in controlled public form.",
  },
  {
    icon: Shield,
    title: "Governed System Boundaries",
    description:
      "A posture that emphasizes staged access, bounded behavior, and controlled release rather than unrestricted public exposure.",
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
            WHALEZ-AI is a broader AI-orchestrated ecosystem spanning coordinated intelligence,
            financial-system modeling, controlled interfaces, and governed operational structure.
            This public repository is a bounded preview surface for that larger direction, not the
            full unrestricted live platform.
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
          This preview surface does not yet represent unrestricted live public onboarding, live trading execution,
          or full production account access.
        </p>
      </div>
    </section>
  )
}
