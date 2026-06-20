"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { href: "/deltaalpha", label: "Platform" },
    { href: "/signup", label: "Create Account" },
    { href: "/login", label: "Sign In" },
    { href: "/beta-access", label: "Guided Access" },
  ]

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#081019]/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-white">
          DeltaAlpha-TradePro
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-slate-300 transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </div>

        <button onClick={() => setIsOpen((value) => !value)} className="text-white md:hidden" aria-label="Toggle navigation">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-[#081019] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-white/8 px-4 py-3 text-sm text-slate-200"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </nav>
  )
}
