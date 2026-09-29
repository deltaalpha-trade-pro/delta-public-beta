# Live Platform Corridor V1

Status: IMPLEMENTATION / CONTROLLED ACTIVATION ONLY

## Purpose

This branch is the minimum live-platform activation corridor for DeltaAlpha-Trade-Pro. It does not replace or redesign the Whalez-AI Ecosystem.

Canonical relationship:
DeltaAlpha-Trade-Pro → authenticated user → Whalez-AI/private governed runtime → regulated external provider → verified provider event → WhalezChain finalization → canonical receipt/finality

## Live NGN corridor

- Jurisdiction: Nigeria (NGA)
- Settlement currency: NGN
- External payment provider: Paystack
- Identity: authenticated, non-demo, verified live identity
- Risk: R3 blocked
- Amount: bounded by LIVE_NGN_MAX_AMOUNT_KOBO
- Governance: payment.capture evaluated by private governance
- Approval: explicit manual Founder approval for controlled activation
- Provider initialization: server-side secret only
- Provider webhook: HMAC SHA512 verification over the raw payload
- Provider finality: independent provider transaction verification before settlement state changes
- Chain: two-phase prepare/finalize
- Idempotency: durable correlation and provider-event identity

State: PREFLIGHT → GOVERNANCE_APPROVAL_REQUIRED or AUTHORIZED_TO_INITIATE → PAYMENT_PENDING → PROVIDER_VERIFIED_CHAIN_PENDING → CHAIN_FINALIZATION_AUTH_REQUIRED → CHAIN_FINALIZATION_PENDING → CANONICAL_SETTLED

## WHZ settlement assurance

WHZ remains a native WhalezChain asset and is not removed by this corridor.

settlement_required_whz is conditional and policy-derived. When required, its amount is bound into the settlement intent, a native settlement_attestation is prepared, the configured platform settlement account supplies an existing WHZ bond, and WhalezChain locks that bond in economic state before finality.

The attestation does not mint WHZ and does not silently make WHZ mandatory for every transaction. Separate settlement_release and settlement_slash transaction types preserve the post-settlement lifecycle.

The WHZ bond must not be represented as a bank guarantee, insurance, deposit protection, or regulatory capital without a separate legal/regulatory basis establishing that treatment.

## Market data

The market-data corridor is observation-only. DeltaAlpha reads quotes through the private Whalez-AI market-data service. It remains separate from order routing, execution, custody, settlement, and WhalezChain canonical economic state.

Crypto adapters: Binance Spot public websocket ticker, Coinbase Advanced Trade websocket ticker, Kraken Spot websocket v2 ticker.

FX adapters: OANDA v20 pricing stream for account-eligible instruments, with Twelve Data exchange-rate REST fallback marked LIVE_RATE_ONLY.

When OANDA credentials are configured and MARKET_DATA_FX_ALL=true, the service discovers the configured account's available CURRENCY instruments and subscribes to that set. Coverage is provider/account/configured-universe coverage, not a claim that every global instrument is available.

A quote is reported live only when the private service returns it, stale=false, and source status=LIVE. Stale or rate-only observations are never silently promoted to execution-grade pricing.

## Execution boundary

The public trading terminal may display live market observations while order entry remains simulation-only until a separate regulated order-routing and execution corridor passes technical, partner, legal, and jurisdiction gates.

## Server-side configuration

DeltaAlpha: LIVE_NGN_CORRIDOR_ENABLED, LIVE_NGN_CORRIDOR_POLICY_ID, LIVE_NGN_MIN_VERIFICATION_LEVEL, LIVE_NGN_MAX_AMOUNT_KOBO, LIVE_NGN_APPROVAL_MODE=manual, WHALEZ_RUNTIME_SETTLEMENT_URL, WHALEZ_RUNTIME_SETTLEMENT_TOKEN, PAYSTACK_SECRET_KEY, PAYSTACK_LIVE_MODE, PAYSTACK_REQUIRE_LIVE_DOMAIN.

Market data: WHALEZ_RUNTIME_MARKET_DATA_URL and WHALEZ_RUNTIME_MARKET_DATA_TOKEN.

Private runtime: WHALEZCHAIN_MAINNET_SETTLEMENT_URL, WHALEZ_CHAIN_INTERNAL_TOKEN, WHALEZ_SETTLEMENT_SIGNER_PRIVATE_KEY_HEX, WHALEZCHAIN_APPROVALS_DIR, MARKET_DATA_* configuration, OANDA_* credentials when FX streaming is activated, and TWELVE_DATA_API_KEY only for the explicit fallback.

Secrets must remain server-side and must never be committed to source control or exposed to the browser.

## Activation gates

This implementation is not a production launch certificate by itself. Production activation still requires independent verification of regulatory status/permitted activity, regulated provider or partner arrangements and live credentials, KYC/KYB and eligibility policy, production secret provisioning, private runtime health, controlled provider-to-chain end-to-end finalization, replay/idempotency and failure tests, and audit/retention/incident controls appropriate to the activated service.

For Nigeria, actual public investment and digital-asset activities must be reconciled with current SEC registration or an appropriate regulated-partner structure before public offering.
