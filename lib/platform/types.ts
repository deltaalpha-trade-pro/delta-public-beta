export type AccountLevel = "core" | "pro" | "institutional"

export type KycState = "not_started" | "pending" | "approved" | "restricted"

export type ActivityState = "new" | "active" | "dormant" | "paused"

export type PolicyState = "clear" | "review" | "restricted"

export type RestrictionCode =
  | "none"
  | "onboarding_hold"
  | "kyc_required"
  | "policy_review"
  | "activity_pause"

export type EngineKey =
  | "market-intelligence"
  | "strategy-workspace"
  | "portfolio-oversight"
  | "settlement-monitor"

export type EngineGate =
  | "available"
  | "onboarding_required"
  | "verification_required"
  | "activity_required"
  | "policy_review"
  | "restricted"

export type PlatformNoticeTone = "neutral" | "attention" | "positive"

export type PlatformNotice = {
  id: string
  title: string
  body: string
  tone: PlatformNoticeTone
  createdAt: string
}

export type PlatformEvent = {
  id: string
  title: string
  body: string
  createdAt: string
}

export type SupportPosture = {
  channel: string
  responseTarget: string
  escalationAvailable: boolean
}

export type PlatformOnboarding = {
  profileCompleted: boolean
  policyAccepted: boolean
  riskAcknowledged: boolean
  walkthroughCompleted: boolean
}

export type PlatformUserRecord = {
  id: string
  email: string
  passwordHash: string
  hasCredentials: boolean
  fullName: string
  company: string
  accountLevel: AccountLevel
  kycState: KycState
  activityState: ActivityState
  policyState: PolicyState
  entitlements: string[]
  restrictions: RestrictionCode[]
  productAvailability: string[]
  notices: PlatformNotice[]
  events: PlatformEvent[]
  support: SupportPosture
  onboarding: PlatformOnboarding
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
  recoveryRequestedAt: string | null
}

export type PlatformSessionRecord = {
  id: string
  userId: string
  createdAt: string
}

export type PlatformStore = {
  users: PlatformUserRecord[]
  sessions: PlatformSessionRecord[]
}

export type EngineDefinition = {
  key: EngineKey
  label: string
  summary: string
  minLevel: AccountLevel
  requiresKyc: boolean
  requiresActivity: boolean
}

export type PlatformEngineState = EngineDefinition & {
  gate: EngineGate
  reason: string
}

export type PublicPlatformState = {
  user: {
    id: string
    email: string
    fullName: string
    company: string
    accountLevel: AccountLevel
    kycState: KycState
    activityState: ActivityState
    policyState: PolicyState
  }
  onboarding: PlatformOnboarding
  productAvailability: string[]
  entitlements: string[]
  restrictions: RestrictionCode[]
  notices: PlatformNotice[]
  events: PlatformEvent[]
  support: SupportPosture
  engines: PlatformEngineState[]
}
