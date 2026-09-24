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
- deterministic idempotency propagation
- Founder approval for governed ledger writes

The DeltaAlpha bridge does not accept an arbitrary caller-selected source account. The source must equal the server-configured WHALEZ_RUNTIME_TESTNET_SOURCE_ACCOUNT. This keeps the proof path bounded to a controlled testnet account until user wallet ownership is implemented.

This does not activate public live trading, custody, settlement, external brokerage, real-money movement, external asset execution, or mainnet execution.

The existing public Trading UI remains simulation-only.

## Request contract

POST /api/runtime/orchestrate

Authenticated DeltaAlpha session required and runtime bridge feature flag must be enabled.

Example body:

    {
      "operation": "ledger.write",
      "idempotencyKey": "user-action-20260924-0001",
      "payload": {
        "from_account": "whalezchain-testnet://founder/internal-alpha",
        "to_account": "whalezchain-testnet://validator/internal-beta",
        "asset_symbol": "WHZ",
        "amount": "1"
      }
    }

The from_account must match the server-side configured source account. The destination must remain in the controlled whalezchain-testnet:// namespace.

The DeltaAlpha server generates one correlation UUID and uses that same value as the HTTP X-Request-ID, Orchestrator context.correlation_id, and public response correlationId.

The DeltaAlpha server sends:

    {
      "message": "ledger.write",
      "context": {
        "source": "deltaalpha-trade-pro",
        "correlation_id": "<same generated uuid>",
        "idempotency_key": "<same request key>",
        "actor": {
          "user_id": "<authenticated user>",
          "risk_tier": "R0|R1|R2|R3",
          "verification_level": "V0|V1|V2|V3"
        },
        "payload": {
          "from_account": "<server-configured testnet source>",
          "to_account": "<controlled testnet destination>",
          "asset_symbol": "WHZ|PTN|PRN",
          "amount": "<decimal string>"
        }
      }
    }

## Response semantics

- 200: command executed or an idempotent completed replay was returned
- 202: Founder approval is required and the request is waiting
- 403: command blocked by an execution boundary or source-account boundary
- 409: request could not be completed under the current contract
- 502: runtime upstream failure
- 503: bridge/auth/configuration is unavailable
- 504: runtime connection timed out or failed unexpectedly

Only safe public fields are returned. Internal engine, gate, repository, route, and runtime topology details are not exposed to the browser.

## Idempotency

A DeltaAlpha request supplies an idempotency key.

The Orchestrator derives a deterministic approval request identity from:

authenticated user ID + operation + idempotency key

The stored approval request hash also covers the execution payload and actor identity.

A repeated request with the same identity and same execution material can return the existing approval/completion state rather than creating another approval request.

Reusing the same idempotency key with a different execution payload is rejected.

A production-grade exactly-once guarantee still requires the canonical WhalezChain execution layer itself to accept and persist the same execution identity atomically with transaction execution. That capability has not been assumed here.

## Security rules

- WHALEZ_ORCHESTRATOR_API_KEY is server-only.
- Do not prefix the API key with NEXT_PUBLIC_.
- WHALEZ_RUNTIME_TESTNET_SOURCE_ACCOUNT is server configuration, not a user-controlled request field.
- DeltaAlpha must call /orchestrate, never /resume.
- /resume remains an internal control operation and is disabled by default at the API layer.
- Founder approval remains protected by the Founder authority token.
- Do not create a second WhalezChain transfer adapter.
- Direct Chain /testnet/transfer is disabled by default in the Orchestrator-side feature branch.
- The bridge is disabled unless WHALEZ_RUNTIME_BRIDGE_ENABLED=true.
- Controlled testnet evidence must not be described as real-money or mainnet execution.

## Production readiness gates

Before enabling this bridge for real user financial operations, all of the following need independent evidence:

1. Authenticated user → actual wallet/account ownership mapping
2. Jurisdiction + KYC/KYB eligibility
3. Asset capability state for the requested product
4. Provider/route selection where external rails are involved
5. Real custody/broker/payment/settlement partner capability where applicable
6. Canonical WhalezChain execution identity with crash-safe idempotency
7. End-to-end receipt/attestation propagation
8. Public API authentication hardening, abuse controls, and rate limits
9. Single authenticated runtime gateway rather than exposing every internal Cloudflare hostname
10. Production observability, reconciliation, rollback, and incident procedures

Until those gates are satisfied, controlled-live testnet evidence must not be described as real-money or mainnet execution.
