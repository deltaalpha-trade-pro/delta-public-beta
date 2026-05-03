"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function BetaAccessPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    window.setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 300)
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center">
                <span className="text-sm text-accent font-medium tracking-wide uppercase">Controlled Beta Access</span>
                <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                  Request Beta Access
                </h1>
                <p className="mt-6 text-muted-foreground leading-relaxed text-pretty">
                  DeltaAlpha-TradePro is the public beta gateway of WHALEZ-AI. Access is reviewed before activation so
                  the beta remains controlled, informational, and ready for staged user feedback.
                </p>
              </div>

              <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
                {isSubmitted ? (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground">Application Received</h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      Your beta access request has been recorded for review. Access remains limited and subject to
                      approval before account features are enabled.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Full name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full min-h-[44px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full min-h-[44px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                        placeholder="name@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="intendedUse" className="text-sm font-medium text-foreground">
                        Intended use
                      </label>
                      <textarea
                        id="intendedUse"
                        name="intendedUse"
                        required
                        rows={5}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                        placeholder="Tell us how you plan to use the public beta surface."
                      />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Public beta access remains subject to staged review and controlled activation.
                      </p>
                    </div>

                    <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
                      {isLoading ? "Submitting..." : "Submit Beta Request"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
