import test from "node:test"
import assert from "node:assert/strict"
import {
  validateNativeAssetCatalogue,
  readNativeAssetCatalogue,
  CANONICAL_NATIVE_ASSET_READ_URL,
} from "../lib/whalezchain/native-asset-contract"

const expectedUrl = "https://native-assets.deltaalpha-trade-pro.com/v1/assets"
const verifiedDigest = "1c6a75bc399fe4516f90dbe9125e0de9e263e21742cb0374ccb6b9c09e558bdc"

function liveFixture() {
  return {
    schema: "whalezchain.public-native-assets.v1",
    source: "canonical_whalezchain_registry",
    network: "identity_only",
    asset_count: 3,
    assets: [
      { symbol: "WHZ", canonical_asset_name: "Whalez Mint", asset_role_class: "ecosystem_policy_unit", identity_status: "CANONICAL" },
      { symbol: "PTN", canonical_asset_name: "Plutonium", asset_role_class: "platform_trade_note", identity_status: "CANONICAL" },
      { symbol: "PRN", canonical_asset_name: "Plutoranium", asset_role_class: "platform_receipt_note", identity_status: "CANONICAL" },
    ],
    price_claims: false,
    custody_or_balance_claims: false,
    mainnet_execution_enabled: false,
    settlement_enabled: false,
    identity_contract_sha256: verifiedDigest,
    read_verified_utc: new Date().toISOString(),
  }
}

function snapshotFixture() {
  const { network: _network, read_verified_utc: _read, ...base } = liveFixture()
  return {
    ...base,
    schema: "whalezchain.public-native-assets.v2",
    mode: "verified_source_snapshot",
    snapshot_verified_date: new Date().toISOString().slice(0, 10),
    served_at_utc: new Date().toISOString(),
    origin_live_verified: false,
  }
}

test("allowlisted HTTPS source is fixed", () => {
  assert.equal(CANONICAL_NATIVE_ASSET_READ_URL, expectedUrl)
})

test("v1 live-origin schema preserves financial disablement", () => {
  const verified = validateNativeAssetCatalogue(liveFixture())
  assert.ok(verified)
  assert.equal(verified.verification_mode, "live_origin")
  assert.equal(verified.origin_live_verified, true)
  assert.equal(verified.settlement_enabled, false)
})

test("v2 verified snapshot is accepted without claiming a live origin", () => {
  const verified = validateNativeAssetCatalogue(snapshotFixture())
  assert.ok(verified)
  assert.equal(verified.schema, "whalezchain.public-native-assets.v2")
  assert.equal(verified.verification_mode, "verified_source_snapshot")
  assert.equal(verified.origin_live_verified, false)
  assert.equal(verified.read_verified_utc, undefined)
  assert.ok(verified.snapshot_verified_date)
})

test("financial claims, private fields, wrong assets and altered identity digest are rejected", () => {
  const base = snapshotFixture()
  const samples = [
    { ...base, mainnet_execution_enabled: true },
    { ...base, settlement_enabled: true },
    { ...base, price_claims: true },
    { ...base, origin_live_verified: true },
    { ...base, internal_private_token: "should never appear" },
    { ...base, assets: base.assets.slice(1) },
    { ...base, assets: base.assets.map((x, i) => i === 0 ? { ...x, canonical_asset_name: "Fake WHZ" } : x) },
    { ...base, identity_contract_sha256: "f".repeat(64) },
    { ...base, mode: "live_origin" },
    { ...base, schema: "whalezchain.public-native-assets.v3" },
  ]
  for (const sample of samples) assert.equal(validateNativeAssetCatalogue(sample), null)
})

test("stale and future serving timestamps, stale snapshots and invalid calendars fail closed", () => {
  const base = snapshotFixture()
  assert.equal(validateNativeAssetCatalogue({ ...base, served_at_utc: "2021-01-01T00:00:00Z" }), null)
  assert.equal(validateNativeAssetCatalogue({ ...base, served_at_utc: "2100-01-01T00:00:00Z" }), null)
  assert.equal(validateNativeAssetCatalogue({ ...base, snapshot_verified_date: "2020-01-01" }), null)
  assert.equal(validateNativeAssetCatalogue({ ...base, snapshot_verified_date: "2026-02-30" }), null)
  assert.equal(validateNativeAssetCatalogue({ ...liveFixture(), read_verified_utc: "2021-01-01T00:00:00Z" }), null)
})

test("server URL mismatch rejects before any network call", async () => {
  const before = process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL
  process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL = "https://attacker.invalid"
  try {
    let calls = 0
    const result = await readNativeAssetCatalogue(async () => {
      calls++
      return new Response(JSON.stringify(snapshotFixture()), {
        status: 200, headers: { "content-type": "application/json" },
      })
    })
    assert.equal(result, null)
    assert.equal(calls, 0)
  } finally {
    if (before === undefined) delete process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL
    else process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL = before
  }
})

test("HTTP validation rejects HTML, redirects, and oversize bodies", async () => {
  const before = process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL
  process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL = expectedUrl
  try {
    const invalid = [
      new Response("<html></html>", { status: 200, headers: { "content-type": "text/html" } }),
      new Response("{}", { status: 302, headers: { location: "https://attacker.invalid" } }),
      new Response("x".repeat(12_001), { status: 200, headers: { "content-type": "application/json" } }),
    ]
    for (const value of invalid) {
      assert.equal(await readNativeAssetCatalogue(async () => value), null)
    }
  } finally {
    if (before === undefined) delete process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL
    else process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL = before
  }
})

test("actual public HTTPS gateway validates and discloses snapshot provenance", async () => {
  const before = process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL
  process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL = expectedUrl
  try {
    const result = await readNativeAssetCatalogue()
    assert.ok(result, "The deployed read gateway must match the approved contract")
    assert.deepEqual(result.assets.map(asset => asset.symbol), ["WHZ", "PTN", "PRN"])
    assert.equal(result.identity_contract_sha256, verifiedDigest)
    assert.equal(result.verification_mode, "verified_source_snapshot")
    assert.equal(result.origin_live_verified, false)
    assert.equal(result.mainnet_execution_enabled, false)
  } finally {
    if (before === undefined) delete process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL
    else process.env.WHALEZCHAIN_NATIVE_ASSET_READ_URL = before
  }
})
