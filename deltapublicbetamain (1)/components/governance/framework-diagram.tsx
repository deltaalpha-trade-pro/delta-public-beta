"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FrameworkDiagram() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Governance Framework</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Central Node */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mb-8">
              <div className="text-center">
                <p className="text-sm font-bold text-primary">WHALEZ-AI</p>
                <p className="text-xs text-muted-foreground">Core Engine</p>
              </div>
            </div>

            {/* Branches */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-blue-400">PTN</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">Potential Token Rules</p>
              </div>

              <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-emerald-400">PRN</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">Proven Token Rules</p>
              </div>

              <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-amber-400">WHZ</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">Whalez Token Rules</p>
              </div>

              <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mb-2">
                  <span className="text-xs font-bold text-cyan-400">AI</span>
                </div>
                <p className="text-xs text-muted-foreground text-center">AI Decision Rules</p>
              </div>
            </div>
          </div>

          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: -1 }}>
            <line x1="50%" y1="128" x2="12.5%" y2="200" stroke="#2a3441" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="128" x2="37.5%" y2="200" stroke="#2a3441" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="128" x2="62.5%" y2="200" stroke="#2a3441" strokeWidth="1" strokeDasharray="4" />
            <line x1="50%" y1="128" x2="87.5%" y2="200" stroke="#2a3441" strokeWidth="1" strokeDasharray="4" />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
