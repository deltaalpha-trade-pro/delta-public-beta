export const PUBLIC_AI_SURFACE = {
  identitySource: "Whalez-AI/Whalez-Ai",
  enterpriseOrchestrationSource: "Whalezchain/enterprise-orchestrator",
  chainIdentitySource: "Whalezchain/Whalez-AI",
  chainOrchestrationSource: "Whalezchain/whalezchain-enterprise-orchestrator",
  executionBoundary: "deltaalpha-trade-pro/whalez-ai-core",
  privateSurface: "deltaalpha-trade-pro/founder-console",
  publicSurface: "deltaalpha-trade-pro/delta-public-beta",
  posture: "HYBRID",
  publicMode: "narrator-facing",
  privateMode: "observer-orchestrator-facing",
  simulationOnly: true,
} as const

export type PublicAiPosture = typeof PUBLIC_AI_SURFACE
