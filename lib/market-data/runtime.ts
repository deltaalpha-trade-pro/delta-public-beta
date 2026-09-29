export class MarketDataRuntimeError extends Error {
  readonly status: number;

  constructor(message: string, status = 503) {
    super(message);
    this.name = "MarketDataRuntimeError";
    this.status = status;
  }
}

function runtimeUrl(): string {
  const value = process.env.WHALEZ_RUNTIME_MARKET_DATA_URL?.trim();
  if (!value) throw new MarketDataRuntimeError("market_data_runtime_not_configured");
  return value.replace(/\/$/, "");
}

function runtimeToken(): string {
  const value = process.env.WHALEZ_RUNTIME_MARKET_DATA_TOKEN?.trim();
  if (!value) throw new MarketDataRuntimeError("market_data_runtime_token_not_configured");
  return value;
}

export async function getMarketQuote(
  symbol: string,
  sourceId?: string,
): Promise<unknown> {
  const query = new URLSearchParams({ symbol });
  if (sourceId) query.set("source_id", sourceId);

  let response: Response;
  try {
    response = await fetch(
      `${runtimeUrl()}/v1/market/quote?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "X-WHALEZ-MARKET-DATA-TOKEN": runtimeToken(),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(5_000),
      },
    );
  } catch {
    throw new MarketDataRuntimeError("market_data_runtime_unavailable");
  }

  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const record =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};
    throw new MarketDataRuntimeError(
      typeof record.error === "string"
        ? record.error
        : "market_data_runtime_rejected",
      response.status >= 400 && response.status < 600 ? response.status : 503,
    );
  }

  return body;
}
