import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, ShieldCheck, Inbox, Workflow } from "lucide-react"
import { EcosystemMark } from "@/components/brand-marks"

const mailHighlights = [
  {
    icon: Inbox,
    title: "Inbox routing",
    copy: "Investor, partner, founder, and operations messages are separated into clear lanes instead of one mixed inbox.",
  },
  {
    icon: ShieldCheck,
    title: "Protected review",
    copy: "Sensitive items can be staged for review before being surfaced to the rest of the ecosystem.",
  },
  {
    icon: Workflow,
    title: "Action wiring",
    copy: "Mail can be connected to follow-up workflows for support, approvals, and task capture.",
  },
]

export default function MailPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-xl">
              <EcosystemMark className="h-5 w-5 text-primary" />
              Whalez-mail
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl text-balance">
              The Whalez-mail surface is now wired into the public ecosystem.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground text-pretty">
              This page becomes the canonical mail and communications entry point for the Whalez-AI ecosystem. It is
              designed to grow into inbox routing, escalation handling, workflow triggers, and founder-controlled review.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/#communications">
                  <Mail className="mr-2 h-4 w-4" />
                  View communications wiring
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  Back to DeltaAlpha-TradePro
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {mailHighlights.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-2xl border border-border bg-card/70 p-6 shadow-sm">
                <div className="inline-flex rounded-xl border border-white/10 bg-background/70 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
