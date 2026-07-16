# pkgx Package Search and Shim Skill Design

## Goal

Create a brief caveman-style Pi skill for finding pkgx packages and creating pkgm shims.

## Location

`skills/pkgx-packages/SKILL.md`

## Content

- Trigger when users need to find pkgx packages or make commands persist through pkgm shims.
- Search with `pkgx -Q QUERY`; list all with `pkgx -Q`.
- Create shims with `pkgm shim PACKAGE[@VERSION]`.
- Verify with `command -v COMMAND` and run the command.
- State that a shim is not a full install: it invokes pkgx and fetches packages on demand.
- Warn that `~/.local/bin` must be in `PATH`.

## Constraints

- Self-contained `SKILL.md` only.
- Caveman wording, normal unchanged shell commands.
- Roughly 120 words.
- YAML frontmatter contains only `name` and `description`.
