"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="border-b border-border bg-card/80 px-4 py-2 text-center text-xs text-muted-foreground">
        Public beta: informational market intelligence only. No live trade execution or custody is active during beta.
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">
              DeltaAlpha
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>

            <Link href="/trust-safety" className="text-sm text-muted-foreground hover:text-foreground">
              Trust & Safety
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                Infrastructure <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/whalezchain">Settlement Ledger</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/beta-access">
              <Button
                variant="outline"
                size="sm"
                className="w-fit bg-transparent"
              >
                Request Access
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen ? (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/trust-safety" className="block text-sm text-muted-foreground hover:text-foreground">
              Trust & Safety
            </Link>
            <Link href="/whalezchain" className="block text-sm text-muted-foreground hover:text-foreground">
              Settlement Ledger
            </Link>
            <Link href="/beta-access" className="block text-sm text-muted-foreground hover:text-foreground">
              Request Access
            </Link>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
