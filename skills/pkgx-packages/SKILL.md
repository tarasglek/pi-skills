---
name: pkgx-packages
description: Use when finding packages or executables available through pkgx, or making pkgx commands persistent with pkgm shims
---

# pkgx Packages

Find package, make command stay available. Shim runs package through `pkgx` on demand; not full install.

## Search

```sh
pkgx -Q QUERY     # find matching executable/package
pkgx -Q           # list everything
```

Search returns fully qualified project name when needed. Web fallback: <https://pkgx.dev/pkgs/>.

## Shim

```sh
pkgm shim PACKAGE
pkgm shim PACKAGE@VERSION
```

Example:

```sh
pkgx -Q rg
pkgm shim rg
command -v rg
rg --version
```

Shim lands in `~/.local/bin`. Ensure directory in `PATH`:

```sh
export PATH="$HOME/.local/bin:$PATH"
```

Need real install instead? Use `pkgm install PACKAGE`; shim only fetches/runs through `pkgx` when invoked.
