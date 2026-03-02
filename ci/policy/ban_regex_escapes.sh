#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

# Deterministic scan scope
# (ignore vendor dirs)
files="$(find "$ROOT" \
  -type f \( -name '*.sh' -o -name '*.js' -o -name '*.mjs' -o -name '*.ts' -o -name '*.yml' -o -name '*.yaml' \) \
  ! -path '*/.git/*' \
  ! -path '*/node_modules/*' \
  ! -path '*/.next/*' \
)"

hit=0
while IFS= read -r f; do
  # Fixed-string search only
  if grep -n -F '\Q' "$f" >/dev/null 2>&1; then
    echo "BANNED_LITERAL_FOUND: \\Q in $f" >&2
    grep -n -F '\Q' "$f" >&2 || true
    hit=1
  fi
  if grep -n -F '\E' "$f" >/dev/null 2>&1; then
    echo "BANNED_LITERAL_FOUND: \\E in $f" >&2
    grep -n -F '\E' "$f" >&2 || true
    hit=1
  fi
done <<< "$files"

exit "$hit"
