import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"

export default function FounderConsolePage() {
  return (
    <>
      <Navigation />
      <main className="pt-20 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Founder Console</h1>
              <p className="text-sm text-muted-foreground">
                Private operational surface (secured behind Cloudflare Access + internal controls).
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
              Internal
            </Badge>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Minimal console is live. Next steps: Requests Inbox, Outbox (manual email drafts), System Health, Audit
              Timeline, Allocation Overview.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
