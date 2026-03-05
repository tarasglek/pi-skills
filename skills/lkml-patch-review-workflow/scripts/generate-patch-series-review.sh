#!/usr/bin/env bash
set -euo pipefail

BASE=""
OUTPUT="patch-series-review.md"

resolve_default_base() {
  local upstream
  if upstream=$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null); then
    printf '%s\n' "$upstream"
    return 0
  fi

  local origin_head
  if origin_head=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null); then
    printf '%s\n' "$origin_head"
    return 0
  fi

  return 1
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base)
      BASE="$2"
      shift 2
      ;;
    --output)
      OUTPUT="$2"
      shift 2
      ;;
    *)
      echo "Unknown arg: $1" >&2
      echo "Usage: $0 [--base <ref>] [--output <file>]" >&2
      exit 2
      ;;
  esac
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not inside a git repository" >&2
  exit 1
fi

if [[ -z "$BASE" ]]; then
  if ! BASE=$(resolve_default_base); then
    echo "Could not infer base branch. Pass --base <ref>." >&2
    exit 1
  fi
fi

if ! git rev-parse --verify "$BASE" >/dev/null 2>&1; then
  echo "Base ref not found: $BASE" >&2
  exit 1
fi

commits=$(git rev-list --reverse "$BASE"..HEAD)
if [[ -z "$commits" ]]; then
  {
    echo "# Patch Series Review"
    echo
    printf 'Base: `%s`  \n' "$BASE"
    printf 'Range: `%s..HEAD`\n' "$BASE"
    echo
    echo "No commits in range."
  } > "$OUTPUT"
  echo "Wrote $OUTPUT (empty range)"
  exit 0
fi

{
  echo "# Patch Series Review"
  echo
  printf 'Base: `%s`  \n' "$BASE"
  printf 'Range: `%s..HEAD`\n' "$BASE"
  echo
  echo 'Review note convention: prefix comments with `R:`.'
  echo

  while IFS= read -r c; do
    subj=$(git show -s --format='%s' "$c")
    author=$(git show -s --format='%an <%ae>' "$c")
    date=$(git show -s --format='%ad' --date=short "$c")

    echo "## $subj"
    echo
    printf -- '- Commit: `%s`\n' "$c"
    echo "- Author: $author"
    echo "- Date: $date"
    echo
    echo '```diff'
    git show --patch --stat --format= "$c"
    echo '```'
    echo
    echo '> R: '
    echo
  done <<< "$commits"
} > "$OUTPUT"

echo "Wrote $OUTPUT"
