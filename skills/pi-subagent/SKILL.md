---
name: pi-subagent
description: Use when spawning a focused child Pi agent manually without subagent extensions, especially for background implementation, review, research, or isolated long-running work
---

# Pi Subagent

## Overview

Pi core has no built-in subagents. Manual subagents are separate `pi` processes, usually launched in tmux, with their own session and working directory.

## Best Patterns

### Interactive subagent, visible in tmux

Use this when a human may attach and steer it:

```bash
SOCKET=/tmp/claude-tmux-sockets/claude.sock
SESSION=my-agent
PROMPT=/tmp/my-agent-prompt.md
REPO=/path/to/repo

mkdir -p /tmp/claude-tmux-sockets
tmux -S "$SOCKET" new-session -d -s "$SESSION" \
  "cd '$REPO' && pi @'$PROMPT'"
```

Monitor:

```bash
tmux -S /tmp/claude-tmux-sockets/claude.sock attach -t my-agent
tmux -S /tmp/claude-tmux-sockets/claude.sock capture-pane -p -J -t my-agent:0.0 -S -200
```

### JSON event-stream subagent, loggable

Use this when machine-readable progress matters:

```bash
tmux -S "$SOCKET" new-session -d -s "$SESSION" \
  "cd '$REPO' && pi --mode json @'$PROMPT' 2>&1 | tee /tmp/$SESSION.jsonl"
```

Readable live view:

```bash
tail -f /tmp/my-agent.jsonl | jq -r '
  if .type=="tool_execution_start" then "▶ " + .toolName + " " + (.args|tostring)
  elif .type=="tool_execution_end" then "■ " + .toolName + " error=" + (.isError|tostring)
  elif .type=="message_update" and .assistantMessageEvent.type=="text_delta" then .assistantMessageEvent.delta
  elif .type=="agent_end" then "\n✅ agent_end"
  else empty end
'
```

### Avoid `pi -p` for long work

`pi -p` prints mostly only final text. It can look frozen in tmux. Prefer interactive `pi` or `--mode json`.

### Preserve provider extensions

Custom providers and their authentication may come from extensions. Do **not** use `--no-extensions` merely to isolate a subagent or test a skill; this can remove the configured provider and produce `No models match pattern` or `No API key found`.

To test without skill influence, disable skills only:

```bash
pi -p --no-session --no-skills @/tmp/test-prompt.md
```

Before unattended runs, verify selected provider/model exists:

```bash
pi --list-models
```

Use `--no-extensions` only when you have confirmed the chosen provider and credentials work without extensions.

## Continue Existing Work

Find latest session:

```bash
find ~/.pi/agent/sessions -type f | sort | tail -20
```

Relaunch interactively:

```bash
tmux -S "$SOCKET" new-session -d -s "$SESSION" \
  "cd '$REPO' && pi --session '$SESSION_FILE'"
```

Then send a continue prompt:

```bash
tmux -S "$SOCKET" send-keys -t "$SESSION":0.0 -- \
  "Continue from current repo state. Inspect changes, run verification, report blockers." Enter
```

## Prompt Template

Write prompts to files:

```markdown
You are a focused Pi subagent working in /path/to/repo.

Task: ...

Constraints:
- Read AGENTS.md first.
- Do not create a worktree unless asked.
- Make minimal focused changes.
- Run verification.
- End with changed files, verification output, blockers.
```

## Checks

Is it alive?

```bash
pstree -ap $(tmux -S "$SOCKET" list-panes -t "$SESSION" -F '#{pane_pid}')
cd "$REPO" && git status --short
```

Stop it:

```bash
tmux -S "$SOCKET" kill-session -t "$SESSION"
```
