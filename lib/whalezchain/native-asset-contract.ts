import { createHash } from "node:crypto"

const CANONICAL_URL = "https://native-assets.deltaalpha-trade-pro.com/v1/assets"
const SCHEMA_V1 = "whalezchain.public-native-assets.v1" as const
const SCHEMA_V2 = "whalezchain.public-native-assets.v2" as const
const EXPECTED = {
  WHZ: { canonical_asset_name: "Whalez Mint", asset_role_class: "ecosystem_policy_unit" },
  PTN: { canonical_asset_name: "Plutonium", asset_role_class: "platform_trade_note" },
  PRN: { canonical_asset_name: "Plutoranium", asset_role_class: "platform_receipt_note" },
} as const

export type NativeAsset = {
  symbol: "WHZ" | "PTN" | "PRN"
  canonical_asset_name: string
  asset_role_class: string
  identity_status: "CANONICAL"
}

export type NativeAssetIdentityCatalogue = {
  schema: typeof SCHEMA_V1 | typeof SCHEMA_V2
  source: "canonical_whalezchain_registry"
  network: "identity_only"
  asset_count: 3
  assets: NativeAsset[]
  price_claims: false
  custody_or_balance_claims: false
  mainnet_execution_enabled: false
  settlement_enabled: false
  identity_contract_sha256: string
  verification_mode: "live_origin" | "verified_source_snapshot"
  origin_live_verified: boolean
  read_verified_utc?: string
  snapshot_verified_date?: string
  served_at_utc?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

// The Chain bridge signs neither this response nor a live settlement claim.
// This is a deterministic SHA-256 integrity check of the pinned v1 identity fields.
function stable(value: unknown): string {
  if (Array.isArray(value)) return "[" + value.map(stable).join(",") + "]"
  if (isRecord(value)) {
    return "{" + Object.keys(value).sort().map(
      key => JSON.stringify(key) + ":" + stable(value[key]),
    ).join(",") + "}"
  }
  return JSON.stringify(value) ?? "null"
}

function fixedSchema(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const actual = Object.keys(value).sort()
  const wanted = [...keys].sort()
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index])
}

function recentTime(value: unknown, now: number): value is string {
  if (typeof value !== "string") return false
  const moment = Date.parse(value)
  return Number.isFinite(moment) && moment >= now - 120_000 && moment <= now + 30_000
}

function snapshotDate(value: unknown, now: number): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const midnight = Date.parse(value + "T00:00:00Z")
  return Number.isFinite(midnight) && new Date(midnight).toISOString().slice(0, 10) === value &&
    midnight <= now + 86_400_000 && now - midnight <= 8 * 86_400_000
}

export function validateNativeAssetCatalogue(
  input: unknown, now = Date.now(),
): NativeAssetIdentityCatalogue | null {
  if (!isRecord(input)) return null

  const common = [
    "schema", "source", "asset_count", "assets", "price_claims",
    "custody_or_balance_claims", "mainnet_execution_enabled",
    "settlement_enabled", "identity_contract_sha256",
  ]
  const live = input.schema === SCHEMA_V1 && fixedSchema(
    input, [...common, "network", "read_verified_utc"],
  ) && input.network === "identity_only" && recentTime(input.read_verified_utc, now)
  const snapshot = input.schema === SCHEMA_V2 && fixedSchema(
    input, [...common, "mode", "snapshot_verified_date", "served_at_utc", "origin_live_verified"],
  ) && input.mode === "verified_source_snapshot" &&
    input.origin_live_verified === false &&
    snapshotDate(input.snapshot_verified_date, now) && recentTime(input.served_at_utc, now)

  if (!live && !snapshot) return null
  if (input.source !== "canonical_whalezchain_registry" ||
      input.asset_count !== 3 ||
      input.price_claims !== false ||
      input.custody_or_balance_claims !== false ||
      input.mainnet_execution_enabled !== false ||
      input.settlement_enabled !== false ||
      !Array.isArray(input.assets) || input.assets.length !== 3 ||
      typeof input.identity_contract_sha256 !== "string" ||
      !/^[0-9a-f]{64}$/.test(input.identity_contract_sha256)) return null

  const symbols = ["WHZ", "PTN", "PRN"] as const
  for (let index = 0; index < symbols.length; index++) {
    const asset: unknown = input.assets[index]
    const symbol = symbols[index]
    if (!isRecord(asset) ||
        !fixedSchema(asset, ["symbol", "canonical_asset_name", "asset_role_class", "identity_status"]) ||
        asset.symbol !== symbol ||
        asset.canonical_asset_name !== EXPECTED[symbol].canonical_asset_name ||
        asset.asset_role_class !== EXPECTED[symbol].asset_role_class ||
        asset.identity_status !== "CANONICAL") return null
  }

  // A v2 snapshot hashes the same immutable v1 identity body, not its
  // presentation metadata (snapshot date, serving timestamp, provenance).
  const identityBody = {
    schema: SCHEMA_V1,
    source: "canonical_whalezchain_registry",
    network: "identity_only",
    asset_count: 3,
    assets: input.assets,
    price_claims: false,
    custody_or_balance_claims: false,
    mainnet_execution_enabled: false,
    settlement_enabled: false,
  } as const
  const calculated = createHash("sha256").update(stable(identityBody)).digest("hex")
  if (calculated !== input.identity_contract_sha256) return null

  return {
    ...identityBody,
    schema: live ? SCHEMA_V1 : SCHEMA_V2,
    assets: input.assets as NativeAsset[],
    identity_contract_sha256: calculated,
    verification_mode: live ? "live_origin" : "verified_source_snapshot",
    origin_live_verified: live,
    ...(live
      ? { read_verified_utc: input.read_verified_utc as string }
      : {
          snapshot_verified_date: input.snapshot_verified_date as string,
          served_at_utc: input.served_at_utc as string,
        }),
  }
}

export async function readNativeAssetCatalogue(
  fetcher: typeof fetch = fetch,
): Promise<NativeAssetIdentityCatalogue | null> {
  if (process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL !== CANONICAL_URL) return null
  try {
    const response = await fetcher(CANONICAL_URL, {
      method: "GET",
      cache: "no-store",
      redirect: "error",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5_000),
    })
    if (response.status !== 200 || response.redirected ||
        !(response.headers.get("content-type") || "").startsWith("application/json")) return null
    const raw = await response.text()
    if (raw.length > 12_000) return null
    return validateNativeAssetCatalogue(JSON.parse(raw))
  } catch {
    return null
  }
}

export const CANONICAL_NATIVE_ASSET_READ_URL = CANONICAL_URL
