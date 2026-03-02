#!/usr/bin/env bash
set -euo pipefail

# Capture exit code correctly (do NOT use "|| true" inside the command substitution)
set +e
out="$(TERMUX_VERSION=1 node scripts/guarded-next.mjs build 2>&1)"
ec=$?
set -e

if [[ "$ec" -ne 42 ]]; then
  echo "EXPECTED_EXIT_42_GOT_$ec" >&2
  echo "$out" >&2
  exit 1
fi

echo "$out" | grep -F -q "TERMUX_GUARD_BLOCKED:" || { echo "MISSING_BLOCK_MESSAGE" >&2; exit 1; }

echo "OK: termux guard blocks deterministically"
