#!/usr/bin/env bash
set -euo pipefail

echo "TEST: gitignore exact-line: PASS"
bash ci/policy/check_gitignore_exact.sh ci/policy/fixtures/gitignore/pass.gitignore

echo "TEST: gitignore exact-line: FAIL (substring)"
if bash ci/policy/check_gitignore_exact.sh ci/policy/fixtures/gitignore/fail_substring.gitignore; then
  echo "EXPECTED_FAIL_BUT_PASSED" >&2
  exit 1
fi

echo "TEST: gitignore exact-line: FAIL (whitespace)"
if bash ci/policy/check_gitignore_exact.sh ci/policy/fixtures/gitignore/fail_whitespace.gitignore; then
  echo "EXPECTED_FAIL_BUT_PASSED" >&2
  exit 1
fi

echo "TEST: ban \\Q/\\E: should FAIL on positives"
# This SHOULD fail because fixtures contain banned literals
if bash ci/policy/ban_regex_escapes.sh ci/policy/fixtures/ban_qe; then
  echo "EXPECTED_FAIL_BUT_PASSED" >&2
  exit 1
fi

echo "OK: policy tests complete"
