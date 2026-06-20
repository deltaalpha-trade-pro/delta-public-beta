import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  const p = path.join(process.cwd(), "public", "whalez", "public_surface", "public_surface_manifest.json");
  const raw = fs.readFileSync(p, "utf-8");
  return NextResponse.json(JSON.parse(raw), { status: 200 });
}
