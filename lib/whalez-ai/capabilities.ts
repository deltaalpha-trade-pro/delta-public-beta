import type { WhalezAICapability } from "./identity"

export const WHALEZ_AI_CAPABILITIES: readonly WhalezAICapability[] = [
  { id: "intelligence-core", name: "Intelligence Core", role: "reasoning, orchestration, routing and context synthesis", authority: "analyze", publicIdentity: "Whalez-AI" },
  { id: "execution", name: "Execution", role: "prepare and coordinate authorized transaction execution", authority: "execute-with-approval", publicIdentity: "Whalez-AI" },
  { id: "state-validation", name: "State Validation", role: "validate canonical state transitions and receipts", authority: "validate", publicIdentity: "Whalez-AI" },
  { id: "economic-validation", name: "Economic Validation", role: "validate market, valuation and economic constraints", authority: "validate", publicIdentity: "Whalez-AI" },
  { id: "security-integrity", name: "Security & Integrity", role: "detect integrity violations and security anomalies", authority: "validate", publicIdentity: "Whalez-AI" },
  { id: "governance-compliance", name: "Governance & Compliance", role: "enforce policy, eligibility and delegated authority boundaries", authority: "validate", publicIdentity: "Whalez-AI" },
  { id: "chain-history", name: "Chain History", role: "retrieve and reconcile WhalezChain provenance and receipt history", authority: "observe", publicIdentity: "Whalez-AI" },
  { id: "consensus-coordinator", name: "Consensus Coordination", role: "coordinate validation and finality workflows without becoming sovereign authority", authority: "prepare", publicIdentity: "Whalez-AI" },
] as const

export function getWhalezAICapability(id: string) {
  return WHALEZ_AI_CAPABILITIES.find((capability) => capability.id === id)
}
