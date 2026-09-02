import { NextResponse } from "next/server"
import { z } from "zod"
import { orchestrator, type SimulationAsset } from "@/lib/whalez-ai"

export const runtime = "nodejs"

const assets = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CHF", "EUR/GBP", "BTC/USD", "ETH/USD"] as const

const orderSchema = z.object({
  asset: z.enum(assets),
  side: z.enum(["buy", "sell"]),
  size: z.number().finite().positive().max(1_000_000),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = orderSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid simulation order",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const { asset, side, size } = parsed.data
  const direction = side === "buy" ? "long" : "short"

  const created = await orchestrator({
    task: "simulation:create",
    data: { asset: asset as SimulationAsset },
    origin: "/api/public/simulation/order",
  })

  if (!created.success || !created.data?.sessionId) {
    return NextResponse.json(
      { success: false, error: created.error || "Unable to create simulation session", simulationOnly: true },
      { status: 502 },
    )
  }

  const opened = await orchestrator({
    task: "simulation:open",
    data: {
      sessionId: created.data.sessionId,
      direction,
      size,
    },
    origin: "/api/public/simulation/order",
  })

  if (!opened.success) {
    return NextResponse.json(
      {
        success: false,
        error: opened.error || "Unable to open simulated position",
        sessionId: created.data.sessionId,
        simulationOnly: true,
      },
      { status: 502 },
    )
  }

  const verified = await orchestrator({
    task: "simulation:get",
    data: { sessionId: created.data.sessionId },
    origin: "/api/public/simulation/order",
  })

  if (!verified.success) {
    return NextResponse.json(
      {
        success: false,
        error: verified.error || "Simulation verification failed",
        sessionId: created.data.sessionId,
        simulationOnly: true,
      },
      { status: 502 },
    )
  }

  return NextResponse.json({
    success: true,
    simulationOnly: true,
    system: "deltapublicbetamain",
    asset,
    side,
    direction,
    size,
    sessionId: created.data.sessionId,
    position: opened.data,
    verification: {
      verified: true,
      status: verified.data?.status,
      positions: verified.data?.positions,
    },
    telemetry: opened.telemetry,
  })
}
