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

**Engines (Whalezchain, GMAL, Ledger) accept instructions ONLY from Layer 3.**

## Modes

| Mode     | Behavior                                      |
|----------|-----------------------------------------------|
| PUBLIC   | Interpreter-only, simulation responses        |
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

## Request Classification

| Classification     | Outcome     |
|--------------------|-------------|
| `public`           | Simulation  |
| `internal-verified`| Allowed     |
| `internal-pending` | Rejected    |
| `rejected`         | Rejected    |

## Security

- Layer 3 enforces mode at entry point
- PUBLIC: Returns `SIMULATION_ONLY`, explains but never executes
- INTERNAL: Requires headers + role token validation
- BotID-style classification (no third-party dependency)
- Silent operation, no public exposure

See `SECURITY.md` for full checklist.
