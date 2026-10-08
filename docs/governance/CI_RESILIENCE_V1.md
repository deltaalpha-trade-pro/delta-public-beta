# CI Resilience V1

## Objective

Make software verification resilient to a GitHub Actions runner/infrastructure incident without weakening GitHub protected-branch governance.

## Canonical separation

GitHub remains the source-control and merge-governance authority.

CI execution may be supplied by:
1. GitHub-hosted runners.
2. A trusted external CI provider.
3. A controlled private verifier for private repositories.

The protected branch should require a **verification status**, not permanent dependence on one execution substrate.

## Required status contract

The long-term external verifier should publish a deterministic commit status/check such as `External Verification / build`.

The verifier must:
- build from the exact PR head SHA;
- run the same production build command;
- run the policy guard suite;
- fail closed on missing inputs;
- publish success/failure against the exact commit;
- expose immutable logs/artifacts for audit;
- never bypass branch protection;
- never grant merge authority.

## Transition procedure

Current required checks remain authoritative until a replacement status is proven.

Transition order:
1. Implement and validate the external verifier.
2. Prove it against the same PR head SHA as the existing Linux build.
3. Reconcile required-status names in branch protection.
4. Keep GitHub Actions as redundant/non-primary verification during a soak period.
5. Retain human Code Owner approval.
6. Only then remove a permanently unreliable check from the required set.

## Security posture

Do not use Termux/Android as CI for the public repository.
Do not use a long-lived self-hosted runner for untrusted public pull-request code.

The CI resilience design changes the **verification substrate**, not the Whalez-AI, DeltaAlpha-Trade-Pro, or WhalezChain architecture.

## Current blocker

Changing workflow YAML alone cannot repair the present pre-runner GitHub infrastructure failure. The incident is outside the application build itself.

Until an independent verifier is activated and the protected-branch rules are reconciled, the existing required checks remain the source of truth.
