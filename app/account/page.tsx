import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, UserRound } from "lucide-react"

export default function AccountPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15"><UserRound className="h-6 w-6 text-primary" /></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Participant</p><h1 className="mt-1 text-3xl font-semibold text-foreground">Account</h1></div>
          </div>
          <Card className="mt-8">
            <CardHeader><CardTitle>Account profile shell</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-background/70 p-4"><div className="text-xs text-muted-foreground">Tier</div><div className="mt-2 font-mono text-lg text-foreground">R0</div></div>
                <div className="rounded-xl border border-border bg-background/70 p-4"><div className="text-xs text-muted-foreground">Verification</div><div className="mt-2 font-mono text-lg text-foreground">V0</div></div>
                <div className="rounded-xl border border-border bg-background/70 p-4"><div className="text-xs text-muted-foreground">Escrow Policy</div><div className="mt-2 text-sm font-medium text-foreground">Governed matrix</div></div>
              </div>
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /><Badge variant="outline">Controlled beta</Badge></div>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">Verification upgrades, risk-tier changes, and escrow ratio changes are intended to be policy-bound and recorded through the ecosystem's governed state rather than changed by client-side UI.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
