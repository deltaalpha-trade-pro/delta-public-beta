import type {
  AccountLevel,
  EngineDefinition,
  PlatformEvent,
  PlatformNotice,
  PlatformOnboarding,
  PlatformUserRecord,
  SupportPosture,
} from "@/lib/platform/types"

export const ENGINE_DEFINITIONS: EngineDefinition[] = [
  {
    key: "market-intelligence",
    label: "Market Intelligence",
    summary: "Research streams, signal context, and monitored product availability.",
    minLevel: "core",
    requiresKyc: false,
    requiresActivity: false,
  },
  {
    key: "strategy-workspace",
    label: "Strategy Workspace",
    summary: "Guided strategy workbench with governed access and controlled feature release.",
    minLevel: "pro",
    requiresKyc: true,
    requiresActivity: true,
  },
  {
    key: "portfolio-oversight",
    label: "Portfolio Oversight",
    summary: "Account-state summaries, monitored alerts, and entitlement-aware controls.",
    minLevel: "core",
    requiresKyc: true,
    requiresActivity: false,
  },
  {
    key: "settlement-monitor",
    label: "Settlement Monitor",
    summary: "Restricted operational visibility for qualified accounts under policy clearance.",
    minLevel: "institutional",
    requiresKyc: true,
    requiresActivity: true,
  },
]

export function defaultOnboarding(): PlatformOnboarding {
  return {
    profileCompleted: false,
    policyAccepted: false,
    riskAcknowledged: false,
    walkthroughCompleted: false,
  }
}

export function defaultSupport(): SupportPosture {
  return {
    channel: "Platform support desk",
    responseTarget: "Within one business day",
    escalationAvailable: true,
  }
}

export function welcomeNotices(email: string): PlatformNotice[] {
  const createdAt = new Date().toISOString()

  return [
    {
      id: crypto.randomUUID(),
      title: "Account created",
      body: `Your DeltaAlpha-TradePro profile for ${email} is active. Complete onboarding to unlock additional surfaces.`,
      tone: "positive",
      createdAt,
    },
    {
      id: crypto.randomUUID(),
      title: "Verification required for expanded access",
      body: "Core research access is available after sign-in. Higher-trust surfaces remain gated until verification and policy checks are complete.",
      tone: "attention",
      createdAt,
    },
  ]
}

export function welcomeEvents(): PlatformEvent[] {
  const createdAt = new Date().toISOString()

  return [
    {
      id: crypto.randomUUID(),
      title: "Platform profile initialized",
      body: "A governed platform profile has been created for this account.",
      createdAt,
    },
  ]
}

export function entitlementsForLevel(level: AccountLevel): string[] {
  if (level === "institutional") {
    return ["market-intelligence", "strategy-workspace", "portfolio-oversight", "settlement-monitor"]
  }

  if (level === "pro") {
    return ["market-intelligence", "strategy-workspace", "portfolio-oversight"]
  }

  return ["market-intelligence"]
}

export function productsForLevel(level: AccountLevel): string[] {
  if (level === "institutional") {
    return ["Research Streams", "Strategy Workspace", "Portfolio Oversight", "Settlement Monitor"]
  }

  if (level === "pro") {
    return ["Research Streams", "Strategy Workspace", "Portfolio Oversight"]
  }

  return ["Research Streams"]
}

export function buildNewUser(input: {
  email: string
  passwordHash: string
  hasCredentials?: boolean
  fullName?: string
  company?: string
  accountLevel?: AccountLevel
}): PlatformUserRecord {
  const createdAt = new Date().toISOString()
  const accountLevel = input.accountLevel ?? "core"

  return {
    id: crypto.randomUUID(),
    email: input.email,
    passwordHash: input.passwordHash,
    hasCredentials: input.hasCredentials ?? true,
    fullName: input.fullName ?? "",
    company: input.company ?? "",
    accountLevel,
    kycState: "not_started",
    activityState: "new",
    policyState: "clear",
    entitlements: entitlementsForLevel(accountLevel),
    restrictions: ["onboarding_hold"],
    productAvailability: productsForLevel(accountLevel),
    notices: welcomeNotices(input.email),
    events: welcomeEvents(),
    support: defaultSupport(),
    onboarding: defaultOnboarding(),
    createdAt,
    updatedAt: createdAt,
    lastLoginAt: null,
    recoveryRequestedAt: null,
  }
}
