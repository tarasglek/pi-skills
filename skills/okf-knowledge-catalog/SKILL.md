---
name: okf-knowledge-catalog
description: Use when creating, organizing, searching, validating, repairing, or visualizing durable notes, memories, decisions, runbooks, troubleshooting knowledge, metadata catalogs, or Open Knowledge Format bundles.
---

# OKF Knowledge Catalog

## Overview

Represent knowledge as plain Markdown files with YAML frontmatter. Human-readable, agent-readable, diffable, portable. Bundle = durable shared memory, not session dump.

Read `references/okf-format.md` before authoring or validating.

## When to Use

Use for:

- durable agent memory from session discovery
- project notes, ADRs, decisions, facts, conventions
- runbooks, playbooks, incidents, troubleshooting quirks
- data/system metadata catalogs
- knowledge bundle search, navigation, graph inspection
- frontmatter, index, citation, or link validation/repair

Do not use for transient scratch notes, secrets, credentials, raw logs, or facts already canonical elsewhere and better linked.

## Choose Workflow

| Intent | Workflow |
|---|---|
| Save learning/memory | Search → enrich existing concept or create one → link → index/log |
| Build catalog | Inventory sources → propose concept map → author concepts → index → validate |
| Answer question | Read nearest `index.md` → open likely concepts → follow links/citations |
| Find knowledge | Search title, description, tags, resource, then body; rank exact concepts first |
| Validate | Parse frontmatter → required fields → reserved files → links → citations → orphans |
| Repair | Scan read-only → classify safe/ambiguous fixes → show diff → ask approval → write → revalidate |
| Visualize | Build nodes from concept IDs; directed edges from Markdown links; include backlinks |

## Durable Memory Rules

Before saving:

1. Search bundle. Same knowledge exists? Refine it, do not duplicate.
2. Keep durable fact, decision, procedure, constraint, or failure mode. Drop session narrative.
3. Separate observation, inference, and unknowns.
4. Link canonical source through `resource` or citation. Never invent source.
5. One concept, one focus. Link related service/runbook/decision concepts.
6. No secret, token, personal data, customer data, or sensitive raw log.
7. Use timestamp for meaningful update. Add log entry when bundle tracks history.

Useful memory types: `Decision`, `Service`, `Runbook`, `Playbook`, `Troubleshooting`, `Convention`, `Reference`, `Dataset`, `Table`. Type taxonomy stays open.

## Authoring

1. Inventory current bundle and source material.
2. Read existing concept before changing it; refine rather than rewrite.
3. List concepts. Link only real targets.
4. Use tight one-sentence `description`; indexes use it verbatim.
5. Prefer headings, lists, tables, fenced examples over loose prose.
6. Add citations for sourced claims.
7. Generate/update directory indexes for progressive disclosure.
8. Validate. Show proposed paths and diff before broad writes.

For repository conversion, do not copy whole docs. Capture reusable context; point `resource` and citations to canonical files.

## Consumption

Start narrow. Read root index, then relevant subdirectory index, then concept. Follow links only when useful. Unknown types/fields stay valid. Missing index or broken link does not make bundle unreadable; consume best-effort and report defect.

Answer with cited concept paths. Distinguish bundle fact from inference.

## Validation and Repair

Check:

- parseable YAML frontmatter on non-reserved Markdown
- non-empty `type`
- unique concept IDs and sensible filenames
- index targets and descriptions
- internal link target existence; anchors when practical
- citations and source provenance
- orphan concepts, duplicate concepts, stale/conflicting claims
- unknown metadata preserved during round-trip

Auto-fix only deterministic defects. Ambiguous merge, rename, deletion, claim rewrite, or bulk normalization needs approval. Preserve custom metadata. Minimal diff. Revalidate after writes.

## Source Plugins

Core sources: local files and git repositories. Adapter contract:

- enumerate source items
- return stable source URI/path
- return content plus available metadata
- avoid side effects during read
- state freshness and access errors

Web, BigQuery, catalog APIs: optional adapters. Local bundle remains usable without them.

## Common Mistakes

| Mistake | Fix |
|---|---|
| Dump whole conversation | Extract durable concept only |
| New note for existing fact | Enrich canonical concept |
| Tags without links | Add contextual concept links |
| Invented metadata/source | Mark unknown; cite only known source |
| Load whole bundle | Traverse indexes progressively |
| Rewrite custom frontmatter | Preserve unknown keys |
| Silent bulk repair | Show diff, get approval |
| Treat broken link as fatal | Report, continue best-effort |
