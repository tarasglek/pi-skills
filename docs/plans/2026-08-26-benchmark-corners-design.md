# Benchmark Corners Skill Design

Global `benchmark-corners` skill applies when testing or reporting latency-sensitive benchmarks.

Require smallest and largest useful payload/frame sizes. Test and report useful bandwidth plus latency min/p50/p95/p99. Use one compact table, units once in headers, slash-separated latency values, and no parentheses. Put sample counts and errors on one short line. Keep wire/storage overhead out of primary size and bandwidth; mention mapping only when needed. Mark missing measurements instead of inventing them.

Validate against transport, storage, and incomplete RPC benchmark prompts.
