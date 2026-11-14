import { NextResponse } from "next/server";
import { readNativeAssetCatalogue } from "@/lib/whalezchain/native-asset-contract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const native = await readNativeAssetCatalogue();
  // Public-safe, abstract asset exposure. Replace with backend call later.
  return NextResponse.json(
    {
      asset_classes: ["crypto", "equity", "fx", "etf", "index", "commodity"],
      newly_registered: [
        { symbol: "BTC-USD", asset_class: "crypto", status: "active" },
        { symbol: "ETH-USD", asset_class: "crypto", status: "active" },
        { symbol: "SPY", asset_class: "etf", status: "active" },
        { symbol: "EURUSD", asset_class: "fx", status: "active" },
      ],
      note: "Public surface is non-actionable. Execution is gated by governance & legal triggers.",
      native_chain: native
        ? {
            status: native.origin_live_verified
              ? "canonical_identity_live_verified"
              : "canonical_identity_snapshot_verified",
            assets: native.assets,
            identity_contract_sha256: native.identity_contract_sha256,
            verification_mode: native.verification_mode,
            origin_live_verified: native.origin_live_verified,
            read_verified_utc: native.read_verified_utc ?? null,
            snapshot_verified_date: native.snapshot_verified_date ?? null,
            financial_execution_enabled: false,
          }
        : { status: "canonical_source_unavailable", assets: [], financial_execution_enabled: false },
    },
    { status: 200 }
  );
}
