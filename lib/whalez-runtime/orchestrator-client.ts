import crypto from "node:crypto";

export type RuntimeLedgerPayload = {
  from_account: string;
  to_account: string;
  asset_symbol: "WHZ" | "PTN" | "PRN";
  amount: string | number;
};

export type RuntimeActor = {
  user_id: string;
  risk_tier: "R0" | "R1" | "R2" | "R3";
  verification_level: "V0" | "V1" | "V2" | "V3";
};

export type OrchestratorCommand = {
  operation: "ledger.write";
  idempotencyKey: string;
  actor: RuntimeActor;
  payload: RuntimeLedgerPayload;
};

export type OrchestratorResponse = {
  status: number;
  ok: boolean;
  body: unknown;
};

function getOrchestratorUrl(): string {
  const value = process.env.WHALEZ_ORCHESTRATOR_URL?.trim().replace(/\/$/, "");
  if (!value) {
    throw new Error("WHALEZ_ORCHESTRATOR_URL is not configured");
  }
  return value;
}

function getOrchestratorApiKey(): string {
  const value = process.env.WHALEZ_ORCHESTRATOR_API_KEY?.trim();
  if (!value) {
    throw new Error("WHALEZ_ORCHESTRATOR_API_KEY is not configured");
  }
  return value;
}

export async function orchestrate(command: OrchestratorCommand): Promise<OrchestratorResponse> {
  const correlationId = crypto.randomUUID();
  const url = `${getOrchestratorUrl()}/orchestrate`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-Key": getOrchestratorApiKey(),
        "X-Request-ID": correlationId,
        "X-Idempotency-Key": command.idempotencyKey,
      },
      body: JSON.stringify({
        message: command.operation,
        context: {
          source: "deltaalpha-trade-pro",
          correlation_id: correlationId,
          idempotency_key: command.idempotencyKey,
          actor: command.actor,
          payload: command.payload,
        },
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await response.text();
    let body: unknown = {};

    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = {};
      }
    }

    return {
      status: response.status,
      ok: response.ok,
      body,
    };
  } finally {
    clearTimeout(timeout);
  }
}
