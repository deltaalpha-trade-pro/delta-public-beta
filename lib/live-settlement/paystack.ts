import { createHmac, timingSafeEqual } from "node:crypto";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export type PaystackTransaction = {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  channel?: string;
  paid_at?: string | null;
  created_at?: string | null;
  metadata?: unknown;
};

type PaystackResponse<T> = {
  status: boolean;
  message: string;
  data?: T;
};

function secretKey(): string {
  const value = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!value) throw new Error("paystack_not_configured");
  return value;
}

function requireLiveMode(): void {
  if (process.env.PAYSTACK_LIVE_MODE !== "true") {
    throw new Error("paystack_live_mode_disabled");
  }
}

async function paystackFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<PaystackResponse<T>> {
  requireLiveMode();

  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as PaystackResponse<T> | null;

  if (!response.ok || !body?.status) {
    throw new Error("paystack_request_failed");
  }

  return body;
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountKobo: number;
  reference: string;
  metadata: Record<string, string | number | boolean>;
}): Promise<{
  authorization_url: string;
  access_code: string;
  reference: string;
}> {
  const result = await paystackFetch<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: String(input.amountKobo),
      currency: "NGN",
      reference: input.reference,
      metadata: JSON.stringify(input.metadata),
    }),
  });

  if (!result.data?.authorization_url || !result.data.reference) {
    throw new Error("paystack_invalid_initialize_response");
  }

  return result.data;
}

export async function verifyPaystackTransaction(
  reference: string,
): Promise<PaystackTransaction> {
  const encoded = encodeURIComponent(reference);
  const result = await paystackFetch<PaystackTransaction>(
    `/transaction/verify/${encoded}`,
    { method: "GET" },
  );

  if (!result.data) throw new Error("paystack_invalid_verify_response");
  return result.data;
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  if (!signature) return false;

  const expected = createHmac("sha512", secretKey())
    .update(rawBody, "utf8")
    .digest("hex");

  const actual = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return (
    actual.length === expectedBuffer.length &&
    timingSafeEqual(actual, expectedBuffer)
  );
}
