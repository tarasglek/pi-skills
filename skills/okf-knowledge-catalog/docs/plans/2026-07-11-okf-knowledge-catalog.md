# OKF Knowledge Catalog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build local-first skill for durable notes, memories, and OKF knowledge bundles.

**Architecture:** Compact intent router in `SKILL.md`; format detail in `references/okf-format.md`. Reuse upstream terminology and conventions.

**Tech Stack:** Markdown, YAML frontmatter, filesystem/git tools.

---

1. Run baseline scenarios without skill and record missing OKF rules.
2. Write `SKILL.md` with triggers, routing, memory guidance, safety, and quick reference.
3. Write concise OKF reference from upstream v0.1 specification.
4. Run same scenarios with skill loaded.
5. Inspect frontmatter, word count, and references; refine gaps.
