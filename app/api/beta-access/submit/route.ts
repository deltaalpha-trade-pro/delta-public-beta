import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SUBMISSION_ID_RE = /^[A-Za-z0-9._:-]{1,128}$/;

function failure(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const originBase = (process.env.WHALEZ_ORIGIN_API_URL || "").trim().replace(/\/+$/, "");
  const sharedToken = (process.env.DELTA_PUBLIC_ACCESS_TOKEN || "").trim();
  if (!originBase || !sharedToken) {
    return failure("Beta Access submission is temporarily unavailable because its secure ingress is not configured.", 503);
  }

  try {
    const parsed = await request.json().catch(() => null);
    if (!parsed || typeof parsed !== "object") return failure("A JSON object is required.", 400);
    const input = parsed as Record<string, unknown>;
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
    const intendedUseValue = input.intended_use ?? input.intendedUse ?? input.reason;
    const intendedUse = typeof intendedUseValue === "string" ? intendedUseValue.trim() : "";
    let submissionId = typeof input.submissionId === "string"
      ? input.submissionId.trim()
      : typeof input.submission_id === "string"
        ? input.submission_id.trim()
        : "";
    if (!submissionId) submissionId = "web-" + randomUUID();

    if (!name || name.length > 120) return failure("Enter a name no longer than 120 characters.", 400);
    if (!EMAIL_RE.test(email) || email.length > 254) return failure("Enter a valid email address.", 400);
    if (!intendedUse || intendedUse.length > 1800) return failure("Tell us briefly why you are requesting access.", 400);
    if (!SUBMISSION_ID_RE.test(submissionId)) return failure("Invalid submission reference.", 400);

    const parsedOrigin = new URL(originBase);
    if (process.env.NODE_ENV === "production" && parsedOrigin.protocol !== "https:") {
      return failure("Secure Beta Access ingress must use HTTPS.", 503);
    }

    const upstream = await fetch(originBase + "/public/access/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DELTA-PUBLIC-ACCESS-TOKEN": sharedToken,
      },
      body: JSON.stringify({
        name,
        email,
        intended_use: intendedUse,
        reason: intendedUse,
        submission_id: submissionId,
        product: "DeltaAlpha-Trade-Pro",
        source: "delta-public-beta",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || result?.ok !== true || !result?.request_id) {
      const status = upstream.status === 400 ? 400 : upstream.status === 429 ? 429 : 503;
      return failure(
        status === 400
          ? (result?.error || "The access request could not be validated.")
          : "The access request could not be confirmed. Please retry shortly.",
        status,
      );
    }

    return NextResponse.json({
      ok: true,
      accepted: true,
      request_id: result.request_id,
      status: result.status || "pending",
      email_status: result.email_status || "pending",
      whalezchain_status: result.whalezchain_status || "pending",
      notice: "Your request has been recorded for Founder review. An acknowledgement email was " +
        (result.email_status === "provider_accepted" ? "accepted by the mail provider." :
          result.email_status === "queued" ? "queued for retry." : "not yet confirmed."),
    }, { status: 202 });
  } catch {
    return failure("The Beta Access service is temporarily unreachable. Your request was not confirmed.", 503);
  }
}
