---
title: Testing
updated: 2026-04-23
status: current
domain: quality
---

# Testing

## Lanes

| Lane | Config | Covers |
| ---- | ------ | ------ |
| `pnpm test:node` | `vitest.config.ts` | simulation, session tuning |
| `pnpm test:dom` | `vitest.dom.config.ts` | jsdom presentational |
| `pnpm test:browser` | `vitest.browser.config.ts` | WebGL + pointer-lock smoke |
| `pnpm test:e2e` | `playwright.config.ts` | full user journey |

## What to test

- Engine invariants: `primordialSimulation` advanceLava / cavern
  layout / grapple-guide cue tables are deterministic.
- Palette lock: tokens export CSS vars.
- Player-journey smoke: load, click Initiate Sequence, wait 2s,
  assert title faded out and HUD altitude is visible.

## Known limitations

Pointer-lock is browser-only. In Playwright the scene may render
but pointer-lock requests fail until the page is interacted with;
tests should use a mocked pointer-lock path or assert against
overlays only.

## Coverage

Target 80% on `src/engine/`.

## Screenshots

E2E → `test-results/`. Harness → `/tmp/pa-*.png`.
