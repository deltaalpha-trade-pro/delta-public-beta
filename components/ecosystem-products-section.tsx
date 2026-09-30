import { BarChart3, LineChart, MessageCircle, ShieldCheck } from "lucide-react"

const publicFocus = [
  {
    icon: BarChart3,
    title: "Market Intelligence",
    description:
      "Structured market context, quantitative analysis, risk framing, and signal interpretation for informed decision-making.",
    items: ["Market context", "Quantitative analysis", "Risk framing"],
  },
  {
    icon: LineChart,
    title: "Controlled Simulations",
    description:
      "Demo-only financial workflows that let beta users explore strategy behavior and outcomes without live execution or custody.",
    items: ["Scenario modeling", "Demo trading", "Outcome review"],
  },
  {
    icon: ShieldCheck,
    title: "Portfolio Intelligence",
    description:
      "User-facing views for understanding simulated financial states, exposure, movement, and portfolio context during beta.",
    items: ["Exposure context", "Portfolio views", "Movement history"],
  },
  {
    icon: MessageCircle,
    title: "Ecosystem Communications",
    description:
      "A controlled communication layer for public announcements, community updates, and platform events through supported channels.",
    items: ["Public updates", "Community communication", "Platform events"],
  },
]

export function EcosystemProductsSection() {
  return (
    <section className="py-24 md:py-32 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm text-accent font-medium tracking-wide uppercase">Public beta</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Financial intelligence, presented with purpose
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
            DeltaAlpha-TradePro is the public gateway into WHALEZ-AI. The beta focuses on useful intelligence,
            controlled simulations, portfolio context, and ecosystem communication—not unfinished or unactivated
            financial infrastructure.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {publicFocus.map((product) => {
            const Icon = product.icon
            return (
              <article
                key={product.title}
                className="rounded-2xl border border-border bg-background/80 p-6 hover:border-primary/40 transition-colors"
              >
                <div className="inline-flex rounded-xl border border-white/10 bg-card p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{product.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                <div className="mt-5 space-y-2">
                  {product.items.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-background/70 px-6 py-5 text-sm text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Beta boundary:</span> no live trading, custody, broker
          execution, settlement execution, or private authority is exposed through this public surface.
        </div>
      </div>
    </section>
  )
}
