import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Mail, MessagesSquare, Smartphone, Globe, ShieldCheck } from "lucide-react"

const telegramUrl = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL?.trim() || "https://t.me/whalez_ai_deltaalpha_trade_pro"
const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || ""
const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "https://wa.me/"
const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_URL?.trim() || ""
const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || ""
const mailSurfaceUrl = process.env.NEXT_PUBLIC_WHALEZ_MAIL_URL?.trim() || "/mail"
const statusApiUrl = "/api/status"
const tidioConfigured = Boolean(process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY?.trim())
const metaPixelConfigured = Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim())

const cards = [
  {
    title: "Tidio live support",
    icon: MessagesSquare,
    status: tidioConfigured ? "Available" : "Not connected",
    body: "Live support is shown here only when the public support channel is configured for the beta.",
    link: "#",
    cta: tidioConfigured ? "Open support" : "Unavailable",
    disabled: !tidioConfigured,
  },
  {
    title: "Telegram channel",
    icon: Globe,
    status: "Connected",
    body: "Use Telegram for public announcements, community updates, and beta communications.",
    link: telegramUrl,
    cta: "Open Telegram",
  },
  {
    title: "Business WhatsApp",
    icon: Smartphone,
    status: whatsappNumber ? "Connected" : "Not connected",
    body: "WhatsApp Business is available for high-touch support only when the public channel is configured.",
    link: whatsappUrl,
    cta: whatsappNumber ? "Open WhatsApp" : "Unavailable",
    disabled: !whatsappNumber,
  },
  {
    title: "Meta Facebook / Instagram",
    icon: ArrowUpRight,
    status: metaPixelConfigured || facebookUrl || instagramUrl ? "Available" : "Not connected",
    body: "Social links and optional measurement are activated only when the corresponding public configuration exists.",
    link: facebookUrl || instagramUrl || "#",
    cta: facebookUrl ? "Open Facebook" : instagramUrl ? "Open Instagram" : "Unavailable",
    disabled: !facebookUrl && !instagramUrl,
  },
  {
    title: "Public status",
    icon: ShieldCheck,
    status: "Available",
    body: "Review the public status surface to see which supported communications integrations are currently available.",
    link: statusApiUrl,
    cta: "Open status",
  },
  {
    title: "Whalez-mail",
    icon: Mail,
    status: "Available",
    body: "Public communications surface for structured beta correspondence and future workflow routing.",
    link: mailSurfaceUrl,
    cta: "Open Whalez-mail",
  },
]

export function CommunicationsSection() {
  return (
    <section id="communications" className="py-24 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-sm text-accent font-medium tracking-wide uppercase">Communications</span>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Public communication channels
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
            Available channels are shown according to the current public-beta configuration. Internal configuration names
            and operational controls are intentionally kept out of the public experience.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5">
          {cards.map((card) => {
            const Icon = card.icon
            const isDisabled = card.disabled ?? false

            return (
              <article
                key={card.title}
                className="rounded-2xl border border-border bg-card/70 p-5 shadow-sm transition-transform hover:-translate-y-1 hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl border border-white/10 bg-background/70 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {card.status}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-foreground">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>

                <div className="mt-5">
                  {isDisabled ? (
                    <Button variant="outline" className="w-full justify-between" disabled>
                      <span>{card.cta}</span>
                    </Button>
                  ) : (
                    <Button asChild variant="default" className="w-full justify-between">
                      <Link href={card.link} target={card.link.startsWith("/") ? undefined : "_blank"} rel="noreferrer">
                        <span>{card.cta}</span>
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
