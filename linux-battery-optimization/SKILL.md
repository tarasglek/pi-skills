---
name: linux-battery-optimization
description: Use when diagnosing or reducing Linux laptop battery drain, idle watts, package power, GPU power, wakeups, poor CPU residency, or workload energy.
---

# Linux Battery Optimization

## Rule

Measure watts, not vibes. Change one lever. Rotate order. Restore everything.

## Clean Baseline

```bash
cat /sys/class/power_supply/BAT*/{status,power_now,capacity}
sudo turbostat --Summary --interval 10 --num_iterations 1
ps -eo pid,ppid,pcpu,stat,comm,args --sort=-pcpu | head -30
pidstat -u -p ALL 1 10
cat /proc/pressure/{cpu,io,memory}
```

Before samples: unplug AC, fix brightness/displays/workload, settle, reject active builds (`cargo`, `rustc`, `ninja`, `make`, `cc1`), updates, sync, indexing. Record per-process CPU deltas. Use medians and ABBA/rotated repetitions. For causal tests freeze noisy apps temporarily; also test final policy with normal apps running.

## Pull Levers, Biggest First

1. **Redraws/animations:** terminal spinners, status clocks, cursor animation, browser pages, Electron apps. Cap FPS or remove pointless updates. Streaming WezTerm 60→15 FPS saved roughly 1.5 W battery / 1.7 W package; idle FPS changed nothing.
2. **Display:** brightness, DPMS, refresh rate, unused panels. One display can save ~0.5 W; DPMS off ~1 W. Usually bigger than scheduler tuning.
3. **Rogue processes:** use `pidstat`, not lifetime `%CPU`. Browser renderers, Signal/Electron, file watchers, VPN GUIs, agents, builds.
4. **GPU/display engine:** inspect turbostat `GFXWatt`, `GFX%C0`, `GFX%rc6`; check i915 PSR, FBC, DMC/DC states. High RC6 means frequency caps have little idle upside. Never force unsupported PSR/FBC.
5. **Devices:** runtime PM, USB, Bluetooth, Wi-Fi powersave, audio, NVMe, dGPU suspend. Verify failures and latency.
6. **CPU policy:** test EPP, HWP, platform profile, then affinity/cpusets. Pin background, IRQs, and unbound workqueues only when measured. Core packing may raise frequency, migrations, IRQs, and total work.
7. **Schedulers last:** lower P-core runtime does not prove lower energy. Compare battery/package watts and workload completion. sched_ext compaction can improve placement while consuming more power; keep EEVDF unless it loses clean measurements.

## Metrics That Matter

- Battery W and package/core/GPU W
- Work completed and latency—not power alone
- Total/per-CPU C0, C6/C7, package C2/C3+
- IRQ count, migrations, PSI, active CPUs
- GPU RC6 and display configuration
- Process-family CPU time

Package C3+ stuck at 0% means core packing gains are probably small; hunt display/device wake blockers.

## Safety

Back up sysfs values. Use traps/systemd `ExecStopPost`. On AC, crash, X11 failure, scheduler exit, or uninstall: restore broad affinities, IRQ/workqueue masks, brightness, and stock scheduler. Never promote a candidate before normal stop, SIGKILL, reboot, and workload checks.
