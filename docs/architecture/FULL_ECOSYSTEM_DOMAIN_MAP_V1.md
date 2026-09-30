# WHALEZ-AI ECOSYSTEM — FULL DOMAIN ARCHITECTURE MAP V1

Status: BUILD BASELINE — 30 September 2026

## Constitutional architecture

```
ROOT
  │
  └── WHALEZ-AI ECOSYSTEM
        │
        ├── Whalez-AI
        │     ├── policy / reasoning / routing
        │     ├── state validation
        │     ├── economic validation
        │     ├── security & integrity
        │     ├── governance & compliance
        │     ├── chain history
        │     └── consensus coordination
        │
        ├── Founder Console — PRIVATE AUTHORITY
        │     ├── founder visibility
        │     ├── approvals / governance
        │     ├── execution authorization
        │     ├── runtime control
        │     └── secure-shell / internal services
        │
        ├── DeltaAlpha-Trade-Pro — PUBLIC FINANCIAL OPERATING PLATFORM
        │     ├── Account / Profile / Settings
        │     ├── Security view
        │     ├── Portfolio
        │     ├── Market Observations / Signals
        │     ├── Whalez-AI Coach
        │     ├── Trading
        │     ├── Investment
        │     ├── Digital Banking
        │     ├── Escrow
        │     └── Settlement
        │
        ├── Global Economic Control Plane
        │     ├── Native Economy: WHZ / PTN / PRN
        │     ├── External Economy: BTC / ETH / RWA
        │     └── Global Money Layer: USD / EUR / GBP / NGN / ...
        │
        ├── Enterprise Orchestrator
        │     └── external provider / rail routing
        │
        └── WhalezChain — NATIVE STATE / PROVENANCE / FINALITY RAIL
              ├── native balances / account state
              ├── provenance / attestations
              ├── settlement-bond state
              ├── transaction / block state
              └── canonical receipts / finality
```

## Authority rule

The browser is never the financial source of truth.

DeltaAlpha is the public gateway and customer experience. Its server-side API is a controlled backend-for-frontend into the private ecosystem. Whalez-AI provides intelligence and policy-aware routing. Founder Console supplies private approval and execution authority. WhalezChain supplies native economic state, provenance and finality. External providers supply provider-specific transaction state.

## Customer-state spine

```
Authentication authority
        │
        ▼
Identity
  ├── user_id
  ├── email
  ├── verification level V0..V3
  ├── risk tier R0..R3
  └── jurisdiction
        │
        ▼
Whalez-AI / eligibility + policy
        │
        ├───────────────┬─────────────────┬──────────────────┐
        ▼               ▼                 ▼                  ▼
     Account         Portfolio         Intelligence      Capabilities
        │               │            ┌─────────────┐      │
        │               │            │ Signals     │      │
        │               │            │ Coach       │      │
        │               │            └─────────────┘      │
        │               │                                 │
        └───────────────┴─────────────────────────────────┘
                                │
                                ▼
                        Financial workflows
          ┌───────────┬──────────┬──────────┬────────────┐
          ▼           ▼          ▼          ▼            ▼
       Trading    Investment   Banking    Escrow     Settlement
          │           │          │          │            │
          └───────────┴──────────┴──────────┴────────────┘
                                │
                                ▼
                     Provider / rail adapters
                                │
                                ▼
                           WhalezChain
```

## Account / Profile / Settings / Security

Account state is persisted in Whalez-AI Core's domain database. Authentication credentials remain outside this domain.

Account model:
- identity reference
- display/legal name
- country/jurisdiction
- verification level
- risk tier
- account status
- account level
- preferred currency
- USD reference currency
- capability entitlement snapshot

Security model:
- MFA status snapshot
- passkey count snapshot
- active session count snapshot
- security status
- last security review

Credential mutations MUST continue to terminate in the authentication authority. DeltaAlpha/Whalez-AI only reconcile and display authoritative status.

## Portfolio / Investment

Portfolio is a runtime-backed read model, not a synthetic browser object.

Portfolio:
- portfolio identity
- reference currency
- positions
- quantity/lots
- average cost
- marks
- realized/unrealized P&L
- source/status

Investment remains simulation-only until an eligible investment route/provider and jurisdictional authorization exist. WHZ/PTN/PRN retain their WhalezChain-native identity and are not silently converted into provider-held assets.

## Signals / Coach

Signals are currently observation-only.

```
market/provider observation
       ↓
validation / normalization
       ↓
Whalez-AI interpretation
       ↓
SignalObservation(actionable=false)
       ↓
user context / portfolio context
```

Coach is a contextual intelligence surface:
- reads account state
- reads portfolio state
- reads non-actionable observations
- explains status/context
- does not create trade authorization
- does not fabricate financial holdings
- does not bypass governance

Future regulated advisory behavior, where applicable, must be separately classified and enabled only after jurisdiction/provider/legal review.

## Trading

Current functional path:
- public simulation engine remains intact
- simulation orders may be written to platform domain state
- live orders remain governance-gated
- live broker/exchange execution requires an adapter, pre-trade risk, provider order lifecycle, fills, reconciliation and settlement linkage

Canonical live sequence:

```
user intent
 → eligibility
 → pre-trade risk
 → Whalez-AI governance
 → Founder approval where required
 → broker/exchange adapter
 → provider order/fills
 → financial state update
 → receipt / audit
 → portfolio update
```

## Digital Banking

DeltaAlpha presents banking-style account experiences, but the platform must not invent customer funds.

Canonical banking sequence:

```
customer identity / KYC
 → eligible bank/payment capability
 → provider account/balance read model
 → payment/transfer intent
 → provider execution
 → verified provider event
 → canonical financial record
 → user statement / history
```

The platform may link provider-held accounts and expose verified balances without becoming the custody source unless and until the required regulated operating model exists.

## Escrow

Escrow is a persisted governed state machine:

```
CREATED
 → BOND_CHECKED
 → HELD
 → PRE_SETTLEMENT
 → FINALITY_WAIT
 → RELEASED

Failure branches:
  HELD / PRE_SETTLEMENT / FINALITY_WAIT
    → REFUNDED or FAILED
```

The WHZ settlement-bond is not a decorative balance. In live mode its availability, locked amount and reservation must be read from canonical WhalezChain state and tied to the specific settlement/escrow correlation.

## Settlement

Existing Nigeria corridor:

```
DeltaAlpha
  ↓
runplane authentication
  ↓
NGN/Paystack eligibility + limits
  ↓
private runtime preflight
  ↓
Founder/governance approval
  ↓
Paystack initialize
  ↓
Paystack verified event
  ↓
WhalezChain bond-state verification
  ↓
WhalezChain prepare
  ↓
execution authorization
  ↓
WhalezChain finalize
  ↓
canonical receipt / finality
  ↓
ledger + account / portfolio / escrow reconciliation
```

The existing live corridor is retained. The required completion is replacing environment-only WHZ bond policy with a chain-backed account-specific bond snapshot before authorization/finalization.

## Repository responsibility matrix

| Domain | Public repo | Intelligence/state authority | Private authority / external rail |
|---|---|---|---|
| Account/Profile | delta-public-beta | whalez-ai-core | runplane-auth |
| Settings | delta-public-beta | whalez-ai-core | runplane-auth |
| Security view | delta-public-beta | whalez-ai-core snapshot | runplane-auth |
| Signals | delta-public-beta | whalez-ai-core / Whalez-AI | market-data runtime |
| Coach | delta-public-beta | whalez-ai-core / Whalez-AI | private model/runtime as governed |
| Portfolio | delta-public-beta | whalez-ai-core read model | providers + WhalezChain |
| Trading | delta-public-beta | Whalez-AI / risk / state | Founder Console + broker |
| Investment | delta-public-beta | Whalez-AI / portfolio | regulated provider / custodian / venue |
| Banking | delta-public-beta | whalez-ai-core read model | bank / PSP / open-banking provider |
| Escrow | delta-public-beta | whalez-ai-core state | Founder Console + WhalezChain |
| Settlement | delta-public-beta | Whalez-AI / policy | Founder Console + Paystack + WhalezChain |
| Approval | — | — | Founder Console |
| Native WHZ/PTN/PRN state | — | read/validation | WhalezChain |
| Provider routing | — | policy/routing | Enterprise Orchestrator |

## Lifecycle truth

Every capability moves independently through:

DESIGNED → IMPLEMENTED → TESTED → PARTNER-READY → JURISDICTION-ELIGIBLE → LIVE

A public page MUST NOT imply the later state until evidence exists.

## Non-negotiable invariants

1. Whalez-AI remains one intelligence identity.
2. Delegated agents are capabilities/roles, not public AI identities.
3. Founder Console remains private.
4. WhalezChain remains the native economic/state rail.
5. WHZ/PTN/PRN are preserved as native assets and identities.
6. USD remains a reference/valuation unit where configured, not an automatic backing asset.
7. External positions remain external; WhalezChain records attestation/provenance/finality.
8. Browser localStorage/state cannot be financial truth.
9. Public beta doctrine remains no actionable public signals.
10. Live settlement requires verified provider state, verified WHZ bond state and canonical chain finality.
