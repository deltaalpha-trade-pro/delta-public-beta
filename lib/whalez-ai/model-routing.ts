import type { WhalezAICapabilityAuthority } from "./identity"

export type WhalezAIModelAdapter = {
  id: string
  capabilityIds: readonly string[]
  authority: WhalezAICapabilityAuthority
  enabled: boolean
}

export type WhalezAIRouteDecision = {
  capabilityId: string
  modelAdapterId: string
  publicIdentity: "Whalez-AI"
}

export const WHALEZ_AI_MODEL_ADAPTERS: readonly WhalezAIModelAdapter[] = []

export function publicWhalezAIIdentity(): "Whalez-AI" {
  return "Whalez-AI"
}
