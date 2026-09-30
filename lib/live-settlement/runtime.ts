export class SettlementRuntimeError extends Error {
  readonly status: number;

  constructor(message: string, status = 503) {
    super(message);
    this.name = "SettlementRuntimeError";
    this.status = status;
  }
}

function runtimeUrl(): string {
  const value = process.env.WHALEZ_RUNTIME_SETTLEMENT_URL?.trim();
  if (!value) throw new SettlementRuntimeError("private_runtime_not_configured");
  return value.replace(/\/$/, "");
}

function runtimeToken(): string {
  const value = process.env.WHALEZ_RUNTIME_SETTLEMENT_TOKEN?.trim();
  if (!value) throw new SettlementRuntimeError("private_runtime_token_not_configured");
  return value;
}

export async function postSettlementRuntime(
  path: string,
  payload: Record<string, unknown>,
): Promise<any> {
  let response: Response;

  try {
    response = await fetch(`${runtimeUrl()}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WHALEZ-SETTLEMENT-TOKEN": runtimeToken(),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new SettlementRuntimeError("private_runtime_unavailable");
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const status =
      response.status >= 400 && response.status < 600 ? response.status : 503;
    throw new SettlementRuntimeError(
      typeof body?.error === "string" ? body.error : "private_runtime_rejected",
      status,
    );
  }

  return body;
}
