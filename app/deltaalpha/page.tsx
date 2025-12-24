import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LineChart, Zap, Eye, BarChart3, TrendingUp, Shield } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DeltaAlpha-TradePro | WHALEZ-AI",
  description:
    "Public intelligence and analysis interface of the WHALEZ-AI ecosystem. Access market insights, signals visualization, and strategy analysis tools.",
}

const features = [
  {
    icon: LineChart,
    title: "Market Insights Dashboard",
    description:
      "Comprehensive visualization of market conditions, trends, and key metrics across multiple asset classes and timeframes.",
  },
  {
    icon: Zap,
    title: "Signal Processing",
    description:
      "AI-generated signals based on quantitative analysis, pattern recognition, and multi-factor modeling—delivered with context and confidence indicators.",
  },
  {
    icon: Eye,
    title: "Strategy Analysis",
    description:
      "Tools for evaluating and backtesting systematic strategies, understanding risk-reward profiles, and optimizing approach parameters.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Detailed breakdowns of strategy performance, drawdown analysis, and comparative benchmarking against relevant indices.",
  },
  {
    icon: TrendingUp,
    title: "Trend Detection",
    description:
      "Advanced algorithms for identifying emerging trends, momentum shifts, and structural market changes before they become obvious.",
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description:
      "Quantitative risk metrics, correlation analysis, and exposure monitoring to support informed position management.",
  },
]

export default function DeltaAlphaPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm text-accent font-medium tracking-wide uppercase">Public Interface</span>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                DeltaAlpha-TradePro
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
                The public-facing intelligence and analysis interface of the WHALEZ-AI ecosystem. DeltaAlpha-TradePro
                transforms complex market data into actionable insights through intuitive visualization and systematic
                analysis tools.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground text-balance">
              What DeltaAlpha Provides
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl leading-relaxed text-pretty">
              A comprehensive suite of analytical tools designed for systematic market participants. All features are
              built on the WHALEZ-AI intelligence infrastructure.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-lg border border-border bg-background hover:border-primary/30 transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-base font-medium text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground text-balance">
                  How Intelligence Is Processed
                </h2>
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-medium text-foreground">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Data Ingestion</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        Market data from multiple sources is collected, validated, and normalized for consistent
                        analysis.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-medium text-foreground">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">AI Processing</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        Intelligence agents analyze data using quantitative models, machine learning, and pattern
                        recognition algorithms.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-medium text-foreground">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Signal Generation</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        Insights are synthesized into actionable signals with confidence levels and contextual
                        information.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-sm font-medium text-foreground">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">User Delivery</h3>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        Processed intelligence is presented through intuitive dashboards and visualization tools.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="font-medium text-foreground">Beta Expectations</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    During the beta phase, DeltaAlpha-TradePro users can expect:
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      Access to core analysis dashboards and signal feeds
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      Regular feature updates and improvements
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      Opportunity to provide feedback on functionality
                    </li>
                    <li className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1.5">•</span>
                      Early access to new features as they become available
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="font-medium text-foreground">Important Note</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    DeltaAlpha-TradePro does not execute trades or provide personalized financial advice. All signals
                    and analysis are informational outputs intended to support—not replace—independent decision-making.
                  </p>
                </div>

                <Button className="w-full min-h-[44px]" asChild>
                  <Link href="/beta-access">Request Beta Access</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
