# Whalez-AI / DeltaAlpha Launch Cutline

**Effective:** 2026-09-02  
**Status:** Launch preparation  
**Scope:** Public launch path only

## Operating rule

The ecosystem is no longer in open-ended feature construction for launch. The launch surface is now a controlled candidate.

> Build close enough to reality that reality is allowed to change the plan.

## Launch freeze

The following are frozen unless a change is directly required to pass a launch gate:

- Whalez-AI core architecture
- Core service topology
- Model selection
- New architectural layers
- New public features
- Non-essential integrations

A change is launch-relevant only when it improves one of: **reliability, user value, verification/provenance, security, or launch safety**.

## Canonical launch path

```text
User / Browser
    -> DeltaAlpha public surface
    -> Public API
    -> Whalez-AI core / orchestrator
    -> Intelligence or approved simulation execution
    -> Verification / provenance
    -> User response
```

Where the execution requires provenance:

```text
Execution -> Whalezchain -> verifiable anchor
```

## Public/private boundary

The public surface must not expose founder, internal, custody, broker, settlement, or private authority controls.

Termux remains an operational/private node. Public access must not depend on exposing Termux localhost ports to the Internet.

## Launch gates

### Gate 1 — Build

- Linux build passes.
- Required policy checks pass.
- Deployment target builds successfully.

### Gate 2 — Reachability

- Public surface is reachable.
- Canonical API endpoint is reachable.
- Public request reaches the intended backend.

### Gate 3 — Golden path

- A real external request completes end-to-end.
- No manual intervention is required for ordinary execution.
- Response contains truthful verification state.

### Gate 4 — Safety boundary

- Public path remains simulation-only where specified.
- No broker, custody, live-trading, settlement, or private-authority path is reachable.
- Founder/internal routes remain inaccessible publicly.

### Gate 5 — Provenance

- Relevant execution can be reconstructed.
- Whalezchain provenance is demonstrably attached where required.
- We do not claim stronger provenance than the evidence supports.

### Gate 6 — Operations

- Restart/recovery is repeatable.
- Failure states are observable.
- The operator can determine why a launch-path request failed without guesswork.

## Current repository posture

- PR #17: **blocked** until its failed Linux Build and Policy Guards checks are resolved.
- PR #16: **golden-path candidate**, pending actual end-to-end verification.
- PR #19: **preferred API-boundary candidate** because it is substantially narrower than the overlapping PR #18.
- PR #18: **scope review required**; do not merge both API-boundary tracks.

## Explicit non-goals for launch

The following are not launch gates and must not delay the first honest public release unless they block a gate above:

- additional AI models
- additional ecosystem services
- decorative UI expansion
- speculative governance layers
- new settlement features
- broad automation expansion
- architecture refactors without measurable launch benefit

## Decision standard

When a proposed change is ambiguous, ask:

1. Does the user need it for the launch journey?
2. Does the system need it to remain safe or truthful?
3. Can we verify the benefit now?

If the answer is no, it belongs after launch.
