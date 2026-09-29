import { NextResponse } from "next/server";

import {
  getMarketQuote,
  MarketDataRuntimeError,
} from "@/lib/market-data/runtime";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbol = url.searchParams.get("symbol")?.trim();

  if (!symbol) {
    return NextResponse.json(
      { success: false, error: "missing_symbol" },
      { status: 400 },
    );
  }

  try {
    const sourceId = url.searchParams.get("source_id")?.trim() || undefined;
    const data = await getMarketQuote(symbol, sourceId);
    return NextResponse.json(
      {
        success: true,
        marketData: data,
        live: true,
        simulationOnly: false,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof MarketDataRuntimeError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          live: false,
          simulationOnly: false,
        },
        { status: error.status },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "market_data_unavailable",
        live: false,
        simulationOnly: false,
      },
      { status: 503 },
    );
  }
}
