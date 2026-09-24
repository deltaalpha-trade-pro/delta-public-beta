import crypto from "node:crypto";
import { NextResponse } from "next/server";

import {
  authBridgeConfigured,
  demoMode,
  getAccessCookie,
  runplaneAuthFetch,
  runplaneCookie,
  responseBody,
} from "@/app/api/auth/_util";
import { orchestrate } from "@/lib/whalez-runtime/orchestrator-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AuthIdentity = {
  user_id: string;
  risk_tier: string;
  verification_level: string;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "cache-control": "no-store, max-age=0",
    },
  });
}

function bridgeEnabled() {
  return (
    process.env.WHALEZ_RUNTIME_BRIDGE_ENABLED || ""
  ).toLowerCase() === "true";
}

function configuredTestnetSource(): string | null {
  const value = (
    process.env.WHALEZ_RUNTIME_TESTNET_SOURCE_ACCOUNT || ""
  ).trim();

  if (
    !value ||
    !value.startsWith("whalezchain-testnet://") ||
    value.length > 256
  ) {
    return null;
  }

  return value;
}

function isControlledTestnetAccount(value: unknown) {
  return (
    typeof value === "string" &&
    value.length <= 256 &&
    value.startsWith("whalezchain-testnet://")
  );
}

function isValidIdempotencyKey(value: unknown) {
  return (
    typeof value === "string" &&
    /^[A-Za-z0-9._:-]{8,128}$/.test(value.trim())
  );
}

function isValidAsset(value: unknown): value is "WHZ" | "PTN" | "PRN" {
  return (
    value === "WHZ" ||
    value === "PTN" ||
    value === "PRN"
  );
}

function normalizeAmount(value: unknown): string | null {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0
      ? String(value)
      : null;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 64) return null;

  const amount = Number(trimmed);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  return trimmed;
}

async function requireUser():
  Promise<
    | { ok: true; user: AuthIdentity }
    | { ok: false; response: ReturnType<typeof json> }
  > {
  if (!getAccessCookie()) {
    return {
      ok: false,
      response: json(
        { success: false, error: "unauthorized" },
        401,
      ),
    };
  }

  if (demoMode()) {
    return {
      ok: false,
      response: json(
        {
          success: false,
          error: "runtime commands are unavailable in demo mode",
        },
        403,
      ),
    };
  }

  if (!bridgeEnabled()) {
    return {
      ok: false,
      response: json(
        {
          success: false,
          error: "runtime bridge is not enabled",
        },
        404,
      ),
    };
  }

  if (!configuredTestnetSource()) {
    return {
      ok: false,
      response: json(
        {
          success: false,
          error: "runtime testnet source is not configured",
        },
        503,
      ),
    };
  }

  if (!authBridgeConfigured()) {
    return {
      ok: false,
      response: json(
        {
          success: false,
          error: "authentication service is unavailable",
        },
        503,
      ),
    };
  }

  try {
    const upstream = await runplaneAuthFetch(
      "/auth/me",
      {
        method: "GET",
        headers: {
          Cookie: runplaneCookie(
            getAccessCookie() as string,
          ),
        },
      },
    );

    const data = await responseBody(
      upstream,
    );

    if (upstream.status === 401) {
      return {
        ok: false,
        response: json(
          {
            success: false,
            error: "unauthorized",
          },
          401,
        ),
      };
    }

    if (
      !upstream.ok ||
      !isObject(data)
    ) {
      return {
        ok: false,
        response: json(
          {
            success: false,
            error: "authentication service unavailable",
          },
          503,
        ),
      };
    }

    const userId = data.user_id;
    const riskTier = data.risk_tier;
    const verificationLevel =
      data.verification_level;

    if (
      typeof userId !== "string" ||
      !userId.trim() ||
      typeof riskTier !== "string" ||
      typeof verificationLevel !== "string"
    ) {
      return {
        ok: false,
        response: json(
          {
            success: false,
            error: "authentication identity incomplete",
          },
          503,
        ),
      };
    }

    return {
      ok: true,
      user: {
        user_id: userId.trim().slice(0, 128),
        risk_tier: riskTier.trim().slice(0, 32),
        verification_level:
          verificationLevel.trim().slice(0, 32),
      },
    };
  } catch {
    return {
      ok: false,
      response: json(
        {
          success: false,
          error: "authentication service unavailable",
        },
        503,
      ),
    };
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function publicResult(
  statusCode: number,
  body: unknown,
  correlationId: string,
) {
  if (!isObject(body)) {
    return {
      success: false,
      error: "runtime service returned an invalid response",
      status: "failed",
      correlationId,
    };
  }

  const lifecycle = isObject(body.lifecycle)
    ? body.lifecycle
    : {};
  const execution = isObject(body.execution)
    ? body.execution
    : {};
  const approval = isObject(body.approval)
    ? body.approval
    : {};

  const status =
    typeof lifecycle.status === "string"
      ? lifecycle.status
      : typeof execution.status === "string"
        ? execution.status
        : statusCode >= 400
          ? "failed"
          : "accepted";

  let executionId: string | undefined;

  if (status === "executed") {
    const result = isObject(execution.result)
      ? execution.result
      : {};
    const canonical = isObject(result.execution)
      ? result.execution
      : {};

    if (
      typeof canonical.execution_id === "string"
    ) {
      executionId = canonical.execution_id;
    }
  }

  return {
    success:
      statusCode < 400 &&
      body.ok !== false,
    status,
    requestId:
      typeof approval.request_id === "string"
        ? approval.request_id
        : undefined,
    approvalRequired:
      status === "waiting_approval",
    idempotentReplay:
      body.idempotent_replay === true,
    execution:
      status === "executed"
        ? {
            status: "executed",
            executionId,
          }
        : undefined,
    correlationId,
  };
}

export async function POST(
  request: Request,
) {
  const auth = await requireUser();

  if (!auth.ok) {
    return auth.response;
  }

  const body = await request
    .json()
    .catch(() => null);

  if (!isObject(body)) {
    return json(
      {
        success: false,
        error: "Invalid runtime command",
      },
      400,
    );
  }

  if (body.operation !== "ledger.write") {
    return json(
      {
        success: false,
        error: "Unsupported runtime operation",
      },
      400,
    );
  }

  if (!isValidIdempotencyKey(
    body.idempotencyKey,
  )) {
    return json(
      {
        success: false,
        error: "Invalid idempotency key",
      },
      400,
    );
  }

  if (!isObject(body.payload)) {
    return json(
      {
        success: false,
        error: "Invalid runtime payload",
      },
      400,
    );
  }

  const payload = body.payload;
  const sourceAccount = configuredTestnetSource();

  if (!sourceAccount) {
    return json(
      {
        success: false,
        error: "runtime testnet source is not configured",
      },
      503,
    );
  }

  if (
    payload.from_account !== sourceAccount ||
    !isControlledTestnetAccount(
      payload.to_account,
    )
  ) {
    return json(
      {
        success: false,
        error:
          "runtime bridge currently accepts only the configured controlled testnet source and a WhalezChain testnet destination",
      },
      403,
    );
  }

  if (!isValidAsset(
    payload.asset_symbol,
  )) {
    return json(
      {
        success: false,
        error: "Invalid asset",
      },
      400,
    );
  }

  const amount = normalizeAmount(
    payload.amount,
  );

  if (!amount) {
    return json(
      {
        success: false,
        error: "Invalid amount",
      },
      400,
    );
  }

  const correlationId =
    crypto.randomUUID();

  try {
    const upstream = await orchestrate({
      operation: "ledger.write",
      idempotencyKey:
        String(body.idempotencyKey).trim(),
      correlationId,
      actor: auth.user,
      payload: {
        from_account:
          sourceAccount,
        to_account:
          String(payload.to_account),
        asset_symbol:
          payload.asset_symbol,
        amount,
      },
    });

    const result = publicResult(
      upstream.status,
      upstream.body,
      upstream.correlationId,
    );

    if (
      result.status === "waiting_approval"
    ) {
      return json(
        result,
        202,
      );
    }

    if (
      result.status === "blocked"
    ) {
      return json(
        result,
        403,
      );
    }

    if (
      result.status === "failed" ||
      !result.success
    ) {
      return json(
        {
          success: false,
          error:
            "runtime command could not be completed",
          status: result.status,
          correlationId:
            upstream.correlationId,
        },
        upstream.status >= 500
          ? 502
          : 409,
      );
    }

    return json(
      result,
      200,
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "";

    if (
      message ===
        "WHALEZ_ORCHESTRATOR_URL is not configured" ||
      message ===
        "WHALEZ_ORCHESTRATOR_API_KEY is not configured"
    ) {
      return json(
        {
          success: false,
          error:
            "runtime service is not configured",
        },
        503,
      );
    }

    return json(
      {
        success: false,
        error:
          "runtime service is temporarily unavailable",
      },
      504,
    );
  }
}
