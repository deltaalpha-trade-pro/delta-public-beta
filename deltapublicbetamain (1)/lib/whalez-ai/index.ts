import { layer3 } from "./layers/layer3"
import { config, type WhalesAiRequest, type WhalesAiResponse } from "./config"

/**
 * Whalez-AI Orchestrator Entry Point
 * Silent internal control layer - no public routes or UI
 */
export async function orchestrator(request: WhalesAiRequest): Promise<WhalesAiResponse> {
  try {
    if (config.INTERNAL_MODE) {
      console.log(`[Whalez-AI] Processing request in ${config.INTERNAL_MODE ? "INTERNAL" : "PUBLIC"} mode`)
    }

    const result = await layer3(request)
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Orchestrator error",
    }
  }
}

export { getAvailableEvents } from "./engines/email-engine"
export { getAvailableAssets } from "./engines/simulation-engine"

// Export types and config for internal use only
export { config } from "./config"
export type { WhalesAiRequest, WhalesAiResponse, SimulationAsset, CandleData } from "./config"
