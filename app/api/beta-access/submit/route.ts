import { NextResponse } from "next/server";
import { validEmail } from "../../auth/_util";

const MAX_NAME = 120;
const MAX_INTENDED_USE = 1800;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "A JSON object is required" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const intendedUse = typeof input.intendedUse === "string" ? input.intendedUse.trim() : "";
  const submissionId = typeof input.submissionId === "string" ? input.submissionId.trim() : "";

  if (!name || name.length > MAX_NAME) {
    return NextResponse.json({ ok: false, error: "Enter a name of 1–120 characters" }, { status: 400 });
  }
  if (!validEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address" }, { status: 400 });
  }
  if (!intendedUse || intendedUse.length > MAX_INTENDED_USE) {
    return NextResponse.json({ ok: false, error: "Tell us how you intend to use the platform (up to 1,800 characters)" }, { status: 400 });
  }
  if (!/^[A-Za-z0-9._:-]{1,128}$/.test(submissionId)) {
    return NextResponse.json({ ok: false, error: "Refresh the form and submit again" }, { status: 400 });
  }

  const baseUrl = (process.env.WHALEZ_ORIGIN_API_URL || "").trim().replace(/\/+$/, "");
  const token = (process.env.DELTA_PUBLIC_ACCESS_TOKEN || "").trim();
  if (!baseUrl || !token) {
    return NextResponse.json({
      ok: false,
      error: "Beta access review is not connected yet. Please try again later.",
    }, { status: 503 });
  }

  try {
    const response = await fetch(baseUrl + "/public/access/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-DELTA-PUBLIC-ACCESS-TOKEN": token,
      },
      body: JSON.stringify({
        name,
        email,
        intended_use: intendedUse,
        reason: intendedUse,
        product: "DeltaAlpha-Trade-Pro",
        source: "delta-public-beta",
        submission_id: submissionId,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const status = response.status === 400 ? 400 : response.status === 422 ? 422 : 503;
      return NextResponse.json({
        ok: false,
        error: status === 400 || status === 422
          ? "The beta access request could not be accepted. Check the submitted details."
          : "The beta access review service could not confirm your request. Please try again later.",
      }, { status });
    }

    const requestId = typeof result.request_id === "string" ? result.request_id : "";
    if (!result.ok || !requestId) {
      return NextResponse.json({
        ok: false,
        error: "The beta access service did not confirm that your request was recorded.",
      }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      accepted: true,
      request_id: requestId,
      status: typeof result.status === "string" ? result.status : "pending",
      notice: "Your request was recorded for Founder review. A separate email will report the decision.",
    }, { status: 202 });
  } catch {
    return NextResponse.json({
      ok: false,
      error: "The beta access review service is unreachable. Your request has not been confirmed.",
    }, { status: 503 });
  }
}
