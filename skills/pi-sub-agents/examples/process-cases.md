# Process Detection Cases

## Case 1: Helper launched from parent pi subprocess chain
Expected: detect parent pi, extract `--session`, continue.

## Case 2: Helper launched from shell in same tmux environment, but no clear parent pi ancestor
Expected: fail rather than guessing.

## Case 3: No ancestor pi process found
Expected: fail with clear error.

## Case 4: Multiple pi processes appear plausible
Expected: fail as ambiguous.

## Case 5: Parent pi found but no `--session`
Expected: fail with instructions to run `/session`, optionally `/name`, then restart pi with `--session`.
