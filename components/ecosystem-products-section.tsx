import Link from "next/link"
import { Activity, BarChart3, Brain, Building2, LineChart, LockKeyhole, MessageCircle, Network, ShieldCheck } from "lucide-react"

const publicFocus = [
  { icon: Brain, title: "AI Coaching", description: "Guided financial education, reasoning, risk habits, and plain-language interpretation.", href: "/coaching", label: "Explore coaching" },
  { icon: Activity, title: "Market Intelligence", description: "Market context, live-observation plumbing, signal interpretation, and trend analysis.", href: "/terminal", label: "Open terminal" },
  { icon: BarChart3, title: "Investment", description: "Portfolio modeling across native ecosystem assets and external positions.", href: "/investment", label: "Open investment" },
  { icon: LineChart, title: "Trading", description: "A governed simulation environment for strategies, orders, exposure, and outcome review.", href: "/trading", label: "Open trading" },
  { icon: Building2, title: "Digital Finance", description: "Banking-style account, payment, conversion, and movement workflows assembled behind controls.", href: "/banking", label: "View banking" },
  { icon: LockKeyhole, title: "Escrow & Settlement", description: "Obligation coordination, WHZ settlement-bond modeling, finality-aware state, and settlement simulation.", href: "/settlement", label: "See settlement" },
  { icon: Network, title: "WhalezChain", description: "The native state, economic, receipt, and provenance rail for ecosystem-native assets.", href: "/whalezchain", label: "Explore native rail" },
  { icon: MessageCircle, title: "Communications", description: "Public community updates and platform communication through supported channels.", href: "/#communications", label: "See communications" },
  { icon: ShieldCheck, title: "Controlled Participation", description: "A staged path from identity and education through eligibility, capability, and qualified financial operations.", href: "/dashboard", label: "View dashboard" },
]

export function EcosystemProductsSection() {
  return (
    <section className="border-y border-border bg-card py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <span className="text-sm font-medium uppercase tracking-[0.22em] text-primary">Public beta</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">The ecosystem you can actually see</h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            The public site is being shaped to show the architecture as a living product: capabilities have real routes,
            simulations where appropriate, and clear boundaries where external authority is not yet activated.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {publicFocus.map((product) => {
            const Icon = product.icon
            return (
              <Link key={product.title} href={product.href} className="group rounded-2xl border border-border bg-background/80 p-6 transition hover:-translate-y-0.5 hover:border-primary/40">
                <div className="inline-flex rounded-xl border border-white/10 bg-card p-3 text-primary"><Icon className="h-5 w-5" /></div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{product.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{product.description}</p>
                <span className="mt-5 inline-flex items-center text-sm font-medium text-primary">{product.label}<span className="ml-2 transition-transform group-hover:translate-x-1">→</span></span>
              </Link>
            )
          })}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-background/70 px-6 py-5 text-sm leading-7 text-muted-foreground">
          <span className="font-medium text-foreground">Reality boundary:</span> a visible capability is not automatically a live financial authorization.
          Public execution remains simulation-only until the separate technical, partner, jurisdiction, legal, identity, and operational gates are satisfied.
        </div>
      </div>
    </section>
  )
}
