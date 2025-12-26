import {
  config,
  type WhalesAiRequest,
  type WhalesAiResponse,
  type RequestClassification,
  type TelemetryLog,
  type AuditLog,
} from "../config"
import { layer2 } from "./layer2"
import { processEmailEvent } from "../engines/email-engine"
import * as simulationEngine from "../engines/simulation-engine"

/**
 * Layer 3: Top-level orchestrator (Whalez-AI sits HERE ONLY)
 *
 * PHASE 4A: Hard-lock PUBLIC execution
 * - All execution intents in PUBLIC mode return simulation-only response
 * - Audit logging for denied actions
 * - Engines can ONLY be invoked from this layer
 */

// Audit log storage (server-only, in-memory for now)
const auditLogs: AuditLog[] = []

export async function layer3(request: WhalesAiRequest): Promise<WhalesAiResponse> {
  const classification = classifyRequest(request)
  const telemetry = createAuditLog(classification, request)

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4A: HARD-LOCK PUBLIC EXECUTION AT ABSOLUTE ENTRY POINT
  // ═══════════════════════════════════════════════════════════════════════════
  if (!config.INTERNAL_MODE) {
    // Log denied action (server-only, silent)
    logDeniedAction(telemetry, request)

    // Only allow simulation:* tasks in PUBLIC mode
    if (request.task.startsWith("simulation:")) {
      return handlePublicSimulation(request, telemetry)
    }

    // ALL other execution intents: immediate rejection with simulation-only response
    return {
      success: true,
      data: {
        mode: "SIMULATION_ONLY",
        reason: "PUBLIC_MODE_ENFORCED",
        message: "Execution is disabled in Delta Public Beta",
        system: "deltapublicbetamain",
        explanation: getEducationalExplanation(request.task),
      },
      simulationOnly: true,
      layer: "layer3",
      telemetry,
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL MODE: Validate request classification
  // ═══════════════════════════════════════════════════════════════════════════
  if (classification === "rejected") {
    logDeniedAction(telemetry, request)
    return {
      success: false,
      error: "Request rejected: invalid classification",
      layer: "layer3",
      telemetry,
    }
  }

  if (classification === "public") {
    logDeniedAction(telemetry, request)
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

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERNAL-VERIFIED: Full execution path (Layer 3 only)
  // ═══════════════════════════════════════════════════════════════════════════
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

/**
 * Global execution guard - engines throw if not invoked from Layer 3
 */
export function instructEngine(engine: keyof typeof config.engines, instruction: any): boolean {
  // Engines MUST throw if invoked directly (not from Layer 3)
  const callerIsLayer3 = checkCallerIsLayer3()

  if (!callerIsLayer3) {
    throw new Error(`SECURITY VIOLATION: Engine ${engine} invoked outside Layer 3`)
  }

  if (!config.INTERNAL_MODE) {
    throw new Error(`EXECUTION DENIED: Engine ${engine} cannot execute in PUBLIC mode`)
  }

  const engineConfig = config.engines[engine]
  if (engineConfig.acceptsFrom !== "layer3") {
    throw new Error(`ENGINE ERROR: ${engine} does not accept instructions`)
  }

  return true
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
      return {
        ...simulationEngine.createSession(data.asset),
        layer: "layer3",
        telemetry,
      }
    case "get":
      return {
        ...simulationEngine.getSession(data.sessionId),
        layer: "layer3",
        telemetry,
      }
    case "tick":
      return {
        ...simulationEngine.tickSession(data.sessionId),
        layer: "layer3",
        telemetry,
      }
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
          reason: "PUBLIC_MODE_ENFORCED",
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

function createAuditLog(classification: RequestClassification, request: WhalesAiRequest): TelemetryLog {
  return {
    timestamp: new Date().toISOString(),
    classification,
    task: request.task,
    route: request.origin || "unknown",
    outcome: classification === "internal-verified" ? "allowed" : classification === "public" ? "denied" : "rejected",
  }
}

function logDeniedAction(telemetry: TelemetryLog, request: WhalesAiRequest): void {
  // Server-only logging (silent, no user-facing output)
  if (process.env.NODE_ENV !== "test") {
    console.log("[WHALEZ-AI] DENIED:", {
      timestamp: telemetry.timestamp,
      route: telemetry.route,
      intent: request.task,
      classification: telemetry.classification,
      outcome: telemetry.outcome,
    })
  }
}

function getEducationalExplanation(task: string): string {
  const explanations: Record<string, string> = {
    analytics:
      "Analytics engines aggregate system metrics across settlements, measuring throughput, latency, and integrity scores. This helps identify bottlenecks and optimize performance.",
    validation:
      "Validation engines verify data integrity using cryptographic proofs and schema enforcement. Each transaction is checked against business rules before settlement.",
    decision:
      "Decision engines evaluate risk context and compute recommendations based on historical patterns, market conditions, and compliance requirements.",
    email:
      "Email automation handles notifications for beta access, simulation updates, and system notices. All emails are templated and audited.",
    simulation:
      "Simulation engines generate realistic market data and track positions without live trading. This demonstrates system behavior under stress without financial risk.",
    trading:
      "Trading simulations demonstrate order execution logic, risk management, and PnL calculation. All data is synthetic - no real brokers or live markets are involved.",
    default:
      "This task would be processed through the Whalez-AI orchestration layer, where Layer 3 coordinates with engines and tools to execute the requested operation.",
  }

  for (const [key, explanation] of Object.entries(explanations)) {
    if (task.includes(key)) return explanation
  }
  return explanations.default
}

// Helper to check if caller is Layer 3 (simplified for demo)
function checkCallerIsLayer3(): boolean {
  // In production, use stack trace analysis or explicit caller tokens
  return true // Simplified for now - assumes all calls through layer3 entry point
}
