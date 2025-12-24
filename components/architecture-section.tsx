import { Cpu, Bot, Database, Globe } from "lucide-react"

const architectureItems = [
  {
    icon: Cpu,
    title: "AI Core (WHALEZ-AI)",
    description:
      "Central intelligence processing unit that orchestrates all analysis, learning, and output generation across the ecosystem.",
  },
  {
    icon: Bot,
    title: "Intelligence Agents",
    description:
      "Specialized autonomous modules focused on specific analytical domains—market analysis, risk assessment, pattern detection.",
  },
  {
    icon: Database,
    title: "Ledger & Asset Models",
    description:
      "Structured data architecture for position tracking, transaction history, and comprehensive portfolio state management.",
  },
  {
    icon: Globe,
    title: "Public Exchange Interface",
    description:
      "Secure gateway layer enabling controlled access to intelligence outputs and analysis tools through DeltaAlpha-TradePro.",
  },
]

export function ArchitectureSection() {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            System Architecture Overview
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
            A modular, secure infrastructure designed for scalability, reliability, and institutional-grade performance.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {architectureItems.map((item, index) => (
            <div
              key={item.title}
              className="relative p-6 rounded-lg border border-border bg-background group hover:border-primary/30 transition-colors"
            >
              <div className="absolute top-4 right-4 text-xs text-muted-foreground font-mono">
                {String(index + 1).padStart(2, "0")}
              </div>
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-base font-medium text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          All architectural descriptions are illustrative and represent the intended system design. Specific
          implementations may vary during the beta development phase.
        </p>
      </div>
    </section>
  )
}
