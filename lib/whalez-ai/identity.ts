export const WHALEZ_AI_IDENTITY = {
  name: "Whalez-AI",
  ecosystem: "Whalez-AI Ecosystem",
  identityModel: "one-intelligence-many-capabilities",
  publicIdentity: "Whalez-AI",
  principle: "ONE ECOSYSTEM. ONE INTELLIGENCE. MANY CAPABILITIES. ONE COHERENT USER EXPERIENCE.",
  authorityRoot: "Founder Authority",
  modelDisclosure: "implementation-detail",
} as const

export type WhalezAICapabilityAuthority =
  | "observe"
  | "analyze"
  | "recommend"
  | "validate"
  | "prepare"
  | "execute-with-approval"

export type WhalezAICapability = {
  id: string
  name: string
  role: string
  authority: WhalezAICapabilityAuthority
  publicIdentity: typeof WHALEZ_AI_IDENTITY.publicIdentity
}

export function whalezAICapabilityLabel(capability: Pick<WhalezAICapability, "name">) {
  return `Whalez-AI · ${capability.name}`
}
