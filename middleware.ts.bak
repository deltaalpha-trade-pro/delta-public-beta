import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/founder-console"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get("session_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/request-access", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/founder-console/:path*"],
};
