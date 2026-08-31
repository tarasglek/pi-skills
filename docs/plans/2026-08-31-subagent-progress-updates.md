# Subagent Progress Updates Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Require concise progress updates while manual Pi subagents run.
**Architecture:** Add one monitoring policy section to existing Pi subagent skill. Validate behavior with before/after pressure scenarios.
**Tech Stack:** Markdown skill, Pi subagents

---

- [ ] Task 1: Capture baseline behavior
  - File: `pi-subagent/SKILL.md` (leave unchanged)
  - Test first: run focused agent scenario asking it to launch and monitor a slow child process while keeping user informed.
  - Verify RED: response omits heartbeat, state-change update, or `Done/Now/Next` structure.

- [ ] Task 2: Add progress-update policy
  - File: `pi-subagent/SKILL.md`
  - Implement: require launch, meaningful-state, two-minute heartbeat, and final updates; require `Done: … Now: … Next: …`; suppress raw logs and routine polling noise.
  - Verify GREEN: rerun same scenario with skill context; response includes all required update types and terse format.

- [ ] Task 3: Validate and deploy
  - Files: `pi-subagent/SKILL.md`
  - Verify: inspect diff, check frontmatter, and confirm no unrelated changes.
  - Commit focused skill and plan changes.
