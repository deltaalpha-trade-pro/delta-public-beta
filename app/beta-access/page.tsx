^^\
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
import { useState } from "react" import { 
CheckCircle } from "lucide-react"
                    <div 
                      className="space-y-2"> 
                      <Label 
                      htmlFor="intendedUse" 
                      className="text-foreground"> 
                      <p 
                      className="text-xs 
                      text-muted-foreground 
                      leading-relaxed">
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
                  Join the Beta
                </span>
                <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground text-balance">
                  Request Beta Access
                </h1>
                <p className="mt-6 text-muted-foreground leading-relaxed text-pretty">
                  WHALEZ-AI and DeltaAlpha-Trade-Pro are currently in controlled beta.
                  Submit your application to join our early access program.
                </p>
              </div>

              <div className="mt-12">
                {isSubmitted ? (
                  <div className="p-8 rounded-lg border border-border bg-card text-center">
                    <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-foreground">
                      Application Received
                    </h2>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      Thank you for your interest in WHALEZ-AI. We will review your
                      application and contact you at the provided email address if
                      approved for beta access.
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
              
