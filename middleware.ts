import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/account", "/trading", "/terminal"];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const access = req.cookies.get("access_token")?.value;
  if (!access) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  try {
    const verification = await fetch(new URL("/api/auth/me", req.url), {
      headers: { cookie: req.headers.get("cookie") || "" },
      cache: "no-store",
    });

    if (verification.ok) return NextResponse.next();

    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    if (verification.status >= 500) {
      url.searchParams.set("auth", "unavailable");
    }
    return NextResponse.redirect(url);
  } catch {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    url.searchParams.set("auth", "unavailable");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/trading/:path*", "/terminal/:path*"],
};
