# Manual Test Checklist

## Parent preconditions

- [ ] Parent pi launched without `--session` fails with clear remediation
- [ ] Remediation text prefers `deno run -A npm:@mariozechner/pi-coding-agent --session <id-or-path>`
- [ ] Optional `/name parent/<task>` guidance is shown

## Process detection

- [ ] Helper detects a confident parent pi process
- [ ] Ambiguous parent pi detection fails cleanly
- [ ] Missing parent process metadata fails cleanly
- [ ] No direct `/proc` parsing is present in implementation

## Session behavior

- [ ] Parent `--session` is resolved correctly
- [ ] Child is created as a real branched/forked session file
- [ ] Child session name matches the requested agent name
- [ ] Parent session is not replaced or mutated incorrectly

## Prompt behavior

- [ ] Child task is passed as one quoted string
- [ ] Child receives a single initial task prompt
- [ ] Task text is not split into multiple prompts

## tmux behavior

- [ ] tmux session `pi-agents` is created or reused
- [ ] Parent window opens the parent session
- [ ] Child window opens the child session
- [ ] Child window name includes `subagent`
- [ ] Existing unrelated windows are not clobbered
- [ ] Attach/status-check commands are printed

## Skill behavior

- [ ] Skill explains that real branching is required
- [ ] Skill tells users to inspect tmux windows with `subagent` in the name
- [ ] Skill tells spawned agents to align branch/worktree names with the agent name when practical
