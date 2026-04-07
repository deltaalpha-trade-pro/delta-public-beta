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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight">
              DeltaAlpha
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                Platform Preview <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/deltaalpha">DeltaAlpha Preview</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/whalezchain">Settlement Preview</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/beta-access">
              <Button variant="outline" size="sm" className="w-fit bg-transparent">
                Request Access
              </Button>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen ? (
          <div className="md:hidden border-t border-border py-4 flex flex-col gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/deltaalpha" className="text-sm text-muted-foreground hover:text-foreground">
              DeltaAlpha Preview
            </Link>
            <Link href="/whalezchain" className="text-sm text-muted-foreground hover:text-foreground">
              Settlement Preview
            </Link>
            <Link href="/beta-access">
              <Button variant="outline" size="sm" className="w-fit bg-transparent">
                Request Access
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
