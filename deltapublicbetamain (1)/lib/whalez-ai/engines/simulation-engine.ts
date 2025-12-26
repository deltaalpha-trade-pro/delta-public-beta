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
 * - FX asset simulation
 * - Candle generation
 * - PnL calculation
 * - Replayable sessions
 *
 * NO live trading. NO broker APIs.
 */

// In-memory session storage (simulation only)
const sessions = new Map<string, SimulationSession>()

/**
 * Create new simulation session
 */
export function createSession(asset: SimulationAsset): WhalesAiResponse {
  if (!config.simulation.assets.includes(asset)) {
    return {
      success: false,
      error: `Invalid asset: ${asset}`,
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
    },
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
    }
  }

  return {
    success: true,
    data: {
      ...session,
      // Generate new candle if session is active
      latestCandle: session.status === "active" ? generateCandle(session) : null,
    },
    simulationOnly: true,
  }
}

/**
 * Open simulated position
 */
export function openPosition(sessionId: string, direction: "long" | "short", size: number): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found" }
  }

  if (session.status !== "active") {
    return { success: false, error: "Session is not active" }
  }

  const latestCandle = session.candles[session.candles.length - 1]
  if (!latestCandle) {
    return { success: false, error: "No price data available" }
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
    return { success: false, error: "Session not found" }
  }

  const position = session.positions.find((p) => p.id === positionId)

  if (!position) {
    return { success: false, error: "Position not found" }
  }

  if (position.closeTime) {
    return { success: false, error: "Position already closed" }
  }

  const latestCandle = session.candles[session.candles.length - 1]
  if (!latestCandle) {
    return { success: false, error: "No price data available" }
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
    return { success: false, error: "Session not found" }
  }

  if (session.status !== "active") {
    return { success: false, error: "Session is not active" }
  }

  // Check max session duration
  if (Date.now() - session.startTime > config.simulation.maxSessionDuration) {
    session.status = "completed"
    return {
      success: true,
      data: { status: "completed", message: "Session duration exceeded" },
      simulationOnly: true,
    }
  }

  const newCandle = generateCandle(session)
  session.candles.push(newCandle)

  // Update open positions with unrealized PnL
  const openPositions = session.positions.filter((p) => !p.closeTime)
  const unrealizedPnL = openPositions.reduce((acc, p) => acc + calculatePnL(p, newCandle.close), 0)

  return {
    success: true,
    data: {
      candle: newCandle,
      openPositions: openPositions.length,
      unrealizedPnL,
      sessionPnL: session.pnl,
    },
    simulationOnly: true,
  }
}

/**
 * End simulation session
 */
export function endSession(sessionId: string): WhalesAiResponse {
  const session = sessions.get(sessionId)

  if (!session) {
    return { success: false, error: "Session not found" }
  }

  // Close all open positions
  const openPositions = session.positions.filter((p) => !p.closeTime)
  const latestCandle = session.candles[session.candles.length - 1]

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
    return { success: false, error: "Session not found" }
  }

  const replayCandles = session.candles.slice(fromIndex)

  return {
    success: true,
    data: {
      sessionId,
      fromIndex,
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

// --- Helper Functions ---

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
  }
  return basePrices[asset]
}

function generateInitialCandles(asset: SimulationAsset, count = 100): CandleData[] {
  const candles: CandleData[] = []
  let price = getBasePrice(asset)
  const now = Date.now()

  for (let i = count; i > 0; i--) {
    const candle = generateCandleFromPrice(price, now - i * 60000)
    candles.push(candle)
    price = candle.close
  }

  return candles
}

function generateCandle(session: SimulationSession): CandleData {
  const lastCandle = session.candles[session.candles.length - 1]
  const basePrice = lastCandle?.close ?? getBasePrice(session.asset)
  return generateCandleFromPrice(basePrice, Date.now())
}

function generateCandleFromPrice(basePrice: number, time: number): CandleData {
  const volatility = 0.0005 // 0.05% per candle
  const change = (Math.random() - 0.5) * 2 * volatility * basePrice

  const open = basePrice
  const close = basePrice + change
  const high = Math.max(open, close) + Math.random() * volatility * basePrice
  const low = Math.min(open, close) - Math.random() * volatility * basePrice
  const volume = Math.floor(Math.random() * 1000 + 100)

  return {
    time,
    open: Number(open.toFixed(5)),
    high: Number(high.toFixed(5)),
    low: Number(low.toFixed(5)),
    close: Number(close.toFixed(5)),
    volume,
  }
}

function calculatePnL(position: SimulationPosition, currentPrice: number): number {
  const priceDiff = currentPrice - position.entryPrice
  const direction = position.direction === "long" ? 1 : -1
  return priceDiff * direction * position.size * 10000 // pip value
}
