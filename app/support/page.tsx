"use client"\n\nimport { useState } from "react"\nimport { HeartHandshake, ShieldCheck, Copy, Check } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"\nimport Image from "next/image"

const donationRoutes = [
  {
    asset: "BTC",
    network: "Bitcoin",
    address: "3N6WZqKwgG1zVAXAugPrMtugdFqxRrUKYY",
    note: "Send BTC only on the Bitcoin network.",
  },
  {
    asset: "ETH",
    network: "Ethereum",
    address: "0x421C49DbafC7B94f193c71C919A14e801A1318A7",
    note: "Send ETH only on the Ethereum network.",
  },
  {
    asset: "USDT",
    network: "Ethereum · ERC-20",
    address: "0x421C49DbafC7B94f193c71C919A14e801A1318A7",
    note: "Send USDT using Ethereum ERC-20.",
  },
  {
    asset: "USDT",
    network: "BNB Smart Chain · BEP-20",
    address: "0xf1313d753F84cF17E69d25052F6f56f1338f04F6",
    note: "Send USDT using BNB Smart Chain BEP-20.",
  },
  {
    asset: "USDT",
    network: "TRON · TRC-20",
    address: "TRQsWSVaHKXeNWpCokiFdAD3bUrBc851Rt",
    note: "Send USDT using TRON TRC-20.",
  },
]

export default function SupportPage() {\n  const [copied, setCopied] = useState<string | null>(null)\n\n  async function copyAddress(address: string, key: string) {\n    try {\n      await navigator.clipboard.writeText(address)\n      setCopied(key)\n      window.setTimeout(() => setCopied(null), 1600)\n    } catch {\n      setCopied(null)\n    }\n  }
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
              Support the Whalez-AI Ecosystem&apos;s engineering, infrastructure, research, security, documentation,
              and community development.
            </p>
          </div>

          <Card className="mt-10">
            <CardHeader>
              <CardTitle>Crypto donation addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {donationRoutes.map((route) => (
                <div key={route.network} className="rounded-xl border border-border bg-background/70 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{route.asset}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{route.network}</div>
                    </div>
                    <Copy className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="mt-3 break-all rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs text-foreground">
                    {route.address}
                  </div>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">{route.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Network safety</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Crypto transfers are irreversible. Always verify the asset and network before sending. Never send BTC to an
              Ethereum address, or send ERC-20, BEP-20, or TRC-20 USDT through the wrong network. The Whalez-AI Ecosystem
              does not promise returns or financial outcomes for contributions.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
