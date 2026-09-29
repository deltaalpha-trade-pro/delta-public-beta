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
    const marketData =
      data && typeof data === "object"
        ? (data as Record<string, unknown>)
        : {};
    const quotes = Array.isArray(marketData.quotes) ? marketData.quotes : [];
    const live = quotes.some(
      (item) =>
        item &&
        typeof item === "object" &&
        (item as Record<string, unknown>).stale === false &&
        String((item as Record<string, unknown>).status || "").toUpperCase() === "LIVE",
    );

    return NextResponse.json(
      {
        success: true,
        marketData,
        live,
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
