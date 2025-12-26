export const config = {
  // Mode control via environment
  INTERNAL_MODE: process.env.WHALEZ_MODE === "INTERNAL",

  // Domain awareness
  domains: {
    public: "beta.*",
    internal: "internal.*",
  },

  // System identity - ONE system, not multiple AIs
  orchestrator: "Whalez-AI",

  // Internal tools with unique codenames and scoped authority
  tools: {
    alpha: {
      codename: "ALPHA-SENTINEL",
      scope: "analytics",
      authority: ["read:metrics", "write:logs"],
    },
    beta: {
      codename: "BETA-VALIDATOR",
      scope: "validation",
      authority: ["read:data", "validate:schemas"],
    },
    gamma: {
      codename: "GAMMA-ARBITER",
      scope: "decision",
      authority: ["read:context", "compute:decisions"],
    },
  },

  // Engines - accept instructions ONLY from Layer 3
  engines: {
    whalezchain: { acceptsFrom: "layer3" },
    gmal: { acceptsFrom: "layer3" },
    ledger: { acceptsFrom: "layer3" },
    email: { acceptsFrom: "layer3" },
    simulation: { acceptsFrom: "layer3" },
  },

  // Layer hierarchy
  layers: {
    top: "layer3",
    middle: "layer2",
    core: "layer1",
  },

  // Security classification
  security: {
    requireInternalHeaders: true,
    validateOrigin: true,
    publicBehavior: "simulation-only",
    internalBehavior: "full-execution",
  },

  // Email engine configuration
  email: {
    events: ["beta_request", "beta_approved", "waitlist", "simulation_update"] as const,
    provider: process.env.EMAIL_PROVIDER || "resend",
  },

  // Simulation engine configuration
  simulation: {
    assets: ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF", "EUR/GBP"] as const,
    maxSessionDuration: 3600000, // 1 hour in ms
    candleIntervals: ["1m", "5m", "15m", "1h", "4h"] as const,
  },
} as const

// Request classification types
export type RequestClassification = "public" | "internal-verified" | "internal-pending" | "rejected"

export type WhalesAiRequest = {
  task: string
  data?: any
  internalHeaders?: Record<string, string>
  origin?: string
  roleToken?: string
  classification?: RequestClassification
}

export type WhalesAiResponse = {
  success: boolean
  data?: any
  handledBy?: string
  layer?: string
  error?: string
  simulationOnly?: boolean
  telemetry?: TelemetryLog
}

export type TelemetryLog = {
  timestamp: string
  classification: RequestClassification
  task: string
  outcome: "allowed" | "rejected" | "simulation"
}

// Email engine configuration
export type EmailEvent = (typeof config.email.events)[number]

// Simulation engine configuration
export type SimulationAsset = (typeof config.simulation.assets)[number]

export type CandleData = {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type SimulationSession = {
  id: string
  asset: SimulationAsset
  startTime: number
  candles: CandleData[]
  positions: SimulationPosition[]
  pnl: number
  status: "active" | "paused" | "completed"
}

export type SimulationPosition = {
  id: string
  asset: SimulationAsset
  direction: "long" | "short"
  entryPrice: number
  size: number
  openTime: number
  closePrice?: number
  closeTime?: number
  pnl?: number
}
