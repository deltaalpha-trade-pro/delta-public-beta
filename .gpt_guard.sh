#!/usr/bin/env bash
set -euo pipefail

ROOT_POLICY_PATH="${HOME}/ROOT/GPT_TOOL_POLICY.md"

if [ ! -f "${ROOT_POLICY_PATH}" ]; then
  echo "❌ GPT policy missing in ROOT: ${ROOT_POLICY_PATH}"
  exit 1
fi

scan_dir="."
exclude_args=(
  --exclude-dir=.git
  --exclude-dir=node_modules
  --exclude-dir=.next
  --exclude=.gpt_guard.sh
)

# 1) GPT must never be authority
if grep -RIn "${exclude_args[@]}" \
  -E 'authority[[:space:]]*[:=][[:space:]]*(gpt|llm|agent)' "${scan_dir}" >/dev/null 2>&1; then
  echo "❌ GPT treated as authority (forbidden)"
  exit 1
fi

# 2) binding=true is forbidden ONLY when GPT is involved in same file
files_with_gpt="$(grep -RIl "${exclude_args[@]}" -E '(gpt|llm|agent)' "${scan_dir}" || true)"

for f in ${files_with_gpt}; do
  if grep -nE 'binding[[:space:]]*[:=][[:space:]]*true' "$f" >/dev/null 2>&1; then
    echo "❌ GPT output marked binding=true (forbidden) in: $f"
    exit 1
  fi
done

echo "✅ GPT wiring verified (tool-only, non-authoritative)"
