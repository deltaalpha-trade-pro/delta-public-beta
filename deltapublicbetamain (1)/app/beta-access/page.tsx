"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { CheckCircle } from "lucide-react"

export default function BetaAccessPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission - ready for backend integration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsLoading(false)
    setIsSubmitted(true)
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center">
                <span className="text-sm text-accent font-medium tracking-wide uppercase">Join the Beta</span>
                <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                  Request Beta Access
                </h1>
                <p className="mt-6 text-muted-foreground leading-relaxed text-pretty">
                  WHALEZ-AI and DeltaAlpha-TradePro are currently in controlled beta. Submit your application to join
                  our early access program.
                </p>
              </div>

              <div className="mt-12">
                {isSubmitted ? (
                  <div className="p-8 rounded-lg border border-border bg-card text-center">
                    <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-foreground">Application Received</h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      Thank you for your interest in WHALEZ-AI. We will review your application and contact you at the
                      provided email address if approved for beta access.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your full name"
                        className="min-h-[44px] bg-card border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email address"
                        className="min-h-[44px] bg-card border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="intendedUse" className="text-foreground">
                        Intended Use
                      </Label>
                      <Textarea
                        id="intendedUse"
                        name="intendedUse"
                        required
                        placeholder="Describe how you plan to use WHALEZ-AI and DeltaAlpha-TradePro. Include your background and experience with financial analysis tools."
                        rows={5}
                        className="bg-card border-border text-foreground placeholder:text-muted-foreground resize-none"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        By submitting this form, you acknowledge that WHALEZ-AI is an experimental platform in beta
                        development. Access is granted at our discretion and may be limited or revoked at any time. This
                        is not an application for a financial service.
                      </p>
                    </div>

                    <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
                      {isLoading ? "Submitting..." : "Submit Application"}
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
