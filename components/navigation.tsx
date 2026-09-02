"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EcosystemMark, WhalezchainMark, DeltaAlphaMark } from "@/components/brand-marks"

const publicLinks = [
  { href: "/#communications", label: "Communications" },
  { href: "/#product-surface", label: "Products" },
  { href: "/whalezchain", label: "Ledger" },
  { href: "/mail", label: "Whalez-mail" },
]

const accessLinks = [
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign up" },
  { href: "/dashboard", label: "Dashboard" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/45">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <EcosystemMark className="h-8 w-8 text-primary" />
            <div className="leading-tight">
              <span className="block text-sm font-semibold tracking-[0.24em] text-foreground">WHALEZ-AI</span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                DeltaAlpha-TradePro
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {publicLinks.slice(0, 2).map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                Infrastructure <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="glass-panel">
                <DropdownMenuItem asChild>
                  <Link href="/whalezchain" className="flex items-center gap-2">
                    <WhalezchainMark className="h-4 w-4 text-primary" />
                    Settlement Ledger
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mail" className="flex items-center gap-2">
                    <DeltaAlphaMark className="h-4 w-4 text-primary" />
                    Whalez-mail
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/beta-access">
              <Button variant="outline" size="sm" className="w-fit bg-white/5 border-white/15 backdrop-blur-xl">
                Request Access
              </Button>
            </Link>
          </div>

          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
            className="md:hidden rounded-xl border border-white/10 bg-white/5 p-2 text-foreground backdrop-blur-xl"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="md:hidden border-t border-white/10 bg-background/90 px-4 py-5 backdrop-blur-2xl">
          <div className="glass-panel rounded-2xl p-4 shadow-2xl">
            <div className="grid gap-2">
              <p className="px-3 text-xs uppercase tracking-[0.24em] text-primary">Public</p>
              {publicLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-5 grid gap-2 border-t border-white/10 pt-4">
              <p className="px-3 text-xs uppercase tracking-[0.24em] text-primary">Access</p>
              {accessLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <p className="px-3 pt-2 text-xs leading-relaxed text-muted-foreground">
                Private founder and internal routes are not exposed on the public deployment.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  )
}
