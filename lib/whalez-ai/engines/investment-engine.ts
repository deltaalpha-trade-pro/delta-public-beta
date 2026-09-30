export type InvestmentAsset = {
  symbol: "WHZ" | "PTN" | "PRN" | "BTC" | "ETH"
  label: string
  referenceValue: number
  unit: string
  category: "native" | "external"
}

export type InvestmentHolding = InvestmentAsset & { units: number; targetPct: number }

export type InvestmentPortfolio = {
  id: string
  referenceCurrency: "USD"
  holdings: InvestmentHolding[]
  simulatedReturnPct: number
  riskBand: "LOW" | "MODERATE" | "ELEVATED"
}

export const investmentAssets: readonly InvestmentAsset[] = [
  { symbol: "WHZ", label: "Whalez", referenceValue: 1, unit: "WHZ", category: "native" },
  { symbol: "PTN", label: "Plutonium Trade Note", referenceValue: 125, unit: "PTN", category: "native" },
  { symbol: "PRN", label: "Plutoranium Receipt Note", referenceValue: 10, unit: "PRN", category: "native" },
  { symbol: "BTC", label: "Bitcoin", referenceValue: 65000, unit: "BTC", category: "external" },
  { symbol: "ETH", label: "Ethereum", referenceValue: 3200, unit: "ETH", category: "external" },
] as const

export function createDefaultPortfolio(): InvestmentPortfolio {
  return {
    id: "portfolio_demo_" + Date.now(),
    referenceCurrency: "USD",
    simulatedReturnPct: 4.8,
    riskBand: "MODERATE",
    holdings: [
      { ...investmentAssets[0], units: 1000, targetPct: 25 },
      { ...investmentAssets[1], units: 40, targetPct: 30 },
      { ...investmentAssets[2], units: 120, targetPct: 15 },
      { ...investmentAssets[3], units: 0.035, targetPct: 20 },
      { ...investmentAssets[4], units: 1.6, targetPct: 10 },
    ],
  }
}

export function markToReference(holding: InvestmentHolding): number {
  return holding.units * holding.referenceValue
}

export function portfolioValue(portfolio: InvestmentPortfolio): number {
  return portfolio.holdings.reduce((total, holding) => total + markToReference(holding), 0)
}

export function currentWeights(portfolio: InvestmentPortfolio): Record<string, number> {
  const total = portfolioValue(portfolio)
  if (total === 0) return Object.fromEntries(portfolio.holdings.map((h) => [h.symbol, 0]))
  return Object.fromEntries(
    portfolio.holdings.map((holding) => [
      holding.symbol,
      Number(((markToReference(holding) / total) * 100).toFixed(2)),
    ]),
  )
}

export function previewRebalance(portfolio: InvestmentPortfolio) {
  const weights = currentWeights(portfolio)
  return portfolio.holdings.map((holding) => {
    const current = weights[holding.symbol] ?? 0
    return {
      symbol: holding.symbol,
      currentPct: current,
      targetPct: holding.targetPct,
      action: current < holding.targetPct - 0.5 ? "INCREASE" : current > holding.targetPct + 0.5 ? "DECREASE" : "HOLD",
      deltaPct: Number((holding.targetPct - current).toFixed(2)),
    } as const
  })
}

export function simulateMarketTick(portfolio: InvestmentPortfolio): InvestmentPortfolio {
  const drift = portfolio.holdings.map((holding, index) => {
    const factor = 1 + Math.sin(Date.now() / 90000 + index) * 0.004
    return { ...holding, referenceValue: Number((holding.referenceValue * factor).toFixed(6)) }
  })
  const nextValue = drift.reduce((total, holding) => total + markToReference(holding), 0)
  const previousValue = portfolioValue(portfolio)
  const deltaPct = previousValue === 0 ? 0 : ((nextValue - previousValue) / previousValue) * 100
  return { ...portfolio, holdings: drift, simulatedReturnPct: Number((portfolio.simulatedReturnPct + deltaPct).toFixed(2)) }
}

export function engineStatus() {
  return {
    capability: "Investment",
    intelligence: "Whalez-AI",
    mode: "SIMULATION_ONLY",
    custody: false,
    brokerExecution: false,
    settlementExecution: false,
    referenceCurrency: "USD",
  } as const
}