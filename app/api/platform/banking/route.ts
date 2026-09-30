import { NextResponse } from "next/server";
import { platformRequest } from "@/lib/platform/runtime";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") === "transactions"
      ? "transactions"
      : url.searchParams.get("type") === "payment-intents"
        ? "payment-intents"
        : "accounts";
    const path =
      type === "payment-intents"
        ? "/v1/platform/banking/payment-intents"
        : `/v1/platform/banking/${type}`;
    const response = await platformRequest(path);
    const data = await response.json().catch(() => ({ ok: false }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "platform_unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const response = await platformRequest("/v1/platform/banking/payment-intents", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({ ok: false }));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ ok: false, error: "platform_unavailable" }, { status: 503 });
  }
}
