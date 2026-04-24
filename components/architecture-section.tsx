import { Cpu, Bot, Database, Globe } from "lucide-react"

const architectureItems = [
  {
    icon: Cpu,
    title: "AI Core (WHALEZ-AI)",
    description:
      "Central intelligence layer for coordinating analysis, research outputs, and reviewable system responses across the ecosystem.",
  },
  {
    icon: Bot,
    title: "Intelligence Agents",
    description:
      "Specialized analytical modules focused on market research, risk review, pattern detection, and signal visualization.",
  },
  {
    icon: Database,
    title: "Audit & Asset Models",
    description:
      "Structured records for portfolio simulations, strategy history, user-visible state, and reproducible beta review.",
  },
  {
    icon: Globe,
    title: "Public Beta Gateway",
    description:
      "Controlled access layer that exposes selected intelligence outputs through DeltaAlpha-TradePro without live trade execution or custody.",
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
            A modular public beta architecture designed for controlled access, clear boundaries, reviewable outputs, and
            progressive trust-building.
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
          Architectural descriptions are illustrative and represent the public beta posture. Specific implementations may
          vary during beta development and do not imply live trading, custody, or guaranteed investment outcomes.
        </p>
      </div>
    </section>
  )
}
