import type { WhalesAiResponse } from "../config"

export type GuardedEngineName = "whalezchain" | "gmal" | "ledger"
export type GuardedAction = "read" | "simulate" | "write" | "execute" | "settle" | "send"

export interface GuardedEngineRequest {
  action: GuardedAction | string
  payload?: unknown
  invocationSource?: string
  reason?: string
}

export interface GuardedEngineResult extends WhalesAiResponse {
  success: false
  simulationOnly: true
  data: {
    engine: GuardedEngineName
    action: string
    acceptedFrom: "layer3"
    executionAllowed: false
    publicBeta: true
  }
}

export function denyPublicExecution(engine: GuardedEngineName, req: GuardedEngineRequest): GuardedEngineResult {
  return {
    success: false,
    error: `${engine} execution is disabled on the public beta surface.`,
    simulationOnly: true,
    data: {
      engine,
      action: req.action,
      acceptedFrom: "layer3",
      executionAllowed: false,
      publicBeta: true,
    },
  }
}

export function createGuardedEngine(engine: GuardedEngineName) {
  return {
    engine,
    isEnabled: () => false,
    canExecute: () => false,
    execute: (req: GuardedEngineRequest) => denyPublicExecution(engine, req),
    simulate: (payload?: unknown) => denyPublicExecution(engine, { action: "simulate", payload }),
  }
}
