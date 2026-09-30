# Repository Responsibility Matrix V1

## Accessible repositories

### deltaalpha-trade-pro/delta-public-beta
Public gateway and customer experience.

Owns:
- pages
- public navigation
- server-side BFF routes
- customer-facing capability views
- public-safe schemas and status language

Must not own:
- private keys
- founder approval authority
- canonical WhalezChain state
- provider secret keys
- duplicate authentication authority

### deltaalpha-trade-pro/whalez-ai-core
Canonical intelligence-domain runtime and customer-state read model.

Owns:
- policy-aware domain contracts
- account/profile state
- security snapshots
- portfolio read model
- observation signal records
- coach context/session state
- provider-linked banking records
- governed escrow state
- trading order state
- settlement intent state
- audit records

Must not own:
- customer credentials
- private founder authority
- external provider secrets in browser-facing code
- alternative WhalezChain state

### deltaalpha-trade-pro/founder-console
Private Authority.

Owns:
- founder governance
- approvals
- execution authorization
- settlement gateway
- internal provisioning
- private runtime control
- chain authorization handoff

### WhalezChain
Native economic/state/provenance/finality rail.

Required capabilities for live integration:
- account state
- WHZ availability / locked / reserved state
- bond reservation and release/slash state
- transaction prepare/finalize
- canonical receipt/finality

The currently connected GitHub integration does not expose this repository, so its local Termux checkout remains the authoritative inspection point before any route is added there.

### WhalezChain Enterprise Orchestrator
External routing/integration layer.

Owns:
- provider adapters
- market-data integration
- external economy routing
- partner/provider normalization

It does not become ROOT authority.

## Information flow

Browser
→ DeltaAlpha BFF
→ authenticated user identity
→ short-lived service identity
→ whalez-ai-core domain API
→ Whalez-AI policy/routing
→ Founder Console / Enterprise Orchestrator / WhalezChain when an operation requires them
→ canonical record + audit + user read model

## Security boundary

No browser request supplies user_id, founder authority, provider secret, chain token or service token. The DeltaAlpha BFF derives identity from the existing authentication cookie and mints a short-lived internal service token.

Higher-assurance deployments should graduate the service-token bridge to mTLS or asymmetric workload identity without changing the domain contract.
