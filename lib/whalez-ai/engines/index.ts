import EmailEngine from "./email-engine"
import SimulationEngine from "./simulation-engine"
import { createGuardedEngine } from "./guarded-engine"

export { EmailEngine }
export { SimulationEngine }
export * from "./email-engine"
export * from "./simulation-engine"
export * from "./guarded-engine"

export const WhalezchainEngine = createGuardedEngine("whalezchain")
export const GmalEngine = createGuardedEngine("gmal")
export const LedgerEngine = createGuardedEngine("ledger")

export const EngineRegistry = {
  email: EmailEngine,
  simulation: SimulationEngine,
  whalezchain: WhalezchainEngine,
  gmal: GmalEngine,
  ledger: LedgerEngine,
}

export type EngineRegistryKey = keyof typeof EngineRegistry

export function getEngine<T extends EngineRegistryKey>(engine: T): (typeof EngineRegistry)[T] {
  return EngineRegistry[engine]
}

export default EngineRegistry
