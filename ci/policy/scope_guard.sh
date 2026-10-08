#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

CODEOWNERS="$ROOT/.github/CODEOWNERS"

if [[ ! -f "$CODEOWNERS" ]]; then
  echo "SCOPE_GUARD_FAIL: missing .github/CODEOWNERS" >&2
  exit 1
fi

required_paths=(
  "/.github/workflows/**"
  "/ci/**"
  "/scripts/**"
  "/package.json"
  "/package-lock.json"
  "/next.config.js"
  "/next.config.mjs"
  "/vercel.json"
  "/.npmrc"
)

fail=0

for path in "${required_paths[@]}"; do
  case "$path" in
    "/.github/workflows/**")
      pattern='^/\.github/workflows/\*\*'
      ;;
    "/ci/**")
      pattern='^/ci/\*\*'
      ;;
    "/scripts/**")
      pattern='^/scripts/\*\*'
      ;;
    "/package.json")
      pattern='^/package\.json[[:space:]]'
      ;;
    "/package-lock.json")
      pattern='^/package-lock\.json[[:space:]]'
      ;;
    "/next.config.js")
      pattern='^/next\.config\.js[[:space:]]'
      ;;
    "/next.config.mjs")
      pattern='^/next\.config\.mjs[[:space:]]'
      ;;
    "/vercel.json")
      pattern='^/vercel\.json[[:space:]]'
      ;;
    "/.npmrc")
      pattern='^/\.npmrc[[:space:]]'
      ;;
  esac

  if ! grep -Eq "$pattern" "$CODEOWNERS"; then
    echo "SCOPE_GUARD_FAIL: CODEOWNERS does not cover $path" >&2
    fail=1
  fi
done

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi

echo "SCOPE_GUARD_PASS: all build-authority surfaces have CODEOWNERS coverage"
