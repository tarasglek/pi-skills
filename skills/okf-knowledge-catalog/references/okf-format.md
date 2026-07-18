# Open Knowledge Format v0.1 Quick Reference

Source: [GoogleCloudPlatform/knowledge-catalog](https://github.com/GoogleCloudPlatform/knowledge-catalog), `okf/SPEC.md`, Apache-2.0. Language below closely follows upstream specification.

## Model

- **Knowledge Bundle:** self-contained hierarchical collection of knowledge documents; unit of distribution.
- **Concept:** single unit of knowledge represented as one Markdown document.
- **Concept ID:** file path within bundle with `.md` removed.
- **Link:** standard Markdown link from one concept to another.
- **Citation:** link to external source supporting body claim.

Bundle is directory tree of UTF-8 Markdown files. Reserved names:

- `index.md`: directory listing for progressive disclosure.
- `log.md`: chronological update history, newest first, grouped by ISO `YYYY-MM-DD`.

## Concept document

```markdown
---
type: Decision
title: Database Migration Strategy
description: Records why service uses expand-and-contract migrations.
resource: docs/adr/0042-migrations.md
tags: [database, deployment, decision]
timestamp: 2026-07-11T00:00:00Z
---

Body uses structural Markdown. Link related concepts and cite sources.
```

`type` is required and non-empty. Recommended: `title`, one-sentence `description`, `resource`, `tags`, `timestamp`. Producers may add arbitrary keys. Consumers preserve unknown keys and tolerate unknown types.

Conventional body headings when applicable: `# Schema`, `# Examples`, `# Citations`. Notes may use domain headings such as `# Context`, `# Decision`, `# Symptoms`, `# Resolution`, `# Verification`.

## Links and citations

Upstream spec supports bundle-relative `/tables/users.md` and relative `./other.md` links. Prefer file-relative links when bundle must render correctly on GitHub. Never invent targets. Broken links tolerated by consumers but reported by validators.

Citations:

```markdown
# Citations

[1] [Canonical source](../docs/source.md)
[2] [External documentation](https://example.com/docs)
```

## Index

Index has entries grouped under headings:

```markdown
# Decisions

* [Migration strategy](decisions/migration-strategy.md) - Why service uses expand-and-contract migrations.
```

Descriptions should come from concept frontmatter. Consumers may synthesize index when absent.

## Conformance

Bundle conforms when:

1. Every non-reserved `.md` has parseable YAML frontmatter.
2. Every frontmatter block has non-empty `type`.
3. Reserved files follow defined structure.

Do not reject bundle for missing optional fields, unknown types or fields, broken links, or missing indexes. Report problems; consume best-effort.
