const productGroups = [
  {
    title: "Trading Dashboard",
    label: "Market intelligence",
    description:
      "A public beta surface for chart context, signal visualization, watchlist review, risk framing, and strategy analysis without live execution.",
    items: ["Chart context", "Signal review", "Risk framing"],
  },
  {
    title: "Investment Dashboard",
    label: "Portfolio modeling",
    description:
      "A longer-horizon view for simulated allocations, thesis tracking, exposure awareness, and performance modeling across supported assets.",
    items: ["Allocation view", "Thesis tracking", "Exposure modeling"],
  },
  {
    title: "Wallet Dashboard",
    label: "Balance visibility",
    description:
      "A non-custodial beta preview for displaying account states, asset lanes, internal balances, and user-facing movement history.",
    items: ["Asset lanes", "Balance states", "Movement history"],
  },
  {
    title: "Bank Dashboard",
    label: "Financial coordination",
    description:
      "A digital banking-style control surface for ledger visibility, transaction review, account status, and settlement-aware coordination.",
    items: ["Ledger view", "Account status", "Transaction review"],
  },
]

const commerceLayers = [
  {
    name: "Escrow Coordination",
    copy: "A controlled state layer for showing how protected deal flow, release conditions, and participant review could be represented inside the ecosystem.",
  },
  {
    name: "WHZ Settlement",
    copy: "A public explanation layer for WHZ-denominated settlement logic, fees, receipts, and completion states without activating live transfer authority.",
  },
  {
    name: "Signals",
    copy: "A purchasable intelligence module concept for structured market alerts, pattern summaries, and signal history during beta review.",
  },
  {
    name: "Coach",
    copy: "A guided analysis module concept for explaining market context, risk posture, and user education in plain language.",
  },
]

export function EcosystemProductsSection() {
  return (
    <section className="py-24 md:py-32 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm text-accent font-medium tracking-wide uppercase">Product Surface</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            One ecosystem, multiple user dashboards
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
            DeltaAlpha-TradePro is being shaped as the public gateway where users can review trading intelligence,
            investment modeling, wallet visibility, digital banking views, escrow coordination, WHZ settlement context,
            and optional intelligence products from one controlled beta surface.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {productGroups.map((product) => (
            <article
              key={product.title}
              className="rounded-xl border border-border bg-background/80 p-6 hover:border-primary/40 transition-colors"
            >
              <div className="text-xs text-primary uppercase tracking-wide">{product.label}</div>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{product.title}</h3>
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
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-background/80 overflow-hidden">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-border">
              <span className="text-xs text-primary uppercase tracking-wide">Commercial modules</span>
              <h3 className="mt-3 text-xl md:text-2xl font-semibold text-foreground">
                Escrow, WHZ settlement, Signals, and Coach
              </h3>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                These surfaces are presented as beta-stage product modules. They describe what users may purchase,
                subscribe to, or utilize after review, compliance readiness, and founder-approved activation.
              </p>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                Public beta boundary: no live trading, no custody, no broker execution, and no settlement execution are
                enabled by this section.
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              {commerceLayers.map((layer) => (
                <div key={layer.name} className="p-6 border-b sm:odd:border-r border-border last:border-b-0">
                  <h4 className="text-base font-medium text-foreground">{layer.name}</h4>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{layer.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
