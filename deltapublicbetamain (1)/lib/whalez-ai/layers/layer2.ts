import { config, type WhalesAiRequest, type WhalesAiResponse } from "../config"
import { layer1 } from "./layer1"
import { toolAlpha } from "../tools/tool-alpha"
import { toolBeta } from "../tools/tool-beta"
import { toolGamma } from "../tools/tool-gamma"

/**
 * Layer 2: Middleware & tool coordination
 * Routes tasks to appropriate internal tools
 *
 * STREAM 2: Tools report upward to Whalez-AI, never sideways
 */
export async function layer2(request: WhalesAiRequest): Promise<WhalesAiResponse> {
  // Only accept requests from Layer 3 with verified classification
  if (request.classification !== "internal-verified") {
    return {
      success: false,
      error: "Layer 2 only accepts verified internal requests from Layer 3",
      layer: "layer2",
    }
  }

  try {
    const tool = determineToolForTask(request.task)
    const toolResult = await executeTool(tool, request.data)

    // Pass to Layer 1 with tool result
    const result = await layer1({
      ...request,
      data: { ...request.data, toolResult },
    })

    // Report upward (mandatory reporting to Whalez-AI)
    reportToOrchestrator(tool, toolResult)

    return {
      ...result,
      layer: "layer2",
      handledBy: tool.codename,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      layer: "layer2",
    }
  }
}

type ToolConfig = typeof config.tools.alpha | typeof config.tools.beta | typeof config.tools.gamma

function determineToolForTask(task: string): ToolConfig {
  if (task.includes("analytics") || task.includes("monitor")) {
    return config.tools.alpha
  }
  if (task.includes("validate") || task.includes("verification")) {
    return config.tools.beta
  }
  if (task.includes("decision") || task.includes("ai")) {
    return config.tools.gamma
  }
  return config.tools.alpha // Default
}

async function executeTool(tool: ToolConfig, data: any): Promise<any> {
  switch (tool.codename) {
    case "ALPHA-SENTINEL":
      return toolAlpha.execute(data)
    case "BETA-VALIDATOR":
      return toolBeta.execute(data)
    case "GAMMA-ARBITER":
      return toolGamma.execute(data)
    default:
      return { executed: false }
  }
}

function reportToOrchestrator(tool: ToolConfig, result: any): void {
  // Mandatory reporting - tools report upward, never sideways
  // Silent in production, logged in development
  if (process.env.NODE_ENV === "development" && config.INTERNAL_MODE) {
    console.log(`[${tool.codename}] Reporting to ${config.orchestrator}:`, {
      scope: tool.scope,
      authority: tool.authority,
      result: result.success ?? true,
    })
  }
}
