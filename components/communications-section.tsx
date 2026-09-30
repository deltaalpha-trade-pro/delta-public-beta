import Link from "next/link"
import { ArrowUpRight, Globe, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"

const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL?.trim() || "https://t.me/whalez_ai_deltaalpha_trade_pro"

export function CommunicationsSection() {
  return (
    <section id="communications" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm text-accent font-medium tracking-wide uppercase">Communications</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            One clear channel for public updates
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
            Public communications are deliberately limited to channels that are ready to represent the beta. Telegram
            is the current community channel for announcements, ecosystem updates, and platform event distribution.
          </p>
        </div>

        <div className="mt-12 max-w-2xl">
          <article className="rounded-2xl border border-border bg-card/70 p-6 md:p-8 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/30">
            <div className="flex items-start justify-between gap-5">
              <div className="rounded-xl border border-white/10 bg-background/70 p-3 text-primary">
                <Globe className="h-6 w-6" />
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <Radio className="h-3.5 w-3.5" />
                Connected
              </span>
            </div>

            <h3 className="mt-5 text-xl font-semibold text-foreground">Telegram</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Follow the WHALEZ-AI / DeltaAlpha-TradePro community channel for public announcements, beta updates,
              and platform activity delivered through the ecosystem communication layer.
            </p>

            <div className="mt-6">
              <Button asChild className="justify-between">
                <Link href={telegramUrl} target="_blank" rel="noreferrer">
                  <span>Open Telegram</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
