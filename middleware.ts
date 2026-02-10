import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || "founder@whalez-ai.com";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect founder console
  if (pathname.startsWith("/founder-console")) {
    const sessionToken = request.cookies.get("session_token")?.value;
    const founderBypass = request.cookies.get("founder_bypass")?.value;

    // Founder bypass (local + internal testing)
    if (founderBypass === "true") {
      return NextResponse.next();
    }

    // Normal session-based access
    if (!sessionToken) {
      return NextResponse.redirect(
        new URL("/request-access", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/founder-console/:path*"],
};
