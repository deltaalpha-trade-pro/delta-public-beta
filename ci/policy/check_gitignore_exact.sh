#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-.gitignore}"
REQ="${2:-ci/policy/gitignore.required.lines}"

if [[ ! -f "$TARGET" ]]; then
  echo "MISSING_TARGET: $TARGET" >&2
  exit 2
fi
if [[ ! -f "$REQ" ]]; then
  echo "MISSING_REQUIRED_FILE: $REQ" >&2
  exit 2
fi

fail=0
# Normalize CRLF deterministically by stripping CR from inputs
while IFS= read -r line || [[ -n "$line" ]]; do
  line="${line%$'\r'}"
  [[ -z "$line" ]] && continue
  if ! tr -d '\r' < "$TARGET" | grep -F -x -- "$line" >/dev/null 2>&1; then
    echo "MISSING_REQUIRED_GITIGNORE_LINE: $line" >&2
    fail=1
  fi
done < <(tr -d '\r' < "$REQ")

exit "$fail"
