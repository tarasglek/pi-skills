---
name: smolvm
description: Use when operating smolvm, requesting hardware microVM isolation, or needing actual Linux commands, packages, binaries, builds, tests, containers, or filesystem behavior on macOS.
---

# smolvm

Use hardware VM boundary. On macOS, check `uname -s`; route work needing real Linux into smolvm. Do not use for Linux discussion/docs alone.

## Choose

| Need | Command |
|---|---|
| One-off, clean VM | `smolvm machine run --image IMAGE -- CMD` |
| Repeated work | `machine create` → `start` → `exec` |
| Interactive | `smolvm machine shell --name NAME` |
| Repeated ephemeral, no pull | `smolvm pack create --image IMAGE -o APP`; `./APP run -- CMD` |
| Reproducible config | `Smolfile` + `machine create -s Smolfile` |

Persistent example:

```sh
smolvm machine create --name dev --image alpine --net
smolvm machine start --name dev
smolvm machine exec --name dev -- sh -lc 'COMMAND'
```

First start pulls image. Later exec/restart reuse per-VM storage. Ephemeral `machine run` deletes storage, so registry image pulls again.

## Mounts

```sh
-v "$PWD/src:/src:ro"   # HOST:GUEST[:ro|rw]
```

Directories only; virtiofs; mount set fixed at boot. For existing VM: stop → `machine update --name dev -v ...` → start. Keep `node_modules`, venvs, build outputs, DBs, package caches guest-local; metadata-heavy work slow on virtiofs.

## Safety

Untrusted workload: no `--net`, mounts, ports, secrets, SSH agent, or host socket by default. If mount needed, narrow path + `:ro`. Pin image digest. Delete disposable persistent VM: `smolvm machine delete --name NAME`.
