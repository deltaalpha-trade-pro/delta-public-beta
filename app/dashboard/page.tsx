"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Activity, BarChart3, Landmark, LogOut, ShieldCheck, Wallet } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { authMe, logout, type AuthMe } from "@/lib/auth/client"

const modules = [
  {
    title: "Demo Trading",
    copy: "Place synthetic orders, review virtual funds, and test trading strategies.",
    href: "/trading",
    icon: BarChart3,
  },
  {
    title: "Trading Terminal",
    copy: "Use the public-beta terminal for synthetic trading and settlement simulation.",
    href: "/terminal",
    icon: Activity,
  },
  {
    title: "Banking",
    copy: "Review the public beta banking surface without real custody or settlement execution.",
    href: "/banking",
    icon: Landmark,
  },
  {
    title: "Settlement Simulation",
    copy: "Explore synthetic settlement flows and structural proof mode.",
    href: "/settlement",
    icon: Wallet,
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<AuthMe | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    authMe().then((account) => {
      if (!active) return
      setUser(account)
      setLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  async function handleLogout() {
    await logout()
    window.location.href = "/login"
  }

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden pt-16">
        <div className="glow-orb left-[-10rem] top-24 h-80 w-80 bg-primary/45" />
        <div className="glow-orb right-[-8rem] top-48 h-96 w-96 bg-cyan-400/24" />

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-10 md:p-12">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.32em] text-primary">DeltaAlpha-Trade-Pro</p>
                  <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                    Your public beta dashboard
                  </h1>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                    Your account is connected. Choose a beta surface below and continue into the synthetic trading and
                    financial-intelligence experience.
                  </p>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 text-emerald-300">
                      <ShieldCheck className="h-4 w-4" />
                      {loading ? "Checking account…" : user ? "Authenticated" : "Session expired"}
                    </div>
                    {user ? <p className="mt-1 max-w-xs break-all text-xs text-muted-foreground">{user.email}</p> : null}
                  </div>
                  {user ? (
                    <Button variant="outline" className="min-h-11 rounded-xl" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5 text-sm leading-7 text-amber-100/80">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-1 h-4 w-4 flex-none text-amber-200" />
                  <p>
                    <strong className="font-semibold text-amber-100">Public Beta Simulation:</strong> market data,
                    order entry, virtual funds, exposure, escrow, and settlement outcomes are synthetic. No live trading,
                    broker execution, custody, or real settlement execution is enabled.
                  </p>
                </div>
              </div>

              {!loading && !user ? (
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-muted-foreground">Your session is not active.</p>
                  <Link href="/login?next=/dashboard" className="mt-4 inline-block">
                    <Button className="min-h-11 rounded-xl">Log in again</Button>
                  </Link>
                </div>
              ) : null}

              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {modules.map((module) => {
                  const Icon = module.icon
                  return (
                    <Link key={module.title} href={module.href} className="group glass-card rounded-2xl p-6 transition hover:-translate-y-0.5">
                      <Icon className="h-7 w-7 text-primary" />
                      <h2 className="mt-5 text-lg font-semibold text-foreground">{module.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{module.copy}</p>
                      <span className="mt-5 inline-block text-sm font-medium text-primary group-hover:underline">Open surface →</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
