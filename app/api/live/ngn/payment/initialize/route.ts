import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

export const runtime = "nodejs";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

type Identity = {
  user_id: string;
  email: string;
  risk_tier: string;
  verification_level: string;
};

type RuntimeResponse = Record<string, unknown>;

function liveError(error: string, status = 503, correlation_id?: string) {
  return NextResponse.json({ ok: false, error, ...(correlation_id ? { correlation_id } : {}) }, { status });
}

function parseBody(body: unknown): { amount_ngn?: string; idempotency_key?: string } {
  if (!body || typeof body !== "object") return {};
  const value = body as Record<string, unknown>;
  return {
    amount_ngn: typeof value.amount_ngn === "string" ? value.amount_ngn : undefined,
    idempotency_key: typeof value.idempotency_key === "string" ? value.idempotency_key : undefined,
  };
}

function parseNgnToKobo(value: string): number {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) throw new Error("invalid_amount");
  const [whole, fraction = ""] = value.split(".");
  const naira = Number(whole);
  const kobo = Number((fraction + "00").slice(0, 2));
  const total = naira * 100 + kobo;
  if (!Number.isSafeInteger(naira) || !Number.isSafeInteger(kobo) || !Number.isSafeInteger(total) || total <= 0) {
    throw new Error("amount_out_of_range");
  }
  return total;
}

function maxAmountKobo(): number {
  const value = Number(process.env.LIVE_NGN_MAX_AMOUNT_KOBO || "100000000");
  return Number.isSafeInteger(value) && value > 0 ? value : 100000000;
}

function correlationId(userId: string, idempotencyKey: string): string {
  return `da-ngn-${createHash("sha256").update(userId + ":" + idempotencyKey).digest("hex").slice(0, 32)}`;
}

function providerReference(correlation: string): string {
  return `DA-NGN-${correlation.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30)}`;
}

async function getLiveIdentity(request: Request): Promise<Identity | null> {
  if (process.env.AUTH_DEMO_MODE === "true") return null;
  if (process.env.RUNPLANE_AUTH_ENABLED !== "true") return null;

  const base = (process.env.RUNPLANE_AUTH_URL || process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (!base) return null;

  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  if (!match?.[1]) return null;

  const response = await fetch(`${base}/auth/me`, {
    method: "GET",
    headers: { Cookie: `rp=${match[1]}` },
    redirect: "manual",
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) return null;
  const data: unknown = await response.json().catch(() => null);
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const identity: Identity = {
    user_id: typeof record.user_id === "string" ? record.user_id : "",
    email: typeof record.email === "string" ? record.email : "",
    risk_tier: typeof record.risk_tier === "string" ? record.risk_tier : "",
    verification_level: typeof record.verification_level === "string" ? record.verification_level : "",
  };

  if (!identity.user_id || !identity.email || !identity.risk_tier || !identity.verification_level) return null;
  if (identity.risk_tier === "R3") return null;
  const minimum = (process.env.LIVE_NGN_MIN_VERIFICATION_LEVEL || "V1").toUpperCase();
  const rank: Record<string, number> = { V0: 0, V1: 1, V2: 2, V3: 3 };
  if (!(minimum in rank) || !(identity.verification_level in rank) || rank[identity.verification_level] < rank[minimum]) return null;

  return identity;
}

function runtimeConfig(): { url: string; token: string } {
  const url = (process.env.WHALEZ_RUNTIME_SETTLEMENT_URL || "").trim().replace(/\/$/, "");
  const token = (process.env.WHALEZ_RUNTIME_SETTLEMENT_TOKEN || "").trim();
  if (!url || !token) throw new Error("private_runtime_not_configured");
  return { url, token };
}

async function postRuntime(path: string, payload: Record<string, unknown>): Promise<RuntimeResponse> {
  const { url, token } = runtimeConfig();
  const response = await fetch(`${url}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-WHALEZ-SETTLEMENT-TOKEN": token,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok || !body || typeof body !== "object") {
    throw new Error(
      body && typeof body === "object" && typeof (body as Record<string, unknown>).error === "string"
        ? String((body as Record<string, unknown>).error)
        : "private_runtime_rejected",
    );
  }
  return body as RuntimeResponse;
}

function paystackSecret(): string {
  const value = (process.env.PAYSTACK_SECRET_KEY || "").trim();
  if (!value) throw new Error("paystack_not_configured");
  if (process.env.PAYSTACK_LIVE_MODE !== "true") throw new Error("paystack_live_mode_disabled");
  return value;
}

async function initializePaystack(email: string, amountKobo: number, reference: string, metadata: Record<string, string>): Promise<{ authorization_url: string; reference: string }> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: String(amountKobo),
      currency: "NGN",
      reference,
      metadata: JSON.stringify(metadata),
    }),
    cache: "no-store",
  });

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok || !body || typeof body !== "object") throw new Error("paystack_request_failed");
  const record = body as Record<string, unknown>;
  const data = record.data;
  if (!data || typeof data !== "object") throw new Error("paystack_invalid_initialize_response");
  const tx = data as Record<string, unknown>;
  if (typeof tx.authorization_url !== "string" || typeof tx.reference !== "string") {
    throw new Error("paystack_invalid_initialize_response");
  }
  return { authorization_url: tx.authorization_url, reference: tx.reference };
}

export async function POST(request: Request) {
  if (process.env.LIVE_NGN_CORRIDOR_ENABLED !== "true") return liveError("live_ngn_corridor_disabled");

  const identity = await getLiveIdentity(request);
  if (!identity) return liveError("live_execution_requires_verified_auth", 403);

  const body = parseBody(await request.json().catch(() => null));
  if (!body.amount_ngn || !body.idempotency_key || body.idempotency_key.trim().length < 16 || body.idempotency_key.trim().length > 128) {
    return liveError("invalid_request", 400);
  }

  let amountKobo: number;
  try {
    amountKobo = parseNgnToKobo(body.amount_ngn);
  } catch {
    return liveError("amount_out_of_range", 400);
  }
  if (amountKobo > maxAmountKobo()) return liveError("amount_exceeds_live_policy_limit", 403);

  const idempotencyKey = body.idempotency_key.trim();
  const correlation = correlationId(identity.user_id, idempotencyKey);
  const reference = providerReference(correlation);

  let preflight: RuntimeResponse;
  try {
    preflight = await postRuntime("/internal/settlement/preflight", {
      correlation_id: correlation,
      idempotency_key: idempotencyKey,
      user_id: identity.user_id,
      jurisdiction: "NGA",
      verification_level: identity.verification_level,
      risk_tier: identity.risk_tier,
      settlement_asset: { type: "fiat", symbol: "NGN" },
      amount_minor: amountKobo,
      currency: "NGN",
      external_provider: "paystack",
      external_reference: reference,
    });
  } catch (error) {
    return liveError(error instanceof Error ? error.message : "private_runtime_unavailable", 503, correlation);
  }

  if (preflight.status === "GOVERNANCE_APPROVAL_REQUIRED") {
    return NextResponse.json(
      { ok: false, error: "governance_approval_required", correlation_id: correlation, policy_id: preflight.policy_id || null },
      { status: 409 },
    );
  }
  if (preflight.status !== "AUTHORIZED_TO_INITIATE") {
    return NextResponse.json(
      { ok: false, error: typeof preflight.error === "string" ? preflight.error : "live_payment_not_authorized", correlation_id: correlation },
      { status: 403 },
    );
  }

  if (typeof preflight.authorization_url === "string" && typeof preflight.provider_reference === "string") {
    return NextResponse.json({
      ok: true,
      status: "PAYMENT_PENDING",
      corridor: "NGN",
      provider: "paystack",
      correlation_id: correlation,
      reference: preflight.provider_reference,
      authorization_url: preflight.authorization_url,
      settlement_required_whz: preflight.settlement_required_whz ?? null,
      replay: true,
    });
  }

  try {
    const initialized = await initializePaystack(identity.email, amountKobo, reference, {
      corridor: "NGN",
      correlation_id: correlation,
      user_id: identity.user_id,
      idempotency_key: idempotencyKey,
      settlement_policy_id: String(preflight.policy_id || ""),
    });

    await postRuntime("/internal/settlement/provider-initialized", {
      correlation_id: correlation,
      user_id: identity.user_id,
      provider: "paystack",
      provider_reference: initialized.reference,
      authorization_url: initialized.authorization_url,
    });

    return NextResponse.json({
      ok: true,
      status: "PAYMENT_PENDING",
      corridor: "NGN",
      provider: "paystack",
      correlation_id: correlation,
      reference: initialized.reference,
      authorization_url: initialized.authorization_url,
      settlement_required_whz: preflight.settlement_required_whz ?? null,
    });
  } catch (error) {
    return liveError(error instanceof Error ? error.message : "payment_provider_unavailable", 502, correlation);
  }
}
