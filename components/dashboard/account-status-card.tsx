"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Zap, Clock, AlertTriangle } from "lucide-react"

interface AccountStatusCardProps {
  accountType: string
  status: "ACTIVE_SETTLEMENT" | "SLOW_SETTLEMENT" | "SUSPENDED"
  lockedWhz: number
  requiredWhz: number
  participantId: string
}

export function AccountStatusCard({
  accountType,
  status,
  lockedWhz,
  requiredWhz,
  participantId,
}: AccountStatusCardProps) {
  const isActive = status === "ACTIVE_SETTLEMENT"
  const isSuspended = status === "SUSPENDED"
  const meetsRequirement = lockedWhz >= requiredWhz

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Account Status
          </CardTitle>
          <Badge
            variant="outline"
            className={
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : isSuspended
                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            }
          >
            {isActive ? (
              <>
                <Zap className="w-3 h-3 mr-1" /> Active Settlement
              </>
            ) : isSuspended ? (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" /> Suspended
              </>
            ) : (
              <>
                <Clock className="w-3 h-3 mr-1" /> Slow Settlement
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Account Type</p>
            <p className="text-sm font-medium text-foreground">{accountType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Participant ID</p>
            <p className="text-sm font-mono text-foreground">{participantId}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">WHZ Lock Requirement</span>
            <span className={`text-xs font-medium ${meetsRequirement ? "text-emerald-400" : "text-red-400"}`}>
              {meetsRequirement ? "Satisfied" : "Insufficient"}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${meetsRequirement ? "bg-emerald-500" : "bg-amber-500"}`}
              style={{ width: `${Math.min((lockedWhz / requiredWhz) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{lockedWhz} WHZ locked</span>
            <span className="text-xs text-muted-foreground">{requiredWhz} WHZ required</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
          WHZ is locked as a settlement bond, not spent. Active settlement requires minimum {requiredWhz} WHZ locked.
        </p>
      </CardContent>
    </Card>
  )
}
