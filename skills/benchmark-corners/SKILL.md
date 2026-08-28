---
name: benchmark-corners
description: Use when testing or reporting latency-sensitive performance across frame, packet, request, block, or payload sizes.
---

# Benchmark Corners

- Test smallest and largest useful sizes.
- Label each corner `<numeric size> · <path/mode>`. Use `A→B` or `B→A` only when endpoints originate independently; use `A↔B roundtrip` for loopback. Run only supported modes, state omissions, and never derive per-leg results from a roundtrip.
- Measure bandwidth and latency min/p50/p95/p99 at each corner.
- Report one compact table with percentiles combined in one slash-separated column.
- Keep one tracked rolling baseline per non-sensitive hardware combination at `benchmarks/baselines/<hardware-combination>.json`; accepting a result overwrites it and Git provides history.
- Ignore candidate/raw runs. Record only revision/dirty state, relevant config and command, repeats, samples, errors, and corner metrics. Compare only equivalent hardware/config/method; never record machine identifiers or secrets.
- Never update a baseline from ad-hoc commands. A tracked repository script must run the benchmark and write the candidate; ad-hoc runs are exploratory only.
- Hardware regression baselines require directly controlled wired endpoints; remote or multi-hop results are informational only.

| Corner | BW | Latency min/p50/p95/p99 |
|---|---:|---:|
| 60 B · A→B | value | min/p50/p95/p99 |
| 1,522 B · A↔B roundtrip | value | min/p50/p95/p99 |
