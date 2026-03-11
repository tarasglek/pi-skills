---
name: pi-sub-agents
description: Use when spawning a tmux-hosted pi child session from the current pi context, especially when the parent session must be branched, named, and tracked separately.
---

# pi-sub-agents

## Overview

Spawn a real pi subagent by forking the current parent session into a new child session, then opening it in tmux with aligned naming.

## When to use

Use this when:
- the user wants a separate pi agent in tmux
- the child should inherit current context from the parent session
- the child needs its own session name and status-traceable tmux window

Do not use this for a random fresh pi shell with no relation to the current session.

## Rules

- The parent pi must have been started with `--session`.
- The child must be created by real session branching/forking.
- Do not fake this by launching a fresh unrelated pi session.
- Pass the child task as one quoted string.
- Prefer `deno run -A npm:@mariozechner/pi-coding-agent` in commands and examples.

## Workflow

1. Pick a canonical agent name, for example `agent/auth-audit`.
2. Run the helper with that name and a single quoted task string.
3. The helper should create a real child session fork, name it, and open parent/child windows in tmux.
4. The child tmux window name should include `subagent`.
5. Tell the user they can inspect subagents with:

```bash
tmux list-windows -t pi-agents | grep subagent
```

## Naming guidance

Keep names aligned where practical:
- child session name
- tmux subagent window name
- child self-identity in the opening prompt
- git branch name, if the child creates one
- worktree name, if the child creates one

## Helper invocation

```bash
node ~/.pi/agent/skills/skills/pi-sub-agents/pi-sub-agents.ts --name agent/auth-audit --task "Investigate auth flow and report only"
```

## Preconditions if parent is missing `--session`

Tell the user to do this in the parent pi:

```text
/session
/name parent/<task>   # optional
```

Then restart with:

```bash
deno run -A npm:@mariozechner/pi-coding-agent --session <id-or-path>
```

Fallback if needed:

```bash
pi --session <id-or-path>
```
