# Process Detection Strategy

## Goal
Find the invoking parent `pi` process without direct `/proc` parsing.

## Library-first approach

Use maintained Node libraries such as:
- `find-process`
- `pidtree`
- `ps-list`

## Detection algorithm

1. Start from the current helper process context.
2. Use process-inspection libraries to discover parent/ancestor process candidates.
3. Identify the first confident ancestor whose command matches `pi` or `pi-coding-agent`.
4. Extract argv/cmdline from library-provided process metadata.
5. Reject ambiguous matches instead of guessing.
6. Require a `--session <value>` pair in the detected parent argv.
7. If available from libraries, also capture the parent cwd for tmux launches.
8. If required fields cannot be obtained through libraries, hard-fail.

## v1 strictness

- No direct procfs parsing.
- No bespoke Linux fallback.
- No guessing when multiple parent pi processes could match.
- Better to fail with instructions than attach to the wrong session.

## Expected outcomes for main cases

- Helper launched from a child process of the active parent pi:
  - detect that pi and continue
- No ancestor pi found:
  - fail with a clear error
- Multiple pi candidates and no confident winner:
  - fail as ambiguous
- Parent pi found but no `--session` in argv:
  - fail with restart instructions
