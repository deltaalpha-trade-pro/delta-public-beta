export type SimulationAsset =
  | "EUR/USD"
  | "GBP/USD"
  | "USD/JPY"
  | "AUD/USD"
  | "USD/CHF"
  | "EUR/GBP"
  | "BTC/USD"
  | "ETH/USD"

export const basePrices: Record<SimulationAsset, number> = {
  "EUR/USD": 1.08,
  "GBP/USD": 1.27,
  "USD/JPY": 149,
  "AUD/USD": 0.66,
  "USD/CHF": 0.88,
  "EUR/GBP": 0.86,
  "BTC/USD": 42000,
  "ETH/USD": 2200,
}

// ---- TEMP ENGINE API STUB (STABILIZATION LAYER) ----

export function getAvailableAssets(): SimulationAsset[] {
  return Object.keys(basePrices) as SimulationAsset[]
}

export function createSession(asset: SimulationAsset) {
  return {
    sessionId: crypto.randomUUID(),
    asset,
    price: basePrices[asset],
    positions: [],
  }
}

export function getSession(sessionId: string) {
  return { sessionId, status: "active" }
}

export function tickSession(sessionId: string) {
  return { sessionId, tick: Date.now() }
}

export function openPosition(sessionId: string, direction: string, size: number) {
  return { sessionId, direction, size, status: "open" }
}

export function closePosition(sessionId: string, positionId: string) {
  return { sessionId, positionId, status: "closed" }
}

export function endSession(sessionId: string) {
  return { sessionId, status: "ended" }
}

export function replaySession(sessionId: string, fromIndex: number) {
  return { sessionId, fromIndex, replay: true }
}
