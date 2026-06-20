# Whalez-AI Security Architecture

## System Overview

Whalez-AI is ONE system with PUBLIC and INTERNAL modes controlled by environment variables.
There is no separate "AI" - one orchestrator, one authority chain.

## Layer Architecture

```
Layer 3 (Whalez-AI Orchestrator)
    ↓ routes verified requests only
Layer 2 (Tool Coordination)
    ↓ tools report upward
Layer 1 (Core Execution)
```

**Engines (Whalezchain, GMAL, Ledger) accept instructions ONLY from Layer 3.**

## Internal Tools

| Codename        | Scope      | Authority                    |
|-----------------|------------|------------------------------|
| ALPHA-SENTINEL  | Analytics  | read:metrics, write:logs     |
| BETA-VALIDATOR  | Validation | read:data, validate:schemas  |
| GAMMA-ARBITER   | Decision   | read:context, compute:decisions |

All tools:
- Have unique internal codenames
- Have task-scoped authority
- Report upward to Whalez-AI (mandatory)
- Never communicate sideways

## Request Classification (BotID-Style)

Internal security classification with NO third-party dependency:

| Classification     | Criteria                                    | Outcome     |
|--------------------|---------------------------------------------|-------------|
| `public`           | No internal headers                         | Simulation  |
| `internal-pending` | Has token, missing role token               | Rejected    |
| `internal-verified`| Token + source + valid role token           | Allowed     |
| `rejected`         | Invalid headers or malformed tokens         | Rejected    |

## Environment Variables

### Production (Public):
```bash
WHALEZ_MODE=PUBLIC
```

### Internal Preview (Staff Only):
```bash
WHALEZ_MODE=INTERNAL
WHALEZ_INTERNAL_TOKEN=secure-token
WHALEZ_ROLE_TOKEN=whalez-role-xxxxxxxxxxxxx
```

## Runtime Behavior

### PUBLIC Mode
- Layer 3 returns `SIMULATION_ONLY` immediately
- Interpreter mode: explains what WOULD happen
- No execution, no side effects
- Telemetry logged for analytics

### INTERNAL Mode
- Requires all three validations:
  1. `x-whalez-internal-token` header
  2. `x-request-source: internal-console` header
  3. Valid role token (`whalez-role-*`)
- Verified requests proceed to Layer 2 → Layer 1
- Unverified requests downgraded to observation

## Protected Routes

The `/founder-console` route:
- Returns 404 unless `WHALEZ_MODE=INTERNAL`
- Requires valid internal headers
- No public acknowledgment of existence
- Removed from all public navigation

## Absolute Rules

**NEVER:**
- Mention protected routes publicly
- Create routes implying control access
- Expose Layer 2/3 outputs to public
- Allow execution in PUBLIC mode
- Split Whalez-AI into multiple systems

**ALWAYS:**
- Keep ONE Whalez-AI with mode control
- Enforce security at Layer 3 entry
- Validate with headers + role tokens
- Return `simulationOnly: true` for public
- Maintain strict layer hierarchy

## Verification Checklist

Before deployment:

- [ ] No `/app/founder`, `/app/admin`, `/app/console`, `/app/orchestrator`
- [ ] `/lib/whalez-ai` not imported by UI components
- [ ] `WHALEZ_MODE=PUBLIC` in production
- [ ] Protected routes return 404 in PUBLIC mode
- [ ] `simulationOnly: true` in all public responses
- [ ] Tools report upward only
- [ ] Engines accept Layer 3 instructions only

**All checks pass = SYSTEM SECURE**
