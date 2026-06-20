import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | WHALEZ-AI",
  description:
    "Learn about the vision and philosophy behind WHALEZ-AI - AI-driven financial intelligence built on discipline, structure, and sustainability.",
}

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm text-accent font-medium tracking-wide uppercase">About</span>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                The Vision Behind WHALEZ-AI
              </h1>
            </div>

            <div className="mt-16 grid lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-medium text-foreground">Origin & Purpose</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    WHALEZ-AI was conceived as a response to the increasing complexity of modern financial markets.
                    Rather than chasing short-term gains or sensational predictions, we focused on building robust
                    analytical infrastructure—systems that understand, process, and illuminate market dynamics with
                    clarity and precision.
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Our approach is rooted in the belief that sustainable success in financial markets comes not from
                    luck or timing, but from rigorous analysis, systematic methodology, and disciplined execution.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-medium text-foreground">Philosophy</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    We reject hype. We reject promises of guaranteed returns. What we embrace is the pursuit of
                    understanding—building systems that can navigate complexity, identify meaningful patterns, and
                    provide actionable intelligence without overstating certainty.
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Every component of WHALEZ-AI is designed with intentionality. From our AI agents to our ledger
                    systems, each piece serves a specific purpose within a coherent whole. This is architecture built
                    for longevity, not spectacle.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-medium text-foreground">Long-Term Focus</h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    WHALEZ-AI is not a product rushed to market. It is an evolving ecosystem that will continue to
                    develop, refine, and expand based on real-world performance and user feedback. We measure progress
                    not in weeks, but in the compounding value of systematic improvement over years.
                  </p>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Our commitment is to build something that matters—a platform that serious participants can rely on
                    for insight, analysis, and strategic clarity in an uncertain world.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Core Principles</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="text-sm text-muted-foreground">Discipline over impulse</li>
                    <li className="text-sm text-muted-foreground">Structure over chaos</li>
                    <li className="text-sm text-muted-foreground">Sustainability over speed</li>
                    <li className="text-sm text-muted-foreground">Clarity over complexity</li>
                    <li className="text-sm text-muted-foreground">Evidence over assumption</li>
                  </ul>
                </div>

                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="text-sm font-medium text-foreground uppercase tracking-wide">Our Commitment</h3>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    We will never promise what we cannot deliver. WHALEZ-AI provides tools and insights—not financial
                    advice or guaranteed outcomes. Users remain responsible for their own decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
