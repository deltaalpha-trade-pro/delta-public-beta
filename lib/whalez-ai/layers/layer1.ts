import { config, type WhalesAiRequest, type WhalesAiResponse } from "../config"

/**
 * Layer 1: Core Whalez-AI integration
 * Handles direct AI task execution and engine communication
 *
 * STREAM 2: Engines accept instructions ONLY from Layer 3
 * This layer processes but does not directly instruct engines
 */
export async function layer1(request: WhalesAiRequest): Promise<WhalesAiResponse> {
  // Only accept requests that have passed through Layer 3 and 2
  if (request.classification !== "internal-verified") {
    return {
      success: false,
      error: "Layer 1 only accepts verified internal requests",
      layer: "layer1",
    }
  }

  try {
    const result = await executeTask(request)

    return {
      success: true,
      data: result,
      handledBy: config.orchestrator,
      layer: "layer1",
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      layer: "layer1",
    }
  }
}

async function executeTask(request: WhalesAiRequest): Promise<any> {
  // Core processing - tool results already attached from Layer 2
  const toolResult = request.data?.toolResult

  return {
    task: request.task,
    processed: true,
    toolResult,
    timestamp: new Date().toISOString(),
    orchestrator: config.orchestrator,
  }
}
