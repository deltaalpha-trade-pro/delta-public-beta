import { NextResponse } from "next/server";
import { processTrade } from "../_core/state-machine";

export async function POST(req: Request) {
  const body = await req.json();

  const trade = {
    id: crypto.randomUUID(),
    userId: body.userId || "demo-user",
    asset: body.asset,
    amount: body.amount,
    price: body.price,

    status: "created",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await processTrade(trade);

  return NextResponse.json(result);
}
