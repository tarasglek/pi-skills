---
name: lkml-patch-review-workflow
description: Use when preparing a git branch for LKML-style submission, making history review-friendly and bisectable
---

# LKML Patch Review Workflow

## Overview
Turn a feature branch into a clean, reviewable, bisectable patch series for LKML-style submission.

## When to Use
- You need LKML-style patch structure (ordered, focused commits)
- You want to review patches offline in one markdown file
- You want to iterate on review comments and rewrite history non-interactively

## Workflow
1. **Safety backup**
   - `git branch backup/pre-lkml-$(date +%Y%m%d-%H%M%S)`
2. **Inspect current series**
   - `git log --oneline --reverse <base>..HEAD`
3. **Rewrite history (non-interactive by default)**
   - Prepare a rebase todo file with `pick/reword/fixup/squash/edit`
   - Run rebase with sequence editor override:
     - `GIT_SEQUENCE_EDITOR='cp /tmp/rebase-todo.txt' git rebase -i <base>`
   - If rebase pauses and requests commit message editor, continue non-interactively:
     - `GIT_EDITOR=true git rebase --continue`
4. **Validate final series**
   - `git log --oneline --reverse <base>..HEAD`
   - `git range-diff backup/pre-lkml-<ts>...HEAD`

## Non-Interactive Rules
- Prefer command flags/env vars over opening editors.
- Always use `GIT_SEQUENCE_EDITOR=...` for interactive rebase automation.
- Always use `GIT_EDITOR=true git rebase --continue` when continuing during automation.
- If you must edit commits, script the edits (`git commit --amend -m ...`) rather than opening editor UIs.

## Review Script (Optional)
Use this when you want a single markdown artifact for manual review comments.

- Script: `./scripts/generate-patch-series-review.sh`
- Default base: inferred from current branch upstream, else `origin/HEAD`
- Default output: `patch-series-review.md`
- Reviewer convention: prefix comments with `R:`

Examples:
```bash
./scripts/generate-patch-series-review.sh
./scripts/generate-patch-series-review.sh --base origin/main
./scripts/generate-patch-series-review.sh --base <base-ref> --output /tmp/series.md
```

## Notes
- Keep commits logically scoped; avoid mixing unrelated changes.
- Keep author attribution unless explicitly asked to rewrite it.
- Drop planning/noise commits from submission series when appropriate.
