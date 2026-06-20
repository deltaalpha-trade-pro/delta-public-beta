import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const protectedRoutes = ["/dashboard", "/account", "/trading"]

  const isProtected = protectedRoutes.some((r) =>
    pathname.startsWith(r)
  )

  if (isProtected) {
    const session = req.cookies.get("session")?.value

    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}
