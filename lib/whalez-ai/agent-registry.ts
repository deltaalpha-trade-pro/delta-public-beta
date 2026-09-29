import type { WhalezAICapabilityAuthority } from "./identity"

export type WhalezAIAgent = {
  id: string
  name: string
  capabilityId: string
  authority: WhalezAICapabilityAuthority
  publicIdentity: "Whalez-AI"
}

// Agent roles are delegated functions of one Whalez-AI identity.
// Concrete model/provider bindings remain private implementation detail.
export const WHALEZ_AI_AGENTS: readonly WhalezAIAgent[] = [
  { id: "execution-agent", name: "Execution", capabilityId: "execution", authority: "execute-with-approval", publicIdentity: "Whalez-AI" },
  { id: "state-validation-agent", name: "State Validation", capabilityId: "state-validation", authority: "validate", publicIdentity: "Whalez-AI" },
  { id: "economic-validation-agent", name: "Economic Validation", capabilityId: "economic-validation", authority: "validate", publicIdentity: "Whalez-AI" },
  { id: "security-integrity-agent", name: "Security & Integrity", capabilityId: "security-integrity", authority: "validate", publicIdentity: "Whalez-AI" },
  { id: "governance-compliance-agent", name: "Governance & Compliance", capabilityId: "governance-compliance", authority: "validate", publicIdentity: "Whalez-AI" },
  { id: "chain-history-agent", name: "Chain History", capabilityId: "chain-history", authority: "observe", publicIdentity: "Whalez-AI" },
  { id: "consensus-coordinator-agent", name: "Consensus Coordination", capabilityId: "consensus-coordinator", authority: "prepare", publicIdentity: "Whalez-AI" },
] as const

export function getWhalezAIAgent(id: string) {
  return WHALEZ_AI_AGENTS.find((agent) => agent.id === id)
}

export function publicWhalezAIAgentIdentity(): "Whalez-AI" {
  return "Whalez-AI"
}
