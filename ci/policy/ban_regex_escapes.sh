#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
bs="$(printf '\\')"  # backslash character
pat_q="${bs}Q"
pat_e="${bs}E"

# Skip fixtures unless WHALEZ_SCAN_FIXTURES=1 is set
EXCLUDE_FIXTURES=1
if [[ "${WHALEZ_SCAN_FIXTURES:-0}" == "1" ]]; then
  EXCLUDE_FIXTURES=0
fi

find_args=(
  "$ROOT"
  -type f
  \( -name '*.sh' -o -name '*.js' -o -name '*.mjs' -o -name '*.ts' -o -name '*.yml' -o -name '*.yaml' \)
  ! -path '*/.git/*'
  ! -path '*/node_modules/*'
  ! -path '*/.next/*'
)

if [[ "$EXCLUDE_FIXTURES" -eq 1 ]]; then
  find_args+=( ! -path '*/ci/policy/fixtures/*' )
fi

hit=0
while IFS= read -r f; do
  if grep -n -F -- "$pat_q" "$f" >/dev/null 2>&1; then
    echo "BANNED_LITERAL_FOUND: backslash+Q in $f" >&2
    grep -n -F -- "$pat_q" "$f" >&2 || true
    hit=1
  fi
  if grep -n -F -- "$pat_e" "$f" >/dev/null 2>&1; then
    echo "BANNED_LITERAL_FOUND: backslash+E in $f" >&2
    grep -n -F -- "$pat_e" "$f" >&2 || true
    hit=1
  fi
done < <(find "${find_args[@]}")

exit "$hit"
