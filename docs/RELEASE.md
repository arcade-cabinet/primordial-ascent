---
title: Release
updated: 2026-04-23
status: current
domain: ops
---

# Release

release-please reads Conventional Commits on `main`, opens a
release PR, and on merge tags a release. `release.yml` runs on
tag; `cd.yml` runs on every `push: main` for Pages.

## Cutting a release

Merge PRs with `feat:` / `fix:` / `perf:`. The release PR
auto-opens; merge it to cut the version.

## Manifest

`.release-please-manifest.json` — do not hand-edit.

## Pre-1.0 rules

`bump-minor-pre-major: true`, `bump-patch-for-minor-pre-major: false`.
