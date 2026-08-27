# Benchmark Corners Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a global skill for compact smallest/largest latency and bandwidth benchmark reporting.
**Architecture:** One short `SKILL.md`; no helper scripts.
**Tech Stack:** Pi Agent Skills Markdown

---

- [ ] Task 1: Add and verify benchmark corners skill
  - Files: `skills/benchmark-corners/SKILL.md`
  - RED: preserve three baseline prompt outputs showing inconsistent or redundant reporting.
  - Implement: require useful payload corners, bandwidth, min/p50/p95/p99 latency, compact slash format, samples, errors, and explicit missing data.
  - GREEN: rerun all three prompts with only this skill loaded; validate skill discovery and format.
