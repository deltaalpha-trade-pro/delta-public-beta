"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import Link from "next/link"
import { CheckCircle2, ShieldCheck } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function BetaAccessPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    window.setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <>
      <Navigation />
      <main className="pt-24">
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
                Controlled Public Beta
              </p>
              <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                Request Beta Access
              </h1>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                DeltaAlpha-TradePro is the public beta gateway of the WHALEZ-AI ecosystem. Access is limited while the
                platform remains in a controlled, non-custodial beta environment.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <div className="rounded-xl border border-border bg-card p-6">
                {submitted ? (
                  <div className="space-y-5">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                    <div>
                      <h2 className="text-xl font-medium text-foreground">Request received</h2>
                      <p className="mt-3 text-muted-foreground leading-relaxed">
                        Your beta access request has been recorded for review. During beta, the platform provides
                        informational market intelligence only and does not custody funds or execute live trades.
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/trust-safety">Read Trust & Safety</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-foreground" htmlFor="name">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        required
                        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground" htmlFor="useCase">
                        Intended use
                      </label>
                      <textarea
                        id="useCase"
                        name="useCase"
                        rows={5}
                        className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                        placeholder="Market intelligence, portfolio modeling, research, pilot review..."
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full min-h-[44px]">
                      {isLoading ? "Submitting..." : "Submit Beta Request"}
                    </Button>
                  </form>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <h2 className="text-xl font-medium text-foreground">Beta boundary</h2>
                </div>

                <div className="mt-5 space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    The public beta provides market intelligence, signal visualization, strategy analysis, portfolio
                    modeling, and performance research.
                  </p>
                  <p>
                    WHALEZ-AI and DeltaAlpha-TradePro do not custody user funds, submit live market orders, or guarantee
                    outcomes during beta.
                  </p>
                  <p>
                    Users remain responsible for their own financial decisions and should not rely solely on platform
                    outputs.
                  </p>
                </div>

                <Button variant="outline" className="mt-6 bg-transparent" asChild>
                  <Link href="/legal">Read Legal Disclaimer</Link>
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
