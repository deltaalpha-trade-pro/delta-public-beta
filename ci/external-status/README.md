# External Verification Status Bridge

This bridge lets an independent CI system publish a deterministic GitHub commit status without making that CI system the merge authority.

## Contract

- Status context: `External Verification / build`
- Input commit: exact pull-request head SHA
- Required execution: production build plus policy guard suite
- Publication: `scripts/publish_external_status.mjs`
- Merge authority: GitHub protected branch, unchanged

## Environment

- `GITHUB_TOKEN` — token/app credential with permission to publish commit statuses
- `GITHUB_REPOSITORY` — `owner/repository`
- `GITHUB_SHA` — exact commit under verification
- `EXTERNAL_CI_STATE` — `pending`, `success`, `failure`, or `error`
- `EXTERNAL_CI_TARGET_URL` — optional immutable build log URL
- `EXTERNAL_CI_DESCRIPTION` — optional status description

## Activation sequence

1. An external CI provider checks out `GITHUB_SHA`.
2. It runs the same build and policy commands currently represented by the required Linux/Policy Guards jobs.
3. It publishes `pending` when verification begins.
4. It publishes `success` only after every required verification passes.
5. It publishes `failure` or `error` on any failed/missing verification.
6. GitHub branch protection is changed only after the bridge has been proven on real pull requests.

Never use this bridge to bypass required human Code Owner review or any protected-branch rule.
