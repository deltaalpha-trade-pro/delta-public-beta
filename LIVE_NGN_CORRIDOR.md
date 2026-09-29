# DeltaAlpha Live NGN Corridor — Controlled E2E Contract

Status: IMPLEMENTATION BRANCH / NOT LIVE

This corridor is intentionally fail-closed. No real NGN payment can be initialized unless the live-corridor feature flag, verified authentication, private settlement runtime, live Paystack mode, and explicit private policy configuration are all present.

## Transaction path

1. Authenticated DeltaAlpha session.
2. DeltaAlpha validates the user through the configured authentication bridge and rejects demo authentication.
3. DeltaAlpha sends a settlement preflight to the private Whalez governed runtime.
4. Private policy evaluates jurisdiction, verification level, risk tier, amount limit, provider and corridor state.
5. Only an authorized preflight permits Paystack initialization.
6. DeltaAlpha initializes a Paystack NGN transaction with deterministic provider reference and correlation identity.
7. Paystack sends a signed charge.success webhook.
8. DeltaAlpha validates the webhook HMAC signature and independently verifies the provider transaction.
9. DeltaAlpha forwards the verified external settlement event to the private runtime.
10. The private runtime persists the event and invokes the canonical WhalezChain Mainnet settlement adapter.
11. The WhalezChain adapter must return a finalized canonical receipt before the settlement is considered complete.
12. DeltaAlpha exposes only the resulting bounded status and receipt to the authenticated customer.

## Required production configuration

- LIVE_NGN_CORRIDOR_ENABLED=true
- LIVE_NGN_CORRIDOR_POLICY_ID=<explicit policy id>
- LIVE_NGN_MIN_VERIFICATION_LEVEL=V1 (or stricter)
- LIVE_NGN_MAX_AMOUNT_KOBO=<explicit controlled limit>
- LIVE_NGN_APPROVAL_MODE=manual|policy_auto (private runtime)
- WHALEZ_RUNTIME_SETTLEMENT_URL=https://<private-origin>
- WHALEZ_RUNTIME_SETTLEMENT_TOKEN=<server-only secret>
- PAYSTACK_SECRET_KEY=<server-only live secret>
- PAYSTACK_LIVE_MODE=true
- PAYSTACK_REQUIRE_LIVE_DOMAIN=true
- WHALEZCHAIN_MAINNET_SETTLEMENT_URL=http://127.0.0.1:8793/mainnet/settlement (private runtime only)
- WHALEZ_CHAIN_INTERNAL_TOKEN=<server-only secret>

Secrets must never be exposed to the browser.

## Boundary rules

- DeltaAlpha never writes directly to WhalezChain.
- The public surface cannot bypass the private governance runtime.
- Paystack is the NGN external payment rail; it is not the WhalezChain state authority.
- WhalezChain must not represent a Paystack payment as finalized until the external payment is independently verified.
- settlement_required_whz remains policy-derived and conditional. It is not a universal transaction requirement.
- The canonical ecosystem receipt must bind at least: DeltaAlpha correlation id, idempotency key, external provider, provider reference, provider transaction id, currency, amount, WHZ settlement requirement and lock result where applicable, WhalezChain block and finality identifiers, and canonical receipt hash.

## Current blocker

The canonical WhalezChain Mainnet adapter is not yet exposed on the GitHub branch used by the runtime. The latest Mainnet-chain implementation exists only in the founder's local WhalezChain working branch and therefore cannot yet be treated as remotely deployable or launch-certified.

The corridor must remain disabled until that adapter is implemented, tested, connected to the canonical Mainnet finalization path, and verified with a controlled real transaction.
