import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "active",
    mode: "MVP_EXECUTION_ENGINE",
    note: "Settlement handled by state-machine"
  });
}
