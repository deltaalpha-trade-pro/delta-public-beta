"use client"

import type React from "react"
import { useState } from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle } from "lucide-react"

export default function BetaAccessPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      intendedUse: formData.get("intendedUse"),
    }

    try {
      const res = await fetch("/api/beta-access/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Failed to submit beta request")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("Beta access submission error:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <main className="pt-16">
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center">
                <span className="text-sm text-accent font-medium tracking-wide uppercase">
                  Controlled Beta
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                  Request Beta Access
                </h1>
                <p className="mt-6 text-muted-foreground leading-relaxed text-pretty">
                  DeltaAlpha-Trade-Pro is currently operating as a controlled preview environment.
                  Access is being granted in stages while platform behavior, policy posture, and
                  public-facing experience continue to be validated.
                </p>
              </div>

              <div className="mt-12">
                {isSubmitted ? (
                  <div className="p-8 rounded-lg border border-border bg-card text-center">
                    <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-foreground">
                      Request Received
                    </h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      Thank you for your interest. We will review your request and contact you
                      using the email address you provided if you are admitted to the controlled beta.
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
                        placeholder="Enter your email"
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
                        placeholder="Tell us how you intend to use DeltaAlpha-Trade-Pro during beta."
                        className="min-h-[140px] bg-card border-border text-foreground placeholder:text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This request is for preview-stage access only. Admission does not imply live trading,
                        live custody, or unrestricted production access.
                      </p>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full min-h-[44px]">
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
