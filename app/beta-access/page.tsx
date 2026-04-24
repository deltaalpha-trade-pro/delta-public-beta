"use client"

import type React from "react"
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"

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
      <main className="min-h-screen bg-background pt-24">
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Request Beta Access
              </h1>
              <p className="mt-3 text-muted-foreground">
                WHALEZ-AI and DeltaAlpha-Trade-Pro are currently in controlled beta.
                Submit your details to request access.
              </p>
            </div>

            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background px-6 py-12 text-center">
                <CheckCircle2 className="mb-4 h-12 w-12" />
                <h2 className="text-xl font-semibold text-foreground">
                  Request received
                </h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Thank you for your interest in WHALEZ-AI. We will review your
                  request and contact you if approved.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" type="text" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intendedUse">Intended Use</Label>
                  <Textarea
                    id="intendedUse"
                    name="intendedUse"
                    placeholder="Tell us how you intend to use WHALEZ-AI / DeltaAlpha-Trade-Pro."
                    className="min-h-[140px]"
                    required
                  />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    DeltaAlpha-Trade-Pro does not execute trades or provide personalized
                    financial advice. All signals and analysis are informational outputs
                    intended to support, not replace, independent decision-making.
                  </p>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
