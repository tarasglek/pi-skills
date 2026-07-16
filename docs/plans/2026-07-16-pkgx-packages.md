# pkgx Package Search and Shim Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a compact skill that correctly guides pkgx package search and pkgm shim creation.

**Architecture:** One self-contained reference skill at `skills/pkgx-packages/SKILL.md`. Test it as process documentation: capture baseline agent answers without the skill, add only guidance needed to correct failures, then rerun the same scenarios.

**Tech Stack:** Markdown, YAML frontmatter, shell commands, Pi subagents

---

### Task 1: Capture Baseline Failures

**Files:**
- Create: `/tmp/pkgx-skill-test-1.md`
- Create: `/tmp/pkgx-skill-test-2.md`
- Create: `/tmp/pkgx-skill-baseline.txt`

**Step 1: Write application scenarios**

`/tmp/pkgx-skill-test-1.md`:

```markdown
How do I find the pkgx package providing ripgrep, then make its command persist using a pkgm shim? Be terse and give exact commands.
```

`/tmp/pkgx-skill-test-2.md`:

```markdown
List all pkgx packages, create a Node 22 pkgm shim, and explain whether that is a full install. Mention anything required for shell command discovery.
```

**Step 2: Run scenarios without the new skill**

Run each prompt in a focused Pi process from `/Users/tglek/.pi/agent/skills`, saving final output to `/tmp/pkgx-skill-baseline.txt`.

**Step 3: Record failures**

Check for missing or wrong guidance: `pkgx -Q`, `pkgm shim PACKAGE[@VERSION]`, shim-on-demand semantics, and `~/.local/bin` in `PATH`. Preserve exact baseline wording.

### Task 2: Write Minimal Skill

**Files:**
- Create: `skills/pkgx-packages/SKILL.md`

**Step 1: Write minimal implementation**

```markdown
---
name: pkgx-packages
description: Use when finding packages or executables available through pkgx, or making pkgx commands persistent with pkgm shims
---

# pkgx Packages

Find package, make command stay available. Shim runs package through `pkgx` on demand; not full install.

## Search

```sh
pkgx -Q QUERY     # find matching executable/package
pkgx -Q           # list everything
```

Search returns fully qualified project name when needed. Web fallback: <https://pkgx.dev/pkgs/>.

## Shim

```sh
pkgm shim PACKAGE
pkgm shim PACKAGE@VERSION
```

Example:

```sh
pkgx -Q rg
pkgm shim ripgrep
command -v rg
rg --version
```

Shim lands in `~/.local/bin`. Ensure directory in `PATH`:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

Need real install instead? Use `pkgm install PACKAGE`; shim only fetches/runs through `pkgx` when invoked.
```

**Step 2: Check structure and size**

Run:

```bash
python3 - <<'PY'
from pathlib import Path
p = Path('skills/pkgx-packages/SKILL.md')
s = p.read_text()
assert s.startswith('---\nname: pkgx-packages\ndescription: Use when')
assert s.count('\n---\n') == 1
for text in ('pkgx -Q QUERY', 'pkgm shim PACKAGE', '~/.local/bin', 'not full install'):
    assert text in s, text
print('PASS')
PY
wc -w skills/pkgx-packages/SKILL.md
```

Expected: `PASS`; word count near 120 and below 180.

### Task 3: Verify Agent Application

**Files:**
- Create: `/tmp/pkgx-skill-green.txt`
- Modify: `skills/pkgx-packages/SKILL.md` only if tests expose a gap

**Step 1: Rerun same scenarios with skill available**

Run both Task 1 prompts in fresh Pi processes. Save exact answers to `/tmp/pkgx-skill-green.txt`.

**Step 2: Compare results**

Expected answers use correct query and shim syntax, distinguish shims from full installs, and mention PATH where relevant.

**Step 3: Refactor only if needed**

Patch smallest wording gap. Rerun structure check and both scenarios until green.

**Step 4: Commit**

```bash
git add skills/pkgx-packages/SKILL.md
git commit -m "feat: add pkgx package shim skill"
```

### Task 4: Final Verification

**Files:**
- Verify: `skills/pkgx-packages/SKILL.md`

**Step 1: Compare commands with upstream docs**

Confirm against:

- <https://github.com/pkgxdev/pkgx#what-can-pkgx-run>
- <https://github.com/pkgxdev/pkgm#usage>

**Step 2: Inspect repository state**

```bash
git status --short
git log -2 --oneline
```

Expected: skill and plan commits present; pre-existing `mitsuhiko-pi-agent-stuff` submodule change remains untouched.
