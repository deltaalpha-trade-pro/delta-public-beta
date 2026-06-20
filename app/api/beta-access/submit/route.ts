import { NextRequest, NextResponse } from "next/server"

import { expandBetaAccessIntoAccount } from "@/lib/platform/store"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, intendedUse, company } = data

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Missing name or email" },
        { status: 400 },
      )
    }

    const user = await expandBetaAccessIntoAccount({
      name: String(name),
      email: String(email),
      company: typeof company === "string" ? company : undefined,
      intendedUse: typeof intendedUse === "string" ? intendedUse : undefined,
    })

    return NextResponse.json({
      success: true,
      accountCreated: true,
      email: user.email,
      onboardingRequired: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to start guided access",
      },
      { status: 500 },
    )
  }
}
