# Benchmark Corners Hardware Baselines Design

Add one generalized rule to `benchmark-corners`:

```text
benchmarks/
├── baselines/<hardware-combination>.json  # tracked, rolling baseline
├── runs/                                  # ignored
└── raw/                                   # ignored
```

Keep one small baseline per stable, non-sensitive hardware combination. Record
only revision, dirty state, relevant configuration, command, repeated corner
metrics, samples, and errors. Compare only equivalent hardware/configuration.
Accepting a result overwrites that baseline; Git retains history.

Never record hostnames, addresses, serials, credentials, or usernames. Keep the
existing compact human report. Add no recorder, CSV, database, or device-specific
example.

This follows the common JSON context/results and machine/testbed segmentation
used by Google Benchmark, pytest-benchmark, ASV, Hyperfine, and Bencher.
