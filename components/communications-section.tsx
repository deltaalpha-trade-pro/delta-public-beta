import Link from "next/link"
import { MessagesSquare, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TidioSupportButton } from "@/components/tidio-support-button"

const telegramUrl =
  process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL?.trim() ||
  "https://t.me/whalez_ai_deltaalpha_trade_pro"
const tidioConfigured = Boolean(process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY?.trim())

export function CommunicationsSection() {
  return (
    <section id="communications" className="py-16 md:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card/70 p-6 md:p-8">
          <div className="max-w-2xl">
            <span className="text-sm text-accent font-medium tracking-wide uppercase">
              Public support
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Need help with the public beta?
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Use the customer chat or our public community channel for general questions and beta updates.
              Internal operations, mail routing, and private platform controls are not exposed here.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {tidioConfigured ? (
              <TidioSupportButton label="Open customer chat" />
            ) : (
              <p className="rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground">
                Customer chat is not available in this deployment.
              </p>
            )}
            <Button asChild variant="outline" className="justify-between">
              <Link href={telegramUrl} target="_blank" rel="noreferrer">
                <span>Community updates</span>
                <Send className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
