import Link from "next/link"
import { ArrowUpRight, MessageSquare, Send, Smartphone } from "lucide-react"
import { TidioSupportButton } from "@/components/tidio-support-button"

const tidioAvailable = Boolean(process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY?.trim())
const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL?.trim()
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || ""
const telegramAvailable = Boolean(telegramUrl && /^https:\/\/t\.me\/[\w+\-]+$/.test(telegramUrl))
const whatsappUrl = whatsappNumber ? "https://wa.me/" + whatsappNumber : null

export function CommunicationsSection() {
  return (
    <section id="communications" className="border-t border-white/10 bg-card py-20" aria-labelledby="support-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-widest text-primary">Customer support</p>
        <h2 id="support-heading" className="mt-3 text-3xl font-semibold">Help is within reach</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          Contact the DeltaAlpha customer support team through configured public channels.
          Account and payment questions require identity verification. Private operational systems are not public support channels.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-border bg-background p-6">
            <MessageSquare className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">Tidio chat</h3>
            <p className="mt-2 min-h-12 text-sm text-muted-foreground">Chat with customer service when the support widget is configured.</p>
            <div className="mt-4">{tidioAvailable ? <TidioSupportButton label="Open Tidio support" /> : <span className="text-xs text-muted-foreground">Not configured</span>}</div>
          </article>
          <article className="rounded-xl border border-border bg-background p-6">
            <Send className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">Telegram</h3>
            <p className="mt-2 min-h-12 text-sm text-muted-foreground">Public updates and community channels; support response availability is not guaranteed.</p>
            <div className="mt-4">{telegramAvailable && telegramUrl ? <a className="inline-flex items-center gap-2 text-sm text-primary underline" href={telegramUrl} target="_blank" rel="noopener noreferrer">Open Telegram <ArrowUpRight className="h-4 w-4" /></a> : <span className="text-xs text-muted-foreground">Pending configuration</span>}</div>
          </article>
          <article className="rounded-xl border border-border bg-background p-6">
            <Smartphone className="h-6 w-6 text-primary" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">WhatsApp Business</h3>
            <p className="mt-2 min-h-12 text-sm text-muted-foreground">Planned support channel. Availability requires verified provider setup and customer consent.</p>
            <div className="mt-4">{whatsappUrl ? <a className="inline-flex items-center gap-2 text-sm text-primary underline" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Open WhatsApp <ArrowUpRight className="h-4 w-4" /></a> : <span className="text-xs text-muted-foreground">Pending configuration</span>}</div>
          </article>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">For account access, use the <Link className="underline" href="/login">verified login</Link> or <Link className="underline" href="/beta-access">access request</Link> flow. This section does not expose internal mail, Admin or Founder routes.</p>
      </div>
    </section>
  )
}
