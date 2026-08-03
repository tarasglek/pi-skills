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

## Commit Message Standard

Every non-trivial patch needs a concise subject **and a rationale body**. Splitting history without preserving why each patch exists is not review-ready.

Each body should explain, as applicable:

- the observed failure or limitation;
- the root cause or violated invariant;
- why this change is the right boundary and approach;
- consequences of leaving the old behavior in place;
- validation or evidence that motivated the patch.

Do not narrate the diff line by line or pad the body. Write enough context that a reviewer who has not seen the debugging session can understand the decision.

When folding a later fix into the commit that introduced the affected code, carry the fix's rationale into that introducing commit's body. The final series must not retain knowingly broken intermediate states merely to preserve chronological history.

## Workflow
1. **Safety backup**
   - `git branch backup/pre-lkml-$(date +%Y%m%d-%H%M%S)`
2. **Inspect current series**
   - `git log --oneline --reverse <base>..HEAD`
3. **Rewrite history (non-interactive by default)**
   - Group changes by reviewable intent, not implementation chronology.
   - Fold corrective commits into the patch that introduced the behavior when doing so removes a known-broken intermediate state.
   - Prepare a rebase todo file with `pick/reword/fixup/squash/edit`.
   - Run rebase with sequence editor override:
     - `GIT_SEQUENCE_EDITOR='cp /tmp/rebase-todo.txt' git rebase -i <base>`
   - Reword every non-trivial patch to satisfy the commit-message standard above.
   - If rebase pauses and requests a commit message editor, continue non-interactively:
     - `GIT_EDITOR=true git rebase --continue`
4. **Validate final series**
   - Build/test each commit when ordering or dependencies changed; every commit should be bisectable.
   - Inspect subjects and bodies: `git log --reverse --format=fuller <base>..HEAD`.
   - Compare content and intent: `git range-diff backup/pre-lkml-<ts>...HEAD`.
   - Confirm folded fixes left no corrective/intermediate commits in the final series.

## Non-Interactive Rules
- Prefer command flags/env vars over opening editors.
- Always use `GIT_SEQUENCE_EDITOR=...` for interactive rebase automation.
- Always use `GIT_EDITOR=true git rebase --continue` when continuing during automation.
- If you must edit commits, script the edits (`git commit --amend -m ...`) rather than opening editor UIs.

## Review Script (Optional)
Use this when you want a single markdown artifact for manual review comments.

- Run from this skill directory.
- Script: `./scripts/generate-patch-series-review.sh`
- Default base: inferred from current branch upstream, else `origin/HEAD`
- Default output: `patch-series-review.md`
- Reviewer convention: prefix comments with `R:`

Recommended agentic review loop:
1. Generate review markdown (script auto-commits).
2. Add/edit `R:` comments in that file.
3. Use `git diff` to extract feedback lines and update patch history.
4. Stash the review markdown. Adjust history accordingly

## Notes
- Keep commits logically scoped; avoid mixing unrelated changes.
- Keep author attribution unless explicitly asked to rewrite it.
- Drop planning/noise commits from submission series when appropriate.
- For large `patch-series-review.md` files, open in VS Code and use **Fold All** (`Ctrl+K Ctrl+0`) to collapse sections, then expand commit-by-commit for focused review.
