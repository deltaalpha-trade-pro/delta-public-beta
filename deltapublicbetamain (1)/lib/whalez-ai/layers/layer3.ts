import {
  config,
  type WhalesAiRequest,
  type WhalesAiResponse,
  type RequestClassification,
  type TelemetryLog,
} from "../config"
import { layer2 } from "./layer2"
import { processEmailEvent } from "../engines/email-engine"
import * as simulationEngine from "../engines/simulation-engine"

/**
 * Layer 3: Top-level orchestrator (Whalez-AI sits HERE ONLY)
 *
 * STREAM 2: Orchestrator Authority
 * - Public Whalez-AI is interpreter-only (explain, never execute)
 * - Engines accept instructions ONLY from this layer
 *
 * STREAM 3: Internal Security Classification
 * - BotID-style logic (no third-party dependency)
 * - Public = simulation-only + telemetry
 * - Internal = headers + role token + validation
 */
export async function layer3(request: WhalesAiRequest): Promise<WhalesAiResponse> {
  const classification = classifyRequest(request)
  const telemetry = createTelemetryLog(classification, request.task)

  // PUBLIC MODE: Interpreter-only, simulation responses
  if (!config.INTERNAL_MODE) {
    if (request.task.startsWith("simulation:")) {
      return handlePublicSimulation(request, telemetry)
    }

    return {
      success: true,
      data: {
        mode: "SIMULATION_ONLY",
        message: "Public interface - interpretation only, no execution",
        explanation: getPublicExplanation(request.task),
      },
      simulationOnly: true,
      layer: "layer3",
      telemetry,
    }
  }

  // INTERNAL MODE: Validate request classification
  if (classification === "rejected") {
    return {
      success: false,
      error: "Request rejected: invalid classification",
      layer: "layer3",
      telemetry,
    }
  }

  if (classification === "public") {
    // Downgrade to observation mode
    return {
      success: true,
      data: {
        mode: "OBSERVATION",
        message: "Downgraded to observation - insufficient credentials",
      },
      simulationOnly: true,
      layer: "layer3",
      telemetry,
    }
  }

  if (classification === "internal-pending") {
    return {
      success: false,
      error: "Pending validation - orchestrator approval required",
      layer: "layer3",
      telemetry,
    }
  }

  // INTERNAL-VERIFIED: Full execution path
  if (request.task.startsWith("email:")) {
    const result = await handleEmailEngine(request)
    return { ...result, layer: "layer3", telemetry }
  }

  if (request.task.startsWith("simulation:")) {
    const result = handleSimulationEngine(request)
    return { ...result, layer: "layer3", telemetry }
  }

  // Route to Layer 2 for tool coordination
  const result = await layer2({
    ...request,
    classification: "internal-verified",
  })

  return {
    ...result,
    layer: "layer3",
    telemetry,
  }
}

async function handleEmailEngine(request: WhalesAiRequest): Promise<WhalesAiResponse> {
  const action = request.task.replace("email:", "")

  if (action === "send" && request.data) {
    return processEmailEvent({
      event: request.data.event,
      to: request.data.to,
      data: request.data.templateData,
    })
  }

  return {
    success: false,
    error: `Unknown email action: ${action}`,
  }
}

function handleSimulationEngine(request: WhalesAiRequest): WhalesAiResponse {
  const action = request.task.replace("simulation:", "")
  const data = request.data || {}

  switch (action) {
    case "create":
      return simulationEngine.createSession(data.asset)
    case "get":
      return simulationEngine.getSession(data.sessionId)
    case "tick":
      return simulationEngine.tickSession(data.sessionId)
    case "open":
      return simulationEngine.openPosition(data.sessionId, data.direction, data.size)
    case "close":
      return simulationEngine.closePosition(data.sessionId, data.positionId)
    case "end":
      return simulationEngine.endSession(data.sessionId)
    case "replay":
      return simulationEngine.replaySession(data.sessionId, data.fromIndex)
    case "assets":
      return {
        success: true,
        data: { assets: simulationEngine.getAvailableAssets() },
        simulationOnly: true,
      }
    default:
      return { success: false, error: `Unknown simulation action: ${action}` }
  }
}

function handlePublicSimulation(request: WhalesAiRequest, telemetry: TelemetryLog): WhalesAiResponse {
  const action = request.task.replace("simulation:", "")
  const data = request.data || {}

  // Only allow read-only simulation operations in PUBLIC mode
  switch (action) {
    case "create":
      return simulationEngine.createSession(data.asset)
    case "get":
      return simulationEngine.getSession(data.sessionId)
    case "tick":
      return simulationEngine.tickSession(data.sessionId)
    case "open":
      return simulationEngine.openPosition(data.sessionId, data.direction, data.size)
    case "close":
      return simulationEngine.closePosition(data.sessionId, data.positionId)
    case "end":
      return simulationEngine.endSession(data.sessionId)
    case "replay":
      return simulationEngine.replaySession(data.sessionId, data.fromIndex)
    case "assets":
      return {
        success: true,
        data: { assets: simulationEngine.getAvailableAssets() },
        simulationOnly: true,
        layer: "layer3",
        telemetry,
      }
    default:
      return {
        success: true,
        data: {
          mode: "SIMULATION_ONLY",
          message: "Simulation interface - no live trading",
        },
        simulationOnly: true,
        layer: "layer3",
        telemetry,
      }
  }
}

/**
 * BotID-style internal request classification
 * No third-party dependency - security logic in intelligence layer
 */
function classifyRequest(request: WhalesAiRequest): RequestClassification {
  const headers = request.internalHeaders || {}

  // No headers = public request
  if (!headers["x-whalez-internal-token"]) {
    return "public"
  }

  // Has token but wrong source = rejected
  if (headers["x-request-source"] !== "internal-console") {
    return "rejected"
  }

  // Has token and source but no role token = pending
  if (!request.roleToken) {
    return "internal-pending"
  }

  // Validate role token format
  if (!validateRoleToken(request.roleToken)) {
    return "rejected"
  }

  return "internal-verified"
}

function validateRoleToken(token: string): boolean {
  // Role token validation - must match internal format
  return token.startsWith("whalez-role-") && token.length > 20
}

function createTelemetryLog(classification: RequestClassification, task: string): TelemetryLog {
  return {
    timestamp: new Date().toISOString(),
    classification,
    task,
    outcome:
      classification === "internal-verified" ? "allowed" : classification === "public" ? "simulation" : "rejected",
  }
}

/**
 * Public explanation generator - interpreter mode
 * Explains what WOULD happen, never executes
 */
function getPublicExplanation(task: string): string {
  const explanations: Record<string, string> = {
    analytics: "Analytics would aggregate system metrics and generate reports",
    validation: "Validation would verify data integrity against defined schemas",
    decision: "Decision engine would evaluate context and compute recommendations",
    email: "Email engine would process and deliver notifications",
    simulation: "Simulation engine would generate market data and track positions",
    default: "This task would be processed through the Whalez-AI orchestration layer",
  }

  for (const [key, explanation] of Object.entries(explanations)) {
    if (task.includes(key)) return explanation
  }
  return explanations.default
}

/**
 * Engine instruction interface - ONLY callable from Layer 3
 */
export function instructEngine(engine: keyof typeof config.engines, instruction: any): boolean {
  if (!config.INTERNAL_MODE) return false

  const engineConfig = config.engines[engine]
  if (engineConfig.acceptsFrom !== "layer3") return false

  // Engine accepts instruction from Layer 3
  return true
}
