# Research Notes

## Verified pi APIs to use

From the installed `@mariozechner/pi-coding-agent` package (`0.57.1`):

- Open an existing session file:
  - `SessionManager.open(path, sessionDir?)`
- Read current leaf:
  - `sessionManager.getLeafId()`
  - `sessionManager.getLeafEntry()`
- Create a branched session file from a leaf:
  - `sessionManager.createBranchedSession(leafId)`
- Set or persist a session name:
  - `sessionManager.appendSessionInfo(name)`
  - `AgentSession.setSessionName(name)`
- Open/create agent sessions programmatically:
  - `createAgentSession({...})`

## Important source conclusions

- There is no documented CLI `--fork` flag in `pi -h`.
- Pi’s interactive `/fork` ultimately uses SDK/session machinery.
- For this skill/helper, programmatic forking is better than trying to drive the TUI.
- Sessions store names via `session_info` entries, so session naming is a stable concept.
- `--session` accepts a path or partial UUID; display names are not CLI session selectors.

## Symbols confirmed in installed dist/types

- `SessionManager.open(...)`
- `SessionManager.getLeafId()`
- `SessionManager.createBranchedSession(leafId)`
- `SessionManager.appendSessionInfo(name)`
- `AgentSession.setSessionName(name)`
- `AgentSession.fork(entryId)`
- `SessionInfo.name`
- `SessionInfo.parentSessionPath`

## Implementation decision

Use pi SDK/session APIs directly for:
- resolving/opening parent sessions
- forking from the current leaf
- naming the child session

Do not automate interactive `/fork` in tmux.
Do not treat launching a second unrelated pi process as a substitute for real session branching.
Prefer `deno run -A npm:@mariozechner/pi-coding-agent` as the default launcher in skill examples and helper-spawned commands.
