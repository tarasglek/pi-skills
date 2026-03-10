# Helper CLI Contract

## v1 command shape

```bash
node pi-sub-agents.ts --name <agent-name> --task "<initial-task>"
```

The task must be treated as one quoted string all the way through helper invocation and child pi launch. Do not split it into multiple prompts or positional fragments.

## Required arguments

- `--name <agent-name>`
  - canonical logical identity for the child agent
  - example: `agent/auth-audit`
- `--task <initial-task>`
  - first prompt sent to the child pi session

## Optional arguments

- `--tmux-session <name>`
  - default: `pi-agents`

## Auto-detected inputs

The helper must discover automatically:
- the invoking parent `pi` process
- the parent `pi` command line
- the parent `--session <value>` argument
- parent cwd if available from chosen libraries

## Strict v1 preconditions

The helper must hard-fail when:
- no confident parent `pi` process can be identified
- multiple candidates are ambiguous
- parent `pi` was not launched with `--session`
- required parent process metadata cannot be obtained from chosen libraries

## Required failure guidance

If parent `pi` is missing `--session`, print short instructions telling the user to:
1. run `/session` in the parent pi
2. optionally run `/name parent/<task>`
3. restart pi with:

```bash
deno run -A npm:@mariozechner/pi-coding-agent --session <id-or-path>
```

Fallback only if needed in the local environment:

```bash
pi --session <id-or-path>
```

4. rerun the helper

## Naming contract

Given a canonical agent name like `agent/auth-audit`:
- child pi session name: `agent/auth-audit`
- tmux window name: sanitized and includes `subagent`
- child prompt should identify itself with the same canonical name
- the helper must create a real branched/forked child session from the parent session leaf before launching the child pi
- opening a fresh unrelated pi session is not acceptable behavior for this workflow
