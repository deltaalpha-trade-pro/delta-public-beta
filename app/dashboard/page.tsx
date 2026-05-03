import Link from "next/link"
import { Activity, BarChart3, Landmark, Lock, Wallet } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

const modules = [
  { title: "Trading", copy: "Market intelligence, signal review, and chart context.", icon: BarChart3 },
  { title: "Investment", copy: "Portfolio modeling, exposure views, and thesis tracking.", icon: Activity },
  { title: "Wallet", copy: "Non-custodial balance visibility and movement history.", icon: Wallet },
  { title: "Bank", copy: "Ledger review, account status, and settlement-aware coordination.", icon: Landmark },
]

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden pt-16">
        <div className="glow-orb left-[-10rem] top-24 h-80 w-80 bg-primary/45" />
        <div className="glow-orb right-[-8rem] top-48 h-96 w-96 bg-cyan-400/24" />

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-10 md:p-12">
              <p className="text-sm font-medium uppercase tracking-[0.32em] text-primary">Controlled dashboard</p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                DeltaAlpha-TradePro dashboard shell
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                This dashboard route is now reachable from navigation. Real account state should be unlocked through
                runplane-auth once the backend bridge is configured and verified.
              </p>

              <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-sm leading-7 text-amber-100/80">
                <div className="flex gap-3">
                  <Lock className="mt-1 h-4 w-4 flex-none text-amber-200" />
                  <p>
                    Access posture: visible shell only. No live trading, custody, settlement execution, broker execution,
                    or founder/private authority is enabled from this public beta route.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {modules.map((module) => {
                  const Icon = module.icon
                  return (
                    <div key={module.title} className="glass-card rounded-2xl p-6">
                      <Icon className="h-7 w-7 text-primary" />
                      <h2 className="mt-5 text-lg font-semibold text-foreground">{module.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.copy}</p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/login">
                  <Button className="min-h-11 rounded-xl">Login</Button>
                </Link>
                <Link href="/founder">
                  <Button variant="outline" className="min-h-11 rounded-xl border-white/15 bg-white/5 backdrop-blur-xl">
                    Founder gate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
