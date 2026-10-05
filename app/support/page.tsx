import { HeartHandshake, ShieldCheck } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const channels = [
  { name: "Project support", detail: "Official contribution information will be published here only after Founder Authority verification." },
  { name: "Network and ecosystem work", detail: "Support may help fund engineering, infrastructure, research, security, documentation, and community development." },
  { name: "Verification first", detail: "No wallet address is displayed until the exact network, asset, and destination are explicitly approved for public publication." },
]

export default function SupportPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              <HeartHandshake className="mr-1 h-3.5 w-3.5" /> Ecosystem support
            </Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Support the build</h1>
            <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
              The Whalez-AI Ecosystem is being built as a long-term public project. Support information belongs in one
              controlled place and is published only after the destination has been verified.
            </p>
          </div>

          <Card className="mt-10">
            <CardHeader><CardTitle>Contribution information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {channels.map((channel) => (
                <div key={channel.name} className="rounded-xl border border-border bg-background/70 p-4">
                  <div className="text-sm font-semibold text-foreground">{channel.name}</div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{channel.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Why addresses are intentionally gated</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Cryptocurrency addresses are network-specific and irreversible. The public site will never invent or infer a
              Bitcoin, Ethereum, or USDT destination. The verified address set will be added once the Founder Authority
              confirms the exact destinations and networks.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
