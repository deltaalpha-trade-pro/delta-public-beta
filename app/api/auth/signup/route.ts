import { NextResponse } from "next/server"
import { store } from "@/lib/auth/store"

function generateCode() {
  return Math.floor(10000 + Math.random() * 90000).toString()
}

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    )
  }

  const existing = store.getUser(email)
  if (existing) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    )
  }

  const code = generateCode()

  store.createUser({
    email,
    password,
    status: "PENDING_VERIFICATION",
    verificationCode: code
  })

  return NextResponse.json({
    success: true,
    email,
    verificationCode: code,
    redirect: "/verify"
  })
}
