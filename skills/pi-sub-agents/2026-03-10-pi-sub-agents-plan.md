# pi-sub-agents TL;DR Plan

## Goal
Create a `pi-sub-agents` skill and a Node/TypeScript helper that:
- detects the invoking parent `pi`
- requires that parent `pi` was launched with `--session`
- forks the current parent session into a named child session
- opens both parent and child in a tmux session
- keeps child session name and tmux window name in sync

## Core decisions
- Use pi SDK/session APIs for forking and naming.
- Do **not** automate interactive `/fork` in the TUI.
- Do **not** parse `/proc` directly.
- Use maintained Node libraries for process inspection.
- If required parent process details cannot be obtained from libraries, **hard-fail**.
- The script handles session/tmux naming only.
- The skill should additionally tell agents to keep branch/worktree names aligned with the agent name when practical.
- Prioritize `deno run -A npm:@mariozechner/pi-coding-agent` as the default pi launcher in examples and instructions.
- Real session branching is required; simply opening another unrelated pi session does not satisfy the workflow.

## Required behavior
1. Helper discovers the parent `pi` automatically.
2. Helper reads the parent CLI args.
3. If parent was **not** started with `--session`, stop and tell the user how to fix it.
4. If parent was started with `--session`, resolve that session.
5. Fork from the parent session’s current leaf.
6. Name the child session with the requested agent name.
7. Start or reuse tmux session `pi-agents`.
8. Open:
   - one tmux window for the parent session
   - one tmux window for the child session
9. Start the child pi with the initial task prompt.
10. Pass the child task as one quoted string so it is delivered as a single prompt, not split into multiple prompts.

## User-facing precondition flow
If the parent pi is missing `--session`, the helper should print short instructions:
- run `/session` in parent pi
- optionally run `/name parent/<task>`
- restart pi with `deno run -A npm:@mariozechner/pi-coding-agent --session <id-or-path>`
- only use `pi --session <id-or-path>` as a fallback if that is the working local launcher
- rerun the helper

## Naming rules
- Canonical agent name comes from the user, e.g. `agent/auth-audit`.
- Child pi session name uses that exact name.
- tmux window uses a sanitized version of the same name, and should include `subagent` in the window name for easy filtering/status checks.
- Child initial prompt should identify itself using the same name.
- Skill guidance should say: if that agent creates a git branch or worktree, keep those names aligned too when practical.
- Skill guidance should also tell the user they can list tmux windows/tabs with `subagent` in the name to quickly check the status of spawned agents.

## Implementation shape
Files to create in this directory:
- `SKILL.md`
- `pi-sub-agents.ts`
- `lib/process-tree.ts`
- `lib/pi-session.ts`
- `lib/tmux.ts`
- brief notes/docs for process detection and session behavior

## Preferred libraries
Use maintained Node packages rather than bespoke process parsing. Start with:
- `find-process`
- `pidtree`
- `ps-list`

## Verification checklist
Before calling this done, verify:
- parent without `--session` fails with clear instructions
- parent with `--session` succeeds
- child is a separate forked session file
- child session name matches tmux identity
- child receives its initial task
- no direct `/proc` parsing was added

## Execution order
1. Confirm exact pi SDK calls for open/fork/name.
2. Define helper CLI contract.
3. Define process detection strategy using libraries only.
4. Define session resolution/forking/naming rules.
5. Define tmux window/session behavior.
6. Implement helper script.
7. Write `SKILL.md`.
8. Verify end-to-end with real pi and tmux.
