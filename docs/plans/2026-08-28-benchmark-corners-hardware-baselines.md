# Benchmark Corners Hardware Baselines Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans.

**Goal:** Add a brief generalized hardware-baseline rule.

- [ ] Test then update `skills/benchmark-corners/SKILL.md`
  - RED: run benchmark-recording scenarios without the skill; confirm missing segmentation, privacy, or Git-bloat discipline.
  - GREEN: add only the rolling per-hardware JSON baseline and ignored candidate/raw rule.
  - Verify: rerun scenarios with the skill; check brevity, frontmatter, and diff.
