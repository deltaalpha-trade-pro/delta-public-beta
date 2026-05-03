import Link from "next/link"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export type LegalSection = {
  title: string
  body: string[]
}

export function LegalPage({
  label,
  title,
  description,
  sections,
}: {
  label: string
  title: string
  description: string
  sections: LegalSection[]
}) {
  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden pt-16">
        <div className="glow-orb left-[-12rem] top-28 h-80 w-80 bg-primary/35" />
        <div className="glow-orb right-[-10rem] top-52 h-96 w-96 bg-cyan-400/20" />

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-10 md:p-12">
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-primary">{label}</p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>

              <div className="mt-10 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-sm leading-7 text-amber-100/85">
                This page is provided for public beta transparency and does not replace legal, financial, tax, compliance,
                investment, or regulatory advice. The public beta is informational only and does not enable live trading,
                custody, broker execution, settlement execution, or private founder authority.
              </div>
            </div>

            <div className="mt-8 grid gap-5">
              {sections.map((section) => (
                <article key={section.title} className="glass-card rounded-3xl p-6 sm:p-8">
                  <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                  <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 glass-panel rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-foreground">Related policies</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  ["Terms", "/terms"],
                  ["Privacy", "/privacy"],
                  ["Risk Disclosure", "/risk-disclosure"],
                  ["Beta Disclaimer", "/beta-disclaimer"],
                  ["Cookies", "/cookies"],
                ].map(([name, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
