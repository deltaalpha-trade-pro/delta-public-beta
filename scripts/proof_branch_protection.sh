#!/usr/bin/env bash
set -euo pipefail

REPO="${GITHUB_REPOSITORY:-deltaalpha-trade-pro/delta-public-beta}"
BRANCH="${1:-main}"
DATE="$(date +%F)"
OUT="docs/governance/proofs/branch-protection-${DATE}.md"

required_checks=(
  "Linux Build / build"
  "Policy Guards / scope-guard"
  "Policy Guards / gitignore-exact"
  "Policy Guards / ban-qe"
)

echo "Repository: ${REPO}"
echo "Branch: ${BRANCH}"
echo "Output: ${OUT}"

mkdir -p "$(dirname "$OUT")"

protection="$(gh api \
  "repos/${REPO}/branches/${BRANCH}/protection" \
  --jq '{
    required_status_checks,
    enforce_admins: .enforce_admins.enabled,
    required_pull_request_reviews
  }')"

python - "$OUT" "$REPO" "$BRANCH" "$protection" <<'PY'
import json
import sys
from pathlib import Path
from datetime import datetime, timezone

out, repo, branch, raw = sys.argv[1:5]
data = json.loads(raw)

checks = data.get("required_status_checks")
reviews = data.get("required_pull_request_reviews")

actual_checks = []
if checks:
    actual_checks = [
        c.get("context")
        for c in checks.get("checks", [])
        if c.get("context")
    ]
    actual_checks += [
        c for c in checks.get("contexts", [])
        if c not in actual_checks
    ]

required = [
    "Linux Build / build",
    "Policy Guards / scope-guard",
    "Policy Guards / gitignore-exact",
    "Policy Guards / ban-qe",
]

missing = [x for x in required if x not in actual_checks]

termux_required = any(
    "termux" in x.lower()
    for x in actual_checks
)

code_owner_reviews = bool(
    reviews and reviews.get("require_code_owner_reviews")
)

approvals = (
    reviews.get("required_approving_review_count", 0)
    if reviews else 0
)

enforce_admins = bool(data.get("enforce_admins"))

status = "PASS"
failures = []

if missing:
    status = "FAIL"
    failures.append("Missing required status checks: " + ", ".join(missing))

if termux_required:
    status = "FAIL"
    failures.append("Termux smoke check is incorrectly required")

if not code_owner_reviews:
    status = "FAIL"
    failures.append("Require review from Code Owners is disabled")

if approvals < 1:
    status = "FAIL"
    failures.append("Required approving review count is below 1")

if not enforce_admins:
    status = "FAIL"
    failures.append("Admin enforcement is disabled")

text = f"""# Branch Protection Proof

- Generated: {datetime.now(timezone.utc).isoformat()}
- Repository: `{repo}`
- Branch: `{branch}`
- Overall result: **{status}**

## Required status checks

Expected:

"""

for x in required:
    text += f"- `{x}`\n"

text += "\nActual:\n"

if actual_checks:
    for x in actual_checks:
        text += f"- `{x}`\n"
else:
    text += "- **NONE**\n"

text += f"""
## Termux posture

- Termux/Android is smoke-only.
- Required Termux status check present: **{"YES" if termux_required else "NO"}**
- Required Termux status check is therefore: **{"FAIL" if termux_required else "PASS"}**

## Review enforcement

- Require Code Owner review: **{"ENABLED" if code_owner_reviews else "DISABLED"}**
- Required approving reviews: **{approvals}**
- Admin enforcement: **{"ENABLED" if enforce_admins else "DISABLED"}**

## Findings

"""

if failures:
    for failure in failures:
        text += f"- ❌ {failure}\n"
else:
    text += "- ✅ Branch protection satisfies the documented gate.\n"

Path(out).write_text(text)
print(text)

if status != "PASS":
    raise SystemExit(1)
PY
