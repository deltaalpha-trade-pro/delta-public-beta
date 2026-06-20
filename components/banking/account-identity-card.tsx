"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Fingerprint, Clock, CheckCircle } from "lucide-react"

export function AccountIdentityCard() {
  // Simulated account data
  const account = {
    participantId: "WHL-0042-BETA",
    accountClass: "Settlement Participant",
    jurisdiction: "Sovereign Ledger Zone",
    createdAt: "2024-01-15T10:30:00Z",
    status: "VERIFIED",
    kycLevel: "Structural Beta",
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account Identity
          </CardTitle>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            {account.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <Fingerprint className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Participant ID</span>
            </div>
            <p className="text-sm font-mono text-foreground">{account.participantId}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Account Class</span>
            </div>
            <p className="text-sm text-foreground">{account.accountClass}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Member Since</span>
            </div>
            <p className="text-sm text-foreground">
              {new Date(account.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
          Account identity is ledger-native. No external wallet connection required. All operations are recorded via
          double-entry accounting.
        </p>
      </CardContent>
    </Card>
  )
}
