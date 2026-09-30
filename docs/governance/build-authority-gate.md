# Build Authority Gate (FR-20260302)

## Purpose
This repository contains build-artifact production surfaces (Next/Vercel). Any change that could affect build execution, dependency resolution, or deployment must be protected by enforceable merge gates.

This policy is written to prevent accidental or unauthorized activation of Termux/Android build paths (notably Next/SWC).

## Build-authority surfaces (protected paths)
The following paths are considered **build-authority surfaces**:

- `.github/workflows/**`
- `ci/**`
- `scripts/**`
- `package.json`
- `package-lock.json`
- `next.config.*`
- `vercel.json` (if present)
- `.npmrc` (if present)

## Enforceable merge gate mechanism
Merge to the protected branch MUST require:

1. Branch protection with:
   - Required status checks:
     - `Linux Build / build`
     - `Policy Guards / scope-guard`
     - `Policy Guards / gitignore-exact`
     - `Policy Guards / ban-qe`
   - Required reviews:
     - “Require review from Code Owners” enabled.
     - Approver group (CODEOWNERS) must cover all build-authority surfaces above.

2. CODEOWNERS entries (in-repo) covering build-authority surfaces.

## Termux posture (binding)
- Termux/Android is **smoke-only**.
- Termux checks MUST NOT be configured as “required checks”.
- Production build artifacts are gated only by Linux CI and the deployment platform (Vercel).

## How to verify (reproducible)
Generate proof of branch protection + required checks:

- Run: `bash scripts/proof_branch_protection.sh`
- Commit the generated proof into: `docs/governance/proofs/branch-protection-YYYY-MM-DD.md`

The proof must show:
- Required checks list
- “Termux smoke (non-blocking)” is NOT required
- Linux Build + Policy Guards ARE required
- `termux-guard-tests` may run as a non-blocking smoke check, but MUST NOT be a required status check
