---
title: Agent Operating Protocols
updated: 2026-04-23
status: current
---

# Primordial Ascent — Agent Protocols

See [`CLAUDE.md`](./CLAUDE.md).

## Contract

Keep typecheck / test / build green. Preserve zero console errors
on desktop (1280×800) + mobile-portrait (390×844). Hold the
player-journey gate in [`STANDARDS.md`](./STANDARDS.md).

## Testing lanes

| Lane | Config | Covers |
| ---- | ------ | ------ |
| `pnpm test:node` | `vitest.config.ts` | simulation |
| `pnpm test:dom` | `vitest.dom.config.ts` | jsdom presentational |
| `pnpm test:browser` | `vitest.browser.config.ts` | WebGL + pointer-lock smoke |
| `pnpm test:e2e` | `playwright.config.ts` | full user journey |

## Commit conventions

Conventional Commits. release-please reads these.

## Dependencies

Weekly dependabot, minor+patch grouped. three /
@react-three/{fiber,drei,rapier} / koota / simplex-noise /
capacitor / react pinned by major.
