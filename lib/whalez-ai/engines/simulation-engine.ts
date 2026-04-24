import {
  config,
  type SimulationAsset,
  type CandleData,
  type SimulationSession,
  type SimulationPosition,
  type WhalesAiResponse,
} from "../config"

/**
 * Simulation Trading Engine
 * Accepts commands ONLY from Layer 3 (Whalez-AI)
 *
 * Features:
 * - Public beta asset simulation
 * - Candle generation
 * - PnL calculation
 * - Replayable sessions
 * - Session pause/resume
 * - Public-safe synthetic account summary
 *
 * NO live trading. NO broker APIs. NO custody.
 */

export type SimulationDirection = "long" | "short"
export type SimulationStatus = SimulationSession["status"]

export interface SimulationRiskSummary {
  openPositions: number
  closedPositions: number
  realizedPnL: number
  unrealizedPnL: number
  equity: number
  exposure: number
}

// In-memory session storage (simulation only)
const sessions = new Map<string, SimulationSession>()

/**
 * Create new simulation session
 */
export function createSession(asset: SimulationAsset): WhalesAiResponse {
  if (!isSupportedAsset(asset)) {
    return {
      success: false,
      error: `Invalid asset: ${asset}`,
      simulationOnly: true,
    }
  }

  const sessionId = generateSessionId()
  const session: SimulationSession = {
    id: sessionId,
    asset,
    startTime: Date.now(),
    candles: generateInitialCandles(asset),
    positions: [],
    pnl: 0,
    status: "active",
  }

  sessions.set(sessionId, session)

  return {
    success: true,
    data: {
      sessionId,
      asset,
      initialCandles: session.candles.length,
      status: "active",
      latestCandle: session.candles.at(-1),
      risk: getRiskSummary(session),
    },
    simulationOnly: true,
  }
}

/**
 * List in-memory sessions for the current runtime instance.
 */
export function listSessions(): WhalesAiResponse {
  return {
    success: true,
    data: Array.from(sessions.values()).map((session) => ({
      id: session.id,
      asset: session.asset,
      status: session.status,
      startTime: session.startTime,
      candles: session.candles.length,
      positions: session.positions.length,
      risk: getRiskSummary(session),
    })),
    simulationOnly: true,
  }
}

/**
 * Get session data
 */
export function getSession(sessionId: string): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return {
      success: false,
      error: "Session not found",
      simulationOnly: true,
    }
  }

  return {
    success: true,
    data: {
      ...session,
      latestCandle: session.candles.at(-1) ?? null,
      risk: getRiskSummary(session),
    },
    simulationOnly: true,
  }
}

/**
 * Open simulated position
 */
export function openPosition(sessionId: string, direction: SimulationDirection, size: number): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found", simulationOnly: true }
  }

  if (session.status !== "active") {
    return { success: false, error: "Session is not active", simulationOnly: true }
  }

  if (!Number.isFinite(size) || size <= 0) {
    return { success: false, error: "Position size must be greater than zero", simulationOnly: true }
  }

  const latestCandle = session.candles.at(-1)
  if (!latestCandle) {
    return { success: false, error: "No price data available", simulationOnly: true }
  }

  const position: SimulationPosition = {
    id: generatePositionId(),
    asset: session.asset,
    direction,
    entryPrice: latestCandle.close,
    size,
    openTime: Date.now(),
  }

  session.positions.push(position)

  return {
    success: true,
    data: {
      positionId: position.id,
      direction,
      entryPrice: position.entryPrice,
      size,
      risk: getRiskSummary(session),
    },
    simulationOnly: true,
  }
}

/**
 * Close simulated position
 */
export function closePosition(sessionId: string, positionId: string): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found", simulationOnly: true }
  }

  const position = session.positions.find((p) => p.id === positionId)

  if (!position) {
    return { success: false, error: "Position not found", simulationOnly: true }
  }

  if (position.closeTime) {
    return { success: false, error: "Position already closed", simulationOnly: true }
  }

  const latestCandle = session.candles.at(-1)
  if (!latestCandle) {
    return { success: false, error: "No price data available", simulationOnly: true }
  }

  const closePrice = latestCandle.close
  const pnl = calculatePnL(position, closePrice)

  position.closePrice = closePrice
  position.closeTime = Date.now()
  position.pnl = pnl

  session.pnl += pnl

  return {
    success: true,
    data: {
      positionId,
      closePrice,
      pnl,
      sessionPnL: session.pnl,
      risk: getRiskSummary(session),
    },
    simulationOnly: true,
  }
}

/**
 * Generate next candle for session
 */
export function tickSession(sessionId: string): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found", simulationOnly: true }
  }

  if (session.status !== "active") {
    return { success: false, error: "Session is not active", simulationOnly: true }
  }

  if (Date.now() - session.startTime > config.simulation.maxSessionDuration) {
    session.status = "completed"
    return {
      success: true,
      data: { status: "completed", message: "Session duration exceeded", risk: getRiskSummary(session) },
      simulationOnly: true,
    }
  }

  const newCandle = generateCandle(session)
  session.candles.push(newCandle)

  return {
    success: true,
    data: {
      candle: newCandle,
      risk: getRiskSummary(session),
      sessionPnL: session.pnl,
    },
    simulationOnly: true,
  }
}

/**
 * Pause simulation session
 */
export function pauseSession(sessionId: string): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found", simulationOnly: true }
  }

  if (session.status !== "active") {
    return { success: false, error: "Only active sessions can be paused", simulationOnly: true }
  }

  session.status = "paused"

  return {
    success: true,
    data: { sessionId, status: session.status, risk: getRiskSummary(session) },
    simulationOnly: true,
  }
}

/**
 * Resume simulation session
 */
export function resumeSession(sessionId: string): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found", simulationOnly: true }
  }

  if (session.status !== "paused") {
    return { success: false, error: "Only paused sessions can be resumed", simulationOnly: true }
  }

  session.status = "active"

  return {
    success: true,
    data: { sessionId, status: session.status, risk: getRiskSummary(session) },
    simulationOnly: true,
  }
}

/**
 * End simulation session
 */
export function endSession(sessionId: string): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found", simulationOnly: true }
  }

  const openPositions = session.positions.filter((p) => !p.closeTime)
  const latestCandle = session.candles.at(-1)

  for (const position of openPositions) {
    if (latestCandle) {
      position.closePrice = latestCandle.close
      position.closeTime = Date.now()
      position.pnl = calculatePnL(position, latestCandle.close)
      session.pnl += position.pnl
    }
  }

  session.status = "completed"

  return {
    success: true,
    data: {
      sessionId,
      status: "completed",
      totalPnL: session.pnl,
      totalTrades: session.positions.length,
      duration: Date.now() - session.startTime,
      risk: getRiskSummary(session),
    },
    simulationOnly: true,
  }
}

/**
 * Replay session from candle history
 */
export function replaySession(sessionId: string, fromIndex = 0): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found", simulationOnly: true }
  }

  const safeFromIndex = Math.max(0, Math.floor(fromIndex))
  const replayCandles = session.candles.slice(safeFromIndex)

  return {
    success: true,
    data: {
      sessionId,
      fromIndex: safeFromIndex,
      candles: replayCandles,
      totalCandles: session.candles.length,
    },
    simulationOnly: true,
  }
}

/**
 * Get available assets (public-safe)
 */
export function getAvailableAssets(): readonly SimulationAsset[] {
  return config.simulation.assets
}

/**
 * Delete a completed simulation session from in-memory storage.
 */
export function clearSession(sessionId: string): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found", simulationOnly: true }
  }

  if (session.status !== "completed") {
    return { success: false, error: "Only completed sessions can be cleared", simulationOnly: true }
  }

  sessions.delete(sessionId)

  return {
    success: true,
    data: { sessionId, cleared: true },
    simulationOnly: true,
  }
}

export const SimulationEngine = {
  createSession,
  listSessions,
  getSession,
  openPosition,
  closePosition,
  tickSession,
  pauseSession,
  resumeSession,
  endSession,
  replaySession,
  clearSession,
  getAvailableAssets,
}

export default SimulationEngine

// --- Helper Functions ---

function isSupportedAsset(asset: string): asset is SimulationAsset {
  return (config.simulation.assets as readonly string[]).includes(asset)
}

function generateSessionId(): string {
  return `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function generatePositionId(): string {
  return `pos_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function getBasePrice(asset: SimulationAsset): number {
  const basePrices: Record<SimulationAsset, number> = {
    "EUR/USD": 1.085,
    "GBP/USD": 1.27,
    "USD/JPY": 149.5,
    "AUD/USD": 0.655,
    "USD/CHF": 0.88,
    "EUR/GBP": 0.855,
    "BTC/USD": 63500,
    "ETH/USD": 3100,
  }
  return basePrices[asset]
}

function getVolatility(asset: SimulationAsset): number {
  if (asset === "BTC/USD") return 0.003
  if (asset === "ETH/USD") return 0.0035
  return 0.0005
}

function getPricePrecision(asset: SimulationAsset): number {
  if (asset === "BTC/USD" || asset === "ETH/USD") return 2
  if (asset.includes("JPY")) return 3
  return 5
}

function generateInitialCandles(asset: SimulationAsset, count = 100): CandleData[] {
  const candles: CandleData[] = []
  let price = getBasePrice(asset)
  const now = Date.now()

  for (let i = count; i > 0; i--) {
    const candle = generateCandleFromPrice(asset, price, now - i * 60000)
    candles.push(candle)
    price = candle.close
  }

  return candles
}

function generateCandle(session: SimulationSession): CandleData {
  const lastCandle = session.candles.at(-1)
  const basePrice = lastCandle?.close ?? getBasePrice(session.asset)
  return generateCandleFromPrice(session.asset, basePrice, Date.now())
}

function generateCandleFromPrice(asset: SimulationAsset, basePrice: number, time: number): CandleData {
  const volatility = getVolatility(asset)
  const precision = getPricePrecision(asset)
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice

  const open = basePrice
  const close = Math.max(basePrice + change, 0.00001)
  const high = Math.max(open, close) + Math.random() * volatility * basePrice
  const low = Math.max(Math.min(open, close) - Math.random() * volatility * basePrice, 0.00001)
  const volume = Math.floor(Math.random() * 1000 + 100)

  return {
    time,
    open: Number(open.toFixed(precision)),
    high: Number(high.toFixed(precision)),
    low: Number(low.toFixed(precision)),
    close: Number(close.toFixed(precision)),
    volume,
  }
}

function calculatePnL(position: SimulationPosition, currentPrice: number): number {
  const priceDiff = currentPrice - position.entryPrice
  const direction = position.direction === "long" ? 1 : -1
  const multiplier = position.asset === "BTC/USD" || position.asset === "ETH/USD" ? 1 : 10000
  return Number((priceDiff * direction * position.size * multiplier).toFixed(2))
}

function getRiskSummary(session: SimulationSession): SimulationRiskSummary {
  const latestCandle = session.candles.at(-1)
  const openPositions = session.positions.filter((p) => !p.closeTime)
  const closedPositions = session.positions.filter((p) => p.closeTime)
  const unrealizedPnL = latestCandle
    ? openPositions.reduce((acc, position) => acc + calculatePnL(position, latestCandle.close), 0)
    : 0
  const exposure = openPositions.reduce((acc, position) => acc + position.entryPrice * position.size, 0)

  return {
    openPositions: openPositions.length,
    closedPositions: closedPositions.length,
    realizedPnL: Number(session.pnl.toFixed(2)),
    unrealizedPnL: Number(unrealizedPnL.toFixed(2)),
    equity: Number((session.pnl + unrealizedPnL).toFixed(2)),
    exposure: Number(exposure.toFixed(2)),
  }
}
