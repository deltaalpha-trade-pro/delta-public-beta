import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";

import { getLiveIdentity } from "@/lib/live-settlement/auth";
import { initializePaystackTransaction } from "@/lib/live-settlement/paystack";
import { postSettlementRuntime, SettlementRuntimeError } from "@/lib/live-settlement/runtime";

export const runtime = "nodejs";

const requestSchema = z.object({
  amount_ngn: z.string().regex(/^\d+(?:\.\d{1,2})?$/, "amount_ngn must be a decimal NGN amount"),
  idempotency_key: z.string().trim().min(16).max(128),
});

function parseNgnToKobo(value: string): number {
  const [whole, fraction = ""] = value.split(".");
  const naira = Number(whole);
  const kobo = Number((fraction + "00").slice(0, 2));
  const total = naira * 100 + kobo;

  if (
    !Number.isSafeInteger(naira) ||
    !Number.isSafeInteger(kobo) ||
    !Number.isSafeInteger(total) ||
    total <= 0
  ) {
    throw new Error("amount_out_of_range");
  }

  return total;
}

function maxAmountKobo(): number {
  const configured = Number(process.env.LIVE_NGN_MAX_AMOUNT_KOBO || "100000000");
  return Number.isSafeInteger(configured) && configured > 0 ? configured : 100000000;
}

function correlationId(userId: string, idempotencyKey: string): string {
  const digest = createHash("sha256")
    .update(userId + ":" + idempotencyKey)
    .digest("hex");
  return "da-ngn-" + digest.slice(0, 32);
}

function providerReference(correlationId: string): string {
  return "DA-NGN-" + correlationId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 30);
}

type Preflight = {
  status?: string;
  policy_id?: string;
  provider_reference?: string;
  authorization_url?: string;
  settlement_required_whz?: string | null;
  error?: string;
};

export async function POST(request: Request) {
  if (process.env.LIVE_NGN_CORRIDOR_ENABLED !== "true") {
    return NextResponse.json(
      { ok: false, error: "live_ngn_corridor_disabled" },
      { status: 503 },
    );
  }

  const identity = await getLiveIdentity();
  if (!identity.ok) {
    return NextResponse.json(
      { ok: false, error: identity.error },
      { status: identity.status },
    );
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid_request", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  let amountKobo: number;
  try {
    amountKobo = parseNgnToKobo(parsed.data.amount_ngn);
  } catch {
    return NextResponse.json({ ok: false, error: "amount_out_of_range" }, { status: 400 });
  }

  if (amountKobo > maxAmountKobo()) {
    return NextResponse.json(
      { ok: false, error: "amount_exceeds_live_policy_limit" },
      { status: 403 },
    );
  }

  const idempotencyKey = parsed.data.idempotency_key;
  const correlation = correlationId(identity.identity.user_id, idempotencyKey);
  const reference = providerReference(correlation);

  let preflight: Preflight;
  try {
    preflight = (await postSettlementRuntime("/internal/settlement/preflight", {
      correlation_id: correlation,
      idempotency_key: idempotencyKey,
      user_id: identity.identity.user_id,
      jurisdiction: "NGA",
      verification_level: identity.identity.verification_level,
      risk_tier: identity.identity.risk_tier,
      settlement_asset: { type: "fiat", symbol: "NGN" },
      amount_minor: amountKobo,
      currency: "NGN",
      external_provider: "paystack",
      external_reference: reference,
    })) as Preflight;
  } catch (error) {
    const status = error instanceof SettlementRuntimeError ? error.status : 503;
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "private_runtime_unavailable",
        correlation_id: correlation,
      },
      { status },
    );
  }

  if (preflight.status === "GOVERNANCE_APPROVAL_REQUIRED") {
    return NextResponse.json(
      {
        ok: false,
        error: "governance_approval_required",
        correlation_id: correlation,
        policy_id: preflight.policy_id,
      },
      { status: 409 },
    );
  }

  if (preflight.status !== "AUTHORIZED_TO_INITIATE") {
    return NextResponse.json(
      {
        ok: false,
        error: preflight.error || "live_payment_not_authorized",
        correlation_id: correlation,
      },
      { status: 403 },
    );
  }

  if (preflight.authorization_url && preflight.provider_reference) {
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
    const initialized = await initializePaystackTransaction({
      email: identity.identity.email,
      amountKobo,
      reference,
      metadata: {
        corridor: "NGN",
        correlation_id: correlation,
        user_id: identity.identity.user_id,
        idempotency_key: idempotencyKey,
        settlement_policy_id: String(preflight.policy_id || ""),
      },
    });

    await postSettlementRuntime("/internal/settlement/provider-initialized", {
      correlation_id: correlation,
      user_id: identity.identity.user_id,
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
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "payment_provider_unavailable",
        correlation_id: correlation,
      },
      { status: error instanceof SettlementRuntimeError ? error.status : 502 },
    );
  }
}
