export type EscrowAsset = "WHZ" | "PTN" | "PRN" | "USDC"
export type EscrowType = "TRADE" | "SERVICE" | "SETTLEMENT" | "CONVERSION"
export type EscrowStage = "CREATED" | "BOND_CHECKED" | "HELD" | "PRE_SETTLEMENT" | "FINALITY_WAIT" | "RELEASED" | "REFUNDED" | "FAILED"

export type EscrowSimulation = {
  id: string
  type: EscrowType
  asset: EscrowAsset
  amount: number
  counterparty: string
  whzBondRequired: number
  stage: EscrowStage
  stepIndex: number
  simulationOnly: true
  failureReason?: string
}

const stages: readonly EscrowStage[] = ["CREATED", "BOND_CHECKED", "HELD", "PRE_SETTLEMENT", "FINALITY_WAIT", "RELEASED"]

export function createEscrowSimulation(
  input?: Partial<Pick<EscrowSimulation, "type" | "asset" | "amount" | "counterparty">>,
): EscrowSimulation {
  const amount = Math.max(0, input?.amount ?? 1000)
  return {
    id: "escrow_demo_" + Date.now(),
    type: input?.type ?? "SETTLEMENT",
    asset: input?.asset ?? "PRN",
    amount,
    counterparty: input?.counterparty ?? "Demo Counterparty",
    whzBondRequired: Number((amount * 0.02).toFixed(4)),
    stage: "CREATED",
    stepIndex: 0,
    simulationOnly: true,
  }
}

export function advanceEscrow(simulation: EscrowSimulation): EscrowSimulation {
  if (["RELEASED", "REFUNDED", "FAILED"].includes(simulation.stage)) return simulation
  const nextIndex = Math.min(simulation.stepIndex + 1, stages.length - 1)
  return { ...simulation, stepIndex: nextIndex, stage: stages[nextIndex] }
}

export function refundEscrow(simulation: EscrowSimulation, reason = "Finality condition not satisfied"): EscrowSimulation {
  return { ...simulation, stage: "REFUNDED", failureReason: reason }
}

export function failEscrow(simulation: EscrowSimulation, reason = "Simulation safety gate triggered"): EscrowSimulation {
  return { ...simulation, stage: "FAILED", failureReason: reason }
}

export function escrowProgress(simulation: EscrowSimulation): number {
  if (simulation.stage === "RELEASED") return 100
  if (simulation.stage === "REFUNDED" || simulation.stage === "FAILED") return Math.min(simulation.stepIndex * 20, 100)
  return Math.round((simulation.stepIndex / (stages.length - 1)) * 100)
}

export function engineStatus() {
  return {
    capability: "Escrow & Settlement Coordination",
    intelligence: "Whalez-AI",
    mode: "SIMULATION_ONLY",
    whzBond: "SIMULATED",
    externalCustody: false,
    externalSettlement: false,
    chainFinality: "NOT_CLAIMED",
  } as const
}