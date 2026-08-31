# Subagent Progress Updates Design

## Goal

Keep user informed while manual Pi subagents run, without flooding conversation.

## Behavior

- Send immediate update after launching subagents.
- Send update when meaningful state changes: tool/research phase changes, completion, failure, or blocker.
- During silence, send heartbeat about every two minutes.
- Use terse format: `Done: … Now: … Next: …`.
- Keep updates caveman brief; omit raw logs and routine polling noise.
- Always send final completion or blocker update.

## Implementation

Add compact “Progress Updates” section to `pi-subagent/SKILL.md`, near monitoring instructions. Existing launch and monitoring commands remain unchanged.

## Verification

Run baseline scenario without new section, then same scenario with edited skill. Passing behavior includes immediate, state-change, periodic, and final updates in required format without noisy logs.
