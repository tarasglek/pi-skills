# Brief smolvm Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a brief Pi skill for operating smolvm, using it as an agent sandbox, and routing Linux-required work on macOS into a microVM.

**Architecture:** One reference skill with a decision table, minimal command examples, safety defaults, and performance caveats. No scripts or supporting files.

**Tech Stack:** Markdown, Agent Skills frontmatter, Pi CLI, smolvm 1.6.3 CLI.

---

### Task 1: Baseline retrieval test

**Files:**
- Create temporarily: `/tmp/smolvm-skill-test.md`

**Step 1:** Write a prompt asking an agent to choose commands for Linux work on macOS plus one-off, persistent, mounted, and untrusted workloads.

**Step 2:** Run `pi -p --no-session --no-skills @/tmp/smolvm-skill-test.md` and record omissions or unsafe choices.

### Task 2: Minimal skill

**Files:**
- Create: `skills/smolvm/SKILL.md`

**Step 1:** Write only guidance needed to correct baseline failures.

**Step 2:** Validate frontmatter, ensure under 250 words, and compare commands with `smolvm --help`.

### Task 3: Skill verification

**Files:**
- Test: `skills/smolvm/SKILL.md`

**Step 1:** Run same prompt with `pi -p --no-session --no-skills --skill skills/smolvm/SKILL.md @/tmp/smolvm-skill-test.md`.

**Step 2:** Confirm correct macOS-to-Linux routing, workflow selection, safe untrusted defaults, mount caveats, and persistent caching advice.

**Step 3:** Inspect `git diff --check` and commit only plan and skill files.
