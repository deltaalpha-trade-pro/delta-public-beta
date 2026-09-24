import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

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

const commandSchema = z.object({
  operation: z.literal("ledger.write"),
  idempotencyKey: z
    .string()
    .trim()
    .min(8)
    .max(128)
    .regex(/^[A-Za-z0-9._:-]+$/),
  payload: z
    .object({
      from_account: z.string().trim().min(1).max(256),
      to_account: z.string().trim().min(1).max(256),
      asset_symbol: z.enum(["WHZ", "PTN", "PRN"]),
      amount: z.union([
        z.number().finite().positive(),
        z.string().trim().min(1).max(64),
      ]),
    })
    .strict(),
}).strict();

type AuthIdentity = {
  user_id: string;
  risk_tier: "R0" | "R1" | "R2" | "R3";
  verification_level: "V0" | "V1" | "V2" | "V3";
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "cache-control": "no-store, max-age=0",
    },
  });
}

function runtimeBridgeEnabled(): boolean {
  return process.env.WHALEZ_RUNTIME_BRIDGE_ENABLED === "true";
}

function isControlledTestnetAccount(value: string): boolean {
  return value.startsWith("whalezchain-testnet://");
}

async function requireRealUser(): Promise<
  { ok: true; user: AuthIdentity } |
  { ok: false; response: NextResponse }
> {
  const access = getAccessCookie();

  if (!access) {
    return {
      ok: false,
      response: json({ success: false, error: "unauthorized" }, 401),
    };
  }

  if (demoMode()) {
    return {
      ok: false,
      response: json({
        success: false,
        error: "runtime commands are unavailable in demo mode",
      }, 403),
    };
  }

  if (!runtimeBridgeEnabled()) {
    return {
      ok: false,
      response: json({
        success: false,
        error: "runtime bridge is not enabled",
      }, 404),
    };
  }

  if (!authBridgeConfigured()) {
    return {
      ok: false,
      response: json({
        success: false,
        error: "authentication service is unavailable",
      }, 503),
    };
  }

  try {
    const response = await runplaneAuthFetch("/auth/me", {
      method: "GET",
      headers: { Cookie: runplaneCookie(access) },
    });

    const data = await responseBody(response);

    if (response.status === 401) {
      return {
        ok: false,
        response: json({ success: false, error: "unauthorized" }, 401),
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        response: json({
          success: false,
          error: "authentication service unavailable",
        }, 503),
      };
    }

    if (!data || typeof data !== "object") {
      return {
        ok: false,
        response: json({
          success: false,
          error: "authentication response invalid",
        }, 503),
      };
    }

    const record = data as Record<string, unknown>;
    const userId = typeof record.user_id === "string"
      ? record.user_id.trim()
      : "";
    const riskTier = record.risk_tier;
    const verificationLevel = record.verification_level;

    if (
      !userId ||
      !["R0", "R1", "R2", "R3"].includes(String(riskTier)) ||
      !["V0", "V1", "V2", "V3"].includes(String(verificationLevel))
    ) {
      return {
        ok: false,
        response: json({
          success: false,
          error: "authentication identity incomplete",
        }, 503),
      };
    }

    return {
      ok: true,
      user: {
        user_id: userId.slice(0, 128),
        risk_tier: riskTier as AuthIdentity["risk_tier"],
        verification_level:
          verificationLevel as AuthIdentity["verification_level"],
      },
    };
  } catch {
    return {
      ok: false,
      response: json({
        success: false,
        error: "authentication service unavailable",
      }, 503),
    };
  }
}

function publicRuntimeResult(
  upstreamStatus: number,
  upstreamBody: unknown,
) {
  if (!upstreamBody || typeof upstreamBody !== "object") {
    return {
      success: false,
      error: "runtime service returned an invalid response",
      status: "failed",
    };
  }

  const body = upstreamBody as Record<string, unknown>;
  const lifecycle =
    body.lifecycle && typeof body.lifecycle === "object"
      ? (body.lifecycle as Record<string, unknown>)
      : {};

  const execution =
    body.execution && typeof body.execution === "object"
      ? (body.execution as Record<string, unknown>)
      : {};

  const approval =
    body.approval && typeof body.approval === "object"
      ? (body.approval as Record<string, unknown>)
      : {};

  const status =
    typeof lifecycle.status === "string"
      ? lifecycle.status
      : typeof execution.status === "string"
        ? execution.status
        : upstreamStatus >= 400
          ? "failed"
          : "accepted";

  const executionResult =
    execution.result && typeof execution.result === "object"
      ? (execution.result as Record<string, unknown>)
      : {};

  const canonicalExecution =
    executionResult.execution &&
    typeof executionResult.execution === "object"
      ? (executionResult.execution as Record<string, unknown>)
      : {};

  return {
    success: upstreamStatus < 400 && body.ok !== false,
    status,
    requestId:
      typeof approval.request_id === "string"
        ? approval.request_id
        : undefined,
    approvalRequired: status === "waiting_approval",
    idempotentReplay: body.idempotent_replay === true,
    execution:
      status === "executed"
        ? {
            status: "executed",
            executionId:
              typeof canonicalExecution.execution_id === "string"
                ? canonicalExecution.execution_id
                : undefined,
          }
        : undefined,
  };
}

export async function POST(request: Request) {
  const auth = await requireRealUser();
  if (!auth.ok) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = commandSchema.safeParse(body);

  if (!parsed.success) {
    return json({
      success: false,
      error: "Invalid runtime command",
      details: parsed.error.flatten().fieldErrors,
    }, 400);
  }

  if (
    !isControlledTestnetAccount(parsed.data.payload.from_account) ||
    !isControlledTestnetAccount(parsed.data.payload.to_account)
  ) {
    return json({
      success: false,
      error: "runtime bridge currently accepts controlled WhalezChain testnet accounts only",
    }, 403);
  }

  const correlationId = crypto.randomUUID();

  try {
    const upstream = await orchestrate({
      operation: parsed.data.operation,
      idempotencyKey: parsed.data.idempotencyKey,
      actor: auth.user,
      payload: {
        ...parsed.data.payload,
        amount: String(parsed.data.payload.amount),
      },
    });

    const result = publicRuntimeResult(upstream.status, upstream.body);

    if (result.status === "waiting_approval") {
      return json(result, 202);
    }

    if (result.status === "blocked") {
      return json(result, 403);
    }

    if (result.status === "failed" || !result.success) {
      return json({
        success: false,
        error: "runtime command could not be completed",
        status: result.status,
      }, upstream.status >= 500 ? 502 : 409);
    }

    return json({
      ...result,
      correlationId,
    }, 200);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "runtime request failed";

    if (
      message === "WHALEZ_ORCHESTRATOR_URL is not configured" ||
      message === "WHALEZ_ORCHESTRATOR_API_KEY is not configured"
    ) {
      return json({
        success: false,
        error: "runtime service is not configured",
      }, 503);
    }

    return json({
      success: false,
      error: "runtime service is temporarily unavailable",
    }, 504);
  }
}
