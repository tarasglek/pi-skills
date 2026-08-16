---
name: narrating-articles
description: Use when turning an article, URL, or supplied text into narrated podcast audio, especially when names, numbers, quotations, pronunciation, metadata, artwork, or transcription quality need validation.
---

# Narrating Articles

## Core rule

Source → one neutral preprocessing pass → TTS → STT QA. Never send raw article directly to TTS. Never add article-specific rules to master prompt.

Set `PODCAST_ROOT=${PODCAST_ROOT:-/home/taras/smallweb/podcasts}`.

## Required outputs

- source snapshot, URL, checksum, title, author, publication date
- `spoken-plan.json`: display text, canonical spoken text, source mappings, delivery metadata, pronunciation decisions
- factual episode summary grounded only in source
- artwork note: concept, source URL, creator, rights/license status, required attribution, alt text
- exact engine input, render manifest, audio, STT transcript, evaluation report
- immutable artifacts for every attempt

Never invent image rights, attribution, facts, names, or summary claims. Unknown rights = `unknown; do not publish image`.

## Workflow

1. Fetch article. Preserve source and metadata. Split into stable source blocks.
2. Build summary and artwork note from source evidence. Prefer documented lead image when permitted; otherwise describe original artwork concept.
3. Run one Pi preprocessing pass using `$PODCAST_ROOT/preprocessing/run.ts`, current neutral prompt, and pronunciation OKF digest.
4. Require deterministic validation. Keep display text, canonical spoken text, pronunciation guidance, and engine input separate.
5. Render female local baseline with `$PODCAST_ROOT/preprocessing/render_kokoro.py`: synthesis speed `0.95`, post-tempo `1.30`.
6. Transcribe each utterance with `$PODCAST_ROOT/preprocessing/evaluate_local_stt.py`. Score against canonical spoken text, never raw article or engine markup.
7. Listen to flagged clips. STT is evidence, not pronunciation authority.

## Pass gates

- deterministic validation passes
- no invented, omitted, duplicated, or altered claims
- numbers, dates, units, attribution, uncertainty, and quotations preserved
- verifier: 100 fidelity / 100 coverage / 100 speakability; zero issues
- no empty or skipped audio; no repeated clauses
- critical names and terms supported by OKF or explicitly unresolved
- summary and artwork note source-grounded; artwork rights documented
- human listening approval before publish

## Repair loop

Maximum three cycles. Preserve each attempt.

- Wrong canonical text, expansion, or chunking → improve article-neutral preprocessing prompt; rerun full preprocessing pass.
- Name/term pronunciation failure → obtain evidence, update OKF, rebuild digest, rerun preprocessing agent, rerender affected audio, rerun STT.
- Acoustic/TTS failure → fix adapter, speed, or render; do not corrupt canonical text or prompt.
- STT disagreement → use second judge or human listening; do not launder false failures with broad aliases.
- Empty transcript plus silent/short audio = real deletion failure, never API error.

After three failed cycles: stop, preserve evidence, report blocker. Never publish to satisfy deadline pressure.
