"use client"

import type React from "react"
import { useState } from "react"
import { CheckCircle, ShieldAlert } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export default function BetaAccessPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [requestEmail, setRequestEmail] = useState("")
  const [submissionId, setSubmissionId] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const nextSubmissionId =
      submissionId ||
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : "submission-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12))
    setSubmissionId(nextSubmissionId)

    try {
      const response = await fetch("/api/beta-access/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          intendedUse: String(formData.get("intendedUse") || "").trim(),
          submissionId: nextSubmissionId,
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.ok || !result.request_id) {
        throw new Error(result.error || "The beta access service did not confirm your request.")
      }

      setRequestId(String(result.request_id))
      setRequestEmail(String(formData.get("email") || "").trim())
      setIsSubmitted(true)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to submit the request. Please try again later.",
      )
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
                <span className="text-sm text-accent font-medium tracking-wide uppercase">Founder-reviewed access</span>
                <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                  Request DeltaAlpha access
                </h1>
                <p className="mt-6 text-muted-foreground leading-relaxed text-pretty">
                  Submit your request for review. It is routed to the private Founder access queue; submitting a request does not itself grant access or enable financial execution.
                </p>
              </div>

              <div className="mt-12 rounded-2xl border border-border bg-card p-6 md:p-8">
                {isSubmitted ? (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground">Request sent for Founder review</h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      The access service confirmed that your request was recorded. The Founder will review it, and the decision notice will be sent to {requestEmail}.
                    </p>
                    {requestId ? (
                      <p className="mt-4 text-xs text-muted-foreground">
                        Reference: <span className="font-mono">{requestId}</span>
                      </p>
                    ) : null}
                    <p className="mt-4 text-xs text-muted-foreground">
                      Approval notification and account entitlement synchronization are separate steps.
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
                        maxLength={120}
                        autoComplete="name"
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
                        maxLength={254}
                        autoComplete="email"
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
                        maxLength={1800}
                        rows={5}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                        placeholder="Tell us how you plan to use DeltaAlpha-TradePro."
                      />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your information is submitted for access review. Do not include passwords, API keys, or other secrets.
                      </p>
                    </div>

                    {errorMessage ? (
                      <div role="alert" className="flex items-start gap-2 rounded-md border border-red-900/70 bg-red-950/30 px-3 py-3 text-sm text-red-200">
                        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    ) : null}

                    <Button type="submit" className="w-full min-h-[44px]" disabled={isLoading}>
                      {isLoading ? "Submitting request..." : "Submit for Founder review"}
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
