# tmux Layout

## Default tmux session

Use:
- tmux session name: `pi-agents`

## Required windows

Create or reuse two windows:
- parent window: tied to the parent session
- child window: tied to the forked child session

The child window name must include `subagent` for easy filtering/status checks.

Examples:
- `parent-auth-audit`
- `subagent-auth-audit`

## Launch behavior

Both windows should launch from the parent cwd if available.

Parent window command shape:
```bash
cd <cwd> && deno run -A npm:@mariozechner/pi-coding-agent --session <parent>
```

Child window command shape:
```bash
cd <cwd> && deno run -A npm:@mariozechner/pi-coding-agent --session <child> "<task>"
```

The child task must remain one quoted string.

## Collision handling

If the desired window name already exists, append a numeric suffix:
- `subagent-auth-audit`
- `subagent-auth-audit-2`
- `subagent-auth-audit-3`

Do not overwrite or kill existing unrelated windows.

## Missing tmux

If `tmux` is unavailable, hard-fail with a clear error.

## User status checks

The skill should tell users they can inspect windows with `subagent` in the name to check spawned-agent status quickly.

Useful examples:
```bash
tmux list-windows -t pi-agents
```

```bash
tmux list-windows -t pi-agents | grep subagent
```

## Attach policy

The helper does not need to auto-attach.
It should print a follow-up command instead:

```bash
tmux attach -t pi-agents
```
