# Whalez-AI Control Layer

Silent orchestrator system with Layer 3 → 2 → 1 architecture.
ONE system with PUBLIC and INTERNAL modes controlled by environment variables.

## Architecture

```
Layer 3 (Whalez-AI Orchestrator)
    ↓ routes verified requests only
Layer 2 (Tool Coordination)  
    ↓ tools report upward
Layer 1 (Core Execution)
```

**Engines (Whalezchain, GMAL, Ledger, Email, Simulation) accept instructions ONLY from Layer 3.**

## Phase 4 Implementation

### Phase 4A: Hard-Lock PUBLIC Execution
- All execution intents in PUBLIC mode return `SIMULATION_ONLY`
- Audit logging for denied actions (server-only, silent)
- Engines throw if invoked directly (must come from Layer 3)
- Response always includes: `simulationOnly: true`, `system: "deltapublicbetamain"`, `mode: "PUBLIC"`

### Phase 4B: Surface Separation
- Navigation hides internal routes when `WHALEZ_MODE=PUBLIC`
- Protected routes return 404 unless INTERNAL mode with valid headers
- No public acknowledgment of internal features

### Phase 4C: Intelligence Expansion
- FX Simulation: EUR/USD, GBP/USD, USD/JPY, AUD/USD, USD/CHF, EUR/GBP
- Timeframes: 1m, 5m, 15m, 1h, 4h, 1D
- Indicators: RSI (with visual feedback)
- AI Narration: Educational explanations of signals
- Email Engine: Simulates in PUBLIC, sends in INTERNAL

## Modes

| Mode     | Behavior                                      |
|----------|-----------------------------------------------|
| PUBLIC   | Simulation-only, educational narration        |
| INTERNAL | Full execution with verified authentication   |

## Environment Variables

```bash
# PUBLIC production (default)
WHALEZ_MODE=PUBLIC

# INTERNAL staff preview only
WHALEZ_MODE=INTERNAL
WHALEZ_INTERNAL_TOKEN=your-secure-token
WHALEZ_ROLE_TOKEN=whalez-role-xxxxxxxxxxxxx
```

## Internal Tools

| Codename        | Scope      | Authority                    |
|-----------------|------------|------------------------------|
| ALPHA-SENTINEL  | Analytics  | read:metrics, write:logs     |
| BETA-VALIDATOR  | Validation | read:data, validate:schemas  |
| GAMMA-ARBITER   | Decision   | read:context, compute:decisions |

All tools report upward to Whalez-AI, never sideways.

## Engines

| Engine      | Status         | Layer 3 Only |
|-------------|----------------|--------------|
| Whalezchain | Locked         | Yes          |
| GMAL        | Locked         | Yes          |
| Ledger      | Locked         | Yes          |
| Email       | Active         | Yes          |
| Simulation  | Active         | Yes          |

## Request Classification

| Classification     | Outcome     |
|--------------------|-------------|
| `public`           | Denied      |
| `internal-verified`| Allowed     |
| `internal-pending` | Rejected    |
| `rejected`         | Rejected    |

## Security

- Layer 3 enforces mode at absolute entry point
- PUBLIC: Returns `SIMULATION_ONLY` with `PUBLIC_MODE_ENFORCED` reason
- INTERNAL: Requires headers + role token validation
- BotID-style classification (no third-party dependency)
- Silent audit logging for all denied actions
- Engines throw on direct invocation (must use Layer 3)

See `SECURITY.md` for full checklist.
