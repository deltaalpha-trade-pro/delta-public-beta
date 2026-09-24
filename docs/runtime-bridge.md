# DeltaAlpha → Whalez Orchestrator Runtime Bridge

## Purpose

This bridge creates a server-to-server path from the authenticated DeltaAlpha application to the Whalez Orchestrator.

The browser never receives the Whalez Orchestrator API key and never calls internal Whalez ports directly.

Current topology:

DeltaAlpha browser
→ DeltaAlpha Route Handler
→ authenticated runplane session check
→ Whalez Orchestrator
→ governance / execution kernel
→ canonical WhalezChain adapter

## Current scope

The implementation is deliberately limited to:

- operation: ledger.write
- controlled WhalezChain testnet account namespaces only
- native assets: WHZ, PTN, PRN
- server-to-server authentication
- request correlation
- idempotency key propagation
- Founder approval for governed ledger writes

This does not activate public live trading, custody, settlement, external brokerage, real-money movement, or mainnet execution.

The existing public Trading UI remains simulation-only.

## Request contract

POST /api/runtime/orchestrate

Authenticated DeltaAlpha session required.

Example body:

```json
{
  "operation": "ledger.write",
  "idempotencyKey": "user-action-20260924-0001",
  "payload": {
    "from_account": "whalezchain-testnet://...",
    "to_account": "whalezchain-testnet://...",
    "asset_symbol": "WHZ",
    "amount": "1"
  }
}
```

The DeltaAlpha server adds the authenticated identity and sends:

```json
{
  "message": "ledger.write",
  "context": {
    "source": "deltaalpha-trade-pro",
    "correlation_id": "<generated uuid>",
    "idempotency_key": "<same request key>",
    "actor": {
      "user_id": "<authenticated user>",
      "risk_tier": "R0|R1|R2|R3",
      "verification_level": "V0|V1|V2|V3"
    },
    "payload": {
      "from_account": "<controlled testnet account>",
      "to_account": "<controlled testnet account>",
      "asset_symbol": "WHZ|PTN|PRN",
      "amount": "<decimal string>"
    }
  }
}
```

## Response semantics

- 200: command executed or an idempotent completed replay was returned
- 202: Founder approval is required and the request is waiting
- 403: command blocked by an execution boundary
- 409: request could not be completed under the current contract
- 502: runtime upstream failure
- 503: bridge/auth configuration is unavailable
- 504: runtime connection timed out or failed unexpectedly

Only safe public fields are returned. Internal engine, gate, repository, route, and runtime topology details are not exposed to the browser.

## Idempotency

A DeltaAlpha request supplies an idempotency key.

The Orchestrator derives a deterministic approval request identity from:

authenticated user ID + operation + idempotency key

A repeated request with the same identity can return the existing approval/completion state rather than creating another approval request.

A future production-grade exactly-once guarantee still requires the canonical WhalezChain execution layer itself to accept and persist the same execution identity atomically with transaction execution. That capability has not been assumed here.

## Security rules

- WHALEZ_ORCHESTRATOR_API_KEY is server-only.
- Do not prefix the API key with NEXT_PUBLIC_.
- DeltaAlpha must call /orchestrate, never /resume.
- /resume remains an internal control operation.
- Founder approval remains protected by the Founder authority token.
- Do not create a second WhalezChain transfer adapter.
- Testnet-only account namespace checks remain in both DeltaAlpha and the Orchestrator contract.
- The bridge is disabled unless WHALEZ_RUNTIME_BRIDGE_ENABLED=true.

## Production readiness gates

Before enabling this bridge for real user financial operations, all of the following need independent evidence:

1. Authenticated user → wallet/account ownership mapping
2. Jurisdiction + KYC/KYB eligibility
3. Asset capability state for the requested product
4. Provider/route selection where external rails are involved
5. Real custody/broker/payment/settlement partner capability where applicable
6. Canonical WhalezChain execution identity with crash-safe idempotency
7. End-to-end receipt/attestation propagation
8. Public API abuse/rate-limit controls
9. Single authenticated runtime gateway rather than exposing every internal Cloudflare hostname
10. Production observability and rollback procedures

Until those gates are satisfied, controlled-live testnet evidence must not be described as real-money or mainnet execution.
