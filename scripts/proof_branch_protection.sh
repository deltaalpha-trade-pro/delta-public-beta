#!/usr/bin/env bash
set -euo pipefail

OWNER="${1:-deltaalpha-trade-pro}"
REPO="${2:-delta-public-beta}"
BRANCH="${3:-main}"
OUT="${4:-docs/governance/proofs/branch-protection-$(date -I).md}"

mkdir -p "$(dirname "$OUT")"

echo "# Branch Protection Proof" > "$OUT"
echo "" >> "$OUT"
echo "- repo: $OWNER/$REPO" >> "$OUT"
echo "- branch: $BRANCH" >> "$OUT"
echo "- generated: $(date -Is)" >> "$OUT"
echo "" >> "$OUT"
echo "## Raw protection JSON" >> "$OUT"
echo '```json' >> "$OUT"
gh api "repos/$OWNER/$REPO/branches/$BRANCH/protection" >> "$OUT"
echo "" >> "$OUT"
echo '```' >> "$OUT"

echo "WROTE: $OUT"
