import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import {
  verifyPaystackTransaction,
  verifyPaystackWebhookSignature,
} from "@/lib/live-settlement/paystack";
import { postSettlementRuntime } from "@/lib/live-settlement/runtime";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  let validSignature = false;
  try {
    validSignature = verifyPaystackWebhookSignature(rawBody, signature);
  } catch {
    validSignature = false;
  }

  if (!validSignature) {
    return NextResponse.json({ ok: false, error: "invalid_webhook_signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_webhook_payload" }, { status: 400 });
  }

  if (payload?.event !== "charge.success") {
    return NextResponse.json({ ok: true, ignored: true, event: payload?.event || "unknown" });
  }

  const reference = String(payload?.data?.reference || "").trim();
  if (!reference) {
    return NextResponse.json({ ok: false, error: "missing_provider_reference" }, { status: 400 });
  }

  let verified;
  try {
    verified = await verifyPaystackTransaction(reference);
  } catch {
    return NextResponse.json({ ok: false, error: "provider_verification_failed" }, { status: 503 });
  }

  const eventId = createHash("sha256").update(rawBody, "utf8").digest("hex");

  if (verified.status !== "success" || verified.currency !== "NGN" || verified.reference !== reference) {
    return NextResponse.json(
      { ok: false, error: "provider_verification_mismatch", reference },
      { status: 409 },
    );
  }

  if (process.env.PAYSTACK_REQUIRE_LIVE_DOMAIN !== "false" && verified.domain !== "live") {
    return NextResponse.json({ ok: false, error: "provider_not_live", reference }, { status: 409 });
  }

  try {
    const result = await postSettlementRuntime("/internal/settlement/provider-event", {
      event_id: eventId,
      provider: "paystack",
      event_name: payload.event,
      correlation_reference: reference,
      provider_reference: verified.reference,
      provider_transaction_id: String(verified.id),
      provider_status: verified.status,
      provider_domain: verified.domain,
      amount_minor: verified.amount,
      currency: verified.currency,
      channel: verified.channel || null,
      paid_at: verified.paid_at || null,
      created_at: verified.created_at || null,
    });

    return NextResponse.json({
      ok: true,
      accepted: true,
      status: result?.status || "accepted",
      correlation_id: result?.correlation_id,
      canonical_receipt: result?.canonical_receipt || null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "private_runtime_finalization_failed",
        reference,
      },
      { status: 503 },
    );
  }
}
