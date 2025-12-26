"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown } from "lucide-react"
import type { CandleData, SimulationAsset } from "@/lib/whalez-ai/config"

interface TradingChartProps {
  sessionId?: string
  onSessionCreate?: (sessionId: string) => void
}

const AVAILABLE_ASSETS: SimulationAsset[] = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF", "EUR/GBP"]

export function TradingChart({ sessionId, onSessionCreate }: TradingChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [asset, setAsset] = useState<SimulationAsset>("EUR/USD")
  const [candles, setCandles] = useState<CandleData[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null)
  const [lastPrice, setLastPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Generate initial candles locally (simulation-only, no backend)
  const generateCandle = useCallback((basePrice: number, time: number): CandleData => {
    const volatility = 0.0005
    const change = (Math.random() - 0.5) * 2 * volatility * basePrice
    const open = basePrice
    const close = basePrice + change
    const high = Math.max(open, close) + Math.random() * volatility * basePrice
    const low = Math.min(open, close) - Math.random() * volatility * basePrice
    return {
      time,
      open: Number(open.toFixed(5)),
      high: Number(high.toFixed(5)),
      low: Number(low.toFixed(5)),
      close: Number(close.toFixed(5)),
      volume: Math.floor(Math.random() * 1000 + 100),
    }
  }, [])

  const getBasePrice = useCallback((selectedAsset: SimulationAsset): number => {
    const prices: Record<SimulationAsset, number> = {
      "EUR/USD": 1.085,
      "GBP/USD": 1.27,
      "USD/JPY": 149.5,
      "AUD/USD": 0.655,
      "USD/CHF": 0.88,
      "EUR/GBP": 0.855,
    }
    return prices[selectedAsset]
  }, [])

  const initializeCandles = useCallback(() => {
    const initial: CandleData[] = []
    let price = getBasePrice(asset)
    const now = Date.now()

    for (let i = 100; i > 0; i--) {
      const candle = generateCandle(price, now - i * 60000)
      initial.push(candle)
      price = candle.close
    }

    setCandles(initial)
    setLastPrice(price)
    const newSessionId = `sim_${Date.now()}`
    setCurrentSessionId(newSessionId)
    onSessionCreate?.(newSessionId)
  }, [asset, generateCandle, getBasePrice, onSessionCreate])

  // Draw candlestick chart
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || candles.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = 40
    const candleWidth = Math.max(2, (width - padding * 2) / candles.length - 1)

    // Clear canvas
    ctx.fillStyle = "hsl(var(--background))"
    ctx.fillRect(0, 0, width, height)

    // Calculate price range
    const prices = candles.flatMap((c) => [c.high, c.low])
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    const priceRange = maxPrice - minPrice || 0.001

    const scaleY = (price: number) => height - padding - ((price - minPrice) / priceRange) * (height - padding * 2)

    // Draw grid
    ctx.strokeStyle = "hsl(var(--border))"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (height - padding * 2)) / 4
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Price labels
      const price = maxPrice - (i * priceRange) / 4
      ctx.fillStyle = "hsl(var(--muted-foreground))"
      ctx.font = "10px system-ui"
      ctx.textAlign = "right"
      ctx.fillText(price.toFixed(4), padding - 5, y + 3)
    }

    // Draw candles
    candles.forEach((candle, i) => {
      const x = padding + i * (candleWidth + 1)
      const isGreen = candle.close >= candle.open

      // Wick
      ctx.strokeStyle = isGreen ? "hsl(142 76% 36%)" : "hsl(0 84% 60%)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x + candleWidth / 2, scaleY(candle.high))
      ctx.lineTo(x + candleWidth / 2, scaleY(candle.low))
      ctx.stroke()

      // Body
      ctx.fillStyle = isGreen ? "hsl(142 76% 36%)" : "hsl(0 84% 60%)"
      const bodyTop = scaleY(Math.max(candle.open, candle.close))
      const bodyHeight = Math.max(1, Math.abs(scaleY(candle.open) - scaleY(candle.close)))
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight)
    })
  }, [candles])

  // Tick simulation
  useEffect(() => {
    if (!isRunning || candles.length === 0) return

    intervalRef.current = setInterval(() => {
      setCandles((prev) => {
        const lastCandle = prev[prev.length - 1]
        if (!lastCandle) return prev

        const newCandle = generateCandle(lastCandle.close, Date.now())
        const change = newCandle.close - lastCandle.close
        setLastPrice(newCandle.close)
        setPriceChange(change)

        return [...prev.slice(-99), newCandle]
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, candles.length, generateCandle])

  const handleStart = () => {
    if (candles.length === 0) {
      initializeCandles()
    }
    setIsRunning(true)
  }

  const handlePause = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    initializeCandles()
    setPriceChange(0)
  }

  const handleAssetChange = (newAsset: SimulationAsset) => {
    setAsset(newAsset)
    setIsRunning(false)
    setCandles([])
    setCurrentSessionId(null)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm font-medium text-foreground">Simulation Chart</CardTitle>
            <Badge variant="outline" className="text-xs">
              SIMULATION ONLY
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Select value={asset} onValueChange={(v) => handleAssetChange(v as SimulationAsset)}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ASSETS.map((a) => (
                  <SelectItem key={a} value={a} className="text-xs">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {lastPrice > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-mono font-semibold text-foreground">{lastPrice.toFixed(5)}</span>
            <span
              className={`flex items-center text-xs font-medium ${
                priceChange >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {priceChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
              {priceChange >= 0 ? "+" : ""}
              {(priceChange * 10000).toFixed(1)} pips
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-48 rounded border border-border"
            style={{ width: "100%", height: "192px" }}
          />
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex gap-2">
            {!isRunning ? (
              <Button size="sm" variant="outline" onClick={handleStart} className="h-7 text-xs bg-transparent">
                <Play className="w-3 h-3 mr-1" />
                Start
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={handlePause} className="h-7 text-xs bg-transparent">
                <Pause className="w-3 h-3 mr-1" />
                Pause
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleReset} className="h-7 text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          {currentSessionId && (
            <span className="text-xs text-muted-foreground font-mono">{currentSessionId.slice(0, 16)}...</span>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          This is a simulation-only chart. No live trading. No broker APIs. All data is generated locally.
        </p>
      </CardContent>
    </Card>
  )
}
