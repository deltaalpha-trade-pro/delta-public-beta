import { NextResponse } from "next/server";
import { getBalance } from "../_core/wallet";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || "demo-user";

  return NextResponse.json({
    userId,
    balance: getBalance(userId),
  });
}
