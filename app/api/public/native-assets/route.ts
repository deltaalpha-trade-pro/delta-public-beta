import { NextResponse } from "next/server"
import { readNativeAssetCatalogue } from "@/lib/whalezchain/native-asset-contract"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const verified = await readNativeAssetCatalogue()
  return NextResponse.json(
    verified ?? {
      available: false,
      error: "canonical_native_asset_identity_unavailable",
      financial_operations_enabled: false,
    },
    { status: verified ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    },
  )
}
