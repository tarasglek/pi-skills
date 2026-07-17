# Brief smolvm Skill Design

## Goal

Create one concise Pi skill covering smolvm operator commands, agent sandbox decisions, Linux work on macOS, and requests needing microVM isolation.

## Design

Add `skills/smolvm/SKILL.md`, targeting under 250 words. Trigger on smolvm; microVM isolation; persistent VM, Smolfile, or host-mount requests; and tasks on macOS that need an actual Linux environment. Do not trigger for Linux discussion or documentation alone.

Skill uses a decision table:

- one-off command → ephemeral `machine run`
- repeated work → persistent `create`, `start`, `exec`
- host sharing → `-v HOST:GUEST[:ro]`
- reproducible setup → Smolfile
- repeatable ephemeral startup without pulls → packed artifact

Safety guidance defaults untrusted workloads to no network, no secrets, and no host mounts; required mounts should be narrow and read-only. On macOS, actual Linux commands, packages, builds, tests, binaries, containers, or filesystem behavior should run in smolvm; ordinary safe macOS work and Linux discussion should not. Operational caveats cover ephemeral image pulls, boot-fixed mounts, and virtiofs metadata cost. Important dependencies and build outputs stay guest-local.

## Verification

Run a baseline reference-retrieval scenario without the skill, then run the same scenario with the explicit skill loaded. Validate Pi frontmatter, word count, command accuracy against smolvm 1.6.3 help, and git diff scope.
