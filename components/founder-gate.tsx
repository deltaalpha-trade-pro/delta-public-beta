import Link from "next/link"
import { Lock, ShieldCheck } from "lucide-react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"

export function FounderGate({ variant }: { variant: "public" | "internal" }) {
  const isInternal = variant === "internal"

  return (
    <>
      <Navigation />
      <main className="relative min-h-screen overflow-hidden pt-16">
        <div className="glow-orb left-[-10rem] top-24 h-80 w-80 bg-primary/50" />
        <div className="glow-orb right-[-8rem] top-48 h-96 w-96 bg-cyan-400/30" />

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="glass-panel rounded-[2rem] p-6 sm:p-10 md:p-12">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary backdrop-blur-xl">
                {isInternal ? <ShieldCheck className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
              </div>

              <p className="text-sm font-medium uppercase tracking-[0.32em] text-primary">
                {isInternal ? "Internal founder path" : "Founder gate"}
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {isInternal ? "Founder access is routed through the protected control plane." : "Founder access is visible, but authority remains gated."}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                This surface intentionally exposes the route for navigation and review. It does not activate private authority,
                live execution, custody, settlement, or internal system control from the public beta deployment.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-sm font-semibold text-foreground">Route status</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Available in the public shell for controlled founder navigation.</p>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-sm font-semibold text-foreground">Auth posture</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Requires runplane-auth before real founder session access.</p>
                </div>
                <div className="glass-card rounded-2xl p-5">
                  <p className="text-sm font-semibold text-foreground">Execution posture</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">No public route grants private or irreversible authority.</p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/login">
                  <Button className="min-h-11 rounded-xl">Login through access layer</Button>
                </Link>
                <Link href="/beta-access">
                  <Button variant="outline" className="min-h-11 rounded-xl border-white/15 bg-white/5 backdrop-blur-xl">
                    Request beta access
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
