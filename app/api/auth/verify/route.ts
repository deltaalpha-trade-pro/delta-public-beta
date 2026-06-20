import { NextResponse } from "next/server"
import { store } from "@/lib/auth/store"

export async function POST(req: Request) {
  const { email, code } = await req.json()

  if (!email || !code) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    )
  }

  const user = store.getUser(email)

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    )
  }

  if (user.verificationCode !== code) {
    return NextResponse.json(
      { error: "Invalid code" },
      { status: 400 }
    )
  }

  store.updateUser(email, {
    status: "VERIFIED",
    verificationCode: ""
  })

  return NextResponse.json({
    success: true,
    redirect: "/dashboard"
  })
}
