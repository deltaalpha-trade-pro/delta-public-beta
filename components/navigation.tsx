"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight text-foreground">WHALEZ-AI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Infrastructure <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link href="/whalezchain">Settlement Ledger</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/governance">Constitutional Framework</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                Platform <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-card border-border">
                <DropdownMenuItem asChild>
                  <Link href="/banking">Digital Banking</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/terminal">Execution Terminal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settlement">Settlement Simulation</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/simulation">Ledger Simulations</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/deltaalpha">DeltaAlpha Intelligence</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/legal" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Legal
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/beta-access">Request Access</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation - Founder Console removed */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/banking"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Digital Banking
              </Link>
              <Link
                href="/terminal"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Execution Terminal
              </Link>
              <Link
                href="/settlement"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Settlement Simulation
              </Link>
              <Link
                href="/simulation"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Ledger Simulations
              </Link>
              <Link
                href="/whalezchain"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Settlement Ledger
              </Link>
              <Link
                href="/governance"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Constitutional Framework
              </Link>
              <Link
                href="/deltaalpha"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                DeltaAlpha Intelligence
              </Link>
              <Link
                href="/legal"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Legal
              </Link>
              <Button variant="outline" size="sm" asChild className="w-fit bg-transparent">
                <Link href="/beta-access" onClick={() => setIsOpen(false)}>
                  Request Access
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
<Link href="/legal" className="t-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Legal
              </Link>
              <Button variant="outline" size="sm" asChild className="w-fit bg-transparent">
                <Link href="/beta-access" onClick={() => setIsOpen(false)}>
                  Request Access
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
