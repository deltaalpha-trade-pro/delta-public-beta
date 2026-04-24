#!/usr/bin/env bash
set -u

OWNER="deltaalpha-trade-pro"
REPO="delta-public-beta"
REPO_SPEC="$OWNER/$REPO"
PR_ORDER=(9 10)
PR9_MERGED=false
APPROVAL_MESSAGE="Approved per founder production request"
MERGE_METHOD="squash"

log() { echo "$(date -Iseconds) - $*"; }
fail() { echo "ERROR: $*" >&2; exit 1; }

for cmd in gh git jq; do
  command -v "$cmd" >/dev/null 2>&1 || fail "Missing required command: $cmd"
done

gh auth status >/dev/null 2>&1 || fail "gh is not authenticated. Run: gh auth login"

get_pr_json() {
  gh pr view "$1" --repo "$REPO_SPEC" --json number,title,isDraft,mergeable,mergeStateStatus,headRefName,headRefOid,baseRefName,state
}

wait_for_checks() {
  local pr="$1"
  log "Checking required checks for PR #$pr..."
  gh pr checks "$pr" --repo "$REPO_SPEC" --watch
}

approve_pr() {
  local pr="$1"
  log "Approving PR #$pr..."
  gh pr review "$pr" --repo "$REPO_SPEC" --approve --body "$APPROVAL_MESSAGE" || true
}

merge_pr() {
  local pr="$1"
  log "Squash-merging PR #$pr..."
  gh pr merge "$pr" --repo "$REPO_SPEC" --squash --delete-branch --confirm
}

update_branch() {
  local pr="$1"
  log "Updating PR #$pr branch with latest main..."
  gh pr checkout "$pr" --repo "$REPO_SPEC" || return 1
  git fetch origin main || return 1
  git merge --no-edit origin/main || {
    git merge --abort >/dev/null 2>&1 || true
    return 2
  }
  git push origin HEAD || return 1
}

for pr in "${PR_ORDER[@]}"; do
  log "=== Processing PR #$pr ==="

  if [ "$pr" -eq 10 ] && [ "$PR9_MERGED" != true ]; then
    log "SKIP: PR #10 requires PR #9 to merge first."
    continue
  fi

  pr_json="$(get_pr_json "$pr")" || {
    log "SKIP: Could not read PR #$pr."
    continue
  }

  title="$(echo "$pr_json" | jq -r '.title')"
  is_draft="$(echo "$pr_json" | jq -r '.isDraft')"
  mergeable="$(echo "$pr_json" | jq -r '.mergeable')"
  merge_state="$(echo "$pr_json" | jq -r '.mergeStateStatus')"

  log "PR #$pr: $title"
  log "draft=$is_draft mergeable=$mergeable mergeStateStatus=$merge_state"

  if [ "$is_draft" = "true" ]; then
    log "SKIP: PR #$pr is still draft."
    continue
  fi

  if [ "$mergeable" = "CONFLICTING" ] || [ "$mergeable" = "false" ]; then
    log "SKIP: PR #$pr has conflicts."
    continue
  fi

  if [ "$pr" -eq 10 ]; then
    update_branch "$pr"
    rc=$?
    if [ "$rc" -eq 2 ]; then
      log "SKIP: PR #10 has conflicts after updating with main."
      continue
    fi
  fi

  wait_for_checks "$pr" || {
    log "SKIP: PR #$pr checks failed or did not complete."
    continue
  }

  approve_pr "$pr"

  merge_pr "$pr" && {
    log "SUCCESS: PR #$pr merged."
    if [ "$pr" -eq 9 ]; then
      PR9_MERGED=true
    fi
  } || {
    log "SKIP: PR #$pr could not be merged. Branch protection may require another approving reviewer."
    continue
  }
done

log "Production merge script finished."
