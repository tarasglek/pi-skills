# Brief smolvm Skill Design

## Goal

Create one concise Pi skill covering both smolvm operator commands and agent sandbox decisions.

## Design

Add `skills/smolvm/SKILL.md`, targeting under 250 words. Trigger on smolvm, microVM sandboxing, persistent VM, Smolfile, host mounts, or isolated command requests.

Skill uses a decision table:

- one-off command → ephemeral `machine run`
- repeated work → persistent `create`, `start`, `exec`
- host sharing → `-v HOST:GUEST[:ro]`
- reproducible setup → Smolfile
- repeatable ephemeral startup without pulls → packed artifact

Safety guidance defaults untrusted workloads to no network, no secrets, and no host mounts; required mounts should be narrow and read-only. Operational caveats cover ephemeral image pulls, boot-fixed mounts, and virtiofs metadata cost. Important dependencies and build outputs stay guest-local.

## Verification

Run a baseline reference-retrieval scenario without the skill, then run the same scenario with the explicit skill loaded. Validate Pi frontmatter, word count, command accuracy against smolvm 1.6.3 help, and git diff scope.
