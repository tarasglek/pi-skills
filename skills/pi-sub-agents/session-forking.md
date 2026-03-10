# Session Forking and Naming

## Required workflow

The helper must create a real child session by branching/forking from the parent session's current leaf.

Accepted flow:
1. detect parent `pi`
2. extract parent `--session <value>`
3. resolve that value to a real session file
4. open the parent session with pi SDK/session APIs
5. read the current leaf
6. create a branched child session file from that leaf
7. name the child session
8. launch child pi against that new child session file

Rejected flow:
- launching a fresh unrelated pi session
- launching a second pi on the parent session file without branching first
- trying to fake branching with tmux-only behavior

## Session resolution

If the parent `--session` value is:
- a path: open it directly
- an ID or partial UUID: resolve it to a session path using pi-compatible session lookup logic before opening it

Display names are not session selectors.

## SDK/session calls to use

Primary approach:
- `SessionManager.open(parentPath)`
- `getLeafId()`
- `createBranchedSession(leafId)`
- reopen child session file
- `appendSessionInfo(name)` or `setSessionName(name)`

## Naming synchronization

Canonical logical name example:
- `agent/auth-audit`

Derived values:
- child pi session name: `agent/auth-audit`
- tmux child window name: sanitized and includes `subagent`
- child prompt prefix: identifies itself as `agent/auth-audit`

## Prompt handling

The initial child task must be passed as one quoted string from helper CLI to the spawned child pi command.

Good:
```bash
--task "Investigate auth flow and report only"
```

Bad:
```bash
--task Investigate auth flow and report only
```

The child must receive one task prompt, not multiple fragments.

## Launcher preference

Prefer this launcher in helper-generated commands and docs:

```bash
deno run -A npm:@mariozechner/pi-coding-agent
```

Use a shorter `pi` launcher only if the local environment explicitly relies on it.

## Skill-only naming guidance

The skill should additionally tell spawned agents:
- if they create a git branch, keep its name aligned with the agent name when practical
- if they create a worktree, keep its name aligned with the agent name when practical

That guidance belongs in the skill, not in the helper script.
