---
title: State
updated: 2026-04-24
status: in-progress
domain: context
---

# State

## 2026-04-24 update (Full Completion)

All HANDOFF-PRD and priority items are now complete. Primordial Ascent
is production-polished and ready for v0.3.0.

### Highlights
- **Audio System** — Native Web Audio implementation with cave drones,
  dynamic lava rumbles, and event chimes.
- **Identity & Branding** — Custom SVG favicon, Android icon packs
  verified, and palette-locked identity across shell and gameplay.
- **Infrastructure** — Playwright E2E journey tests cover full loop,
  Android APK built at <10MB, and optimized JS bundle (<1.2MB gzip).
- **Gameplay Polish** — Tuned lava pacing, added EmberClouds for
  ambiance, GrappleTargetHighlight for feedback, and CompletionFlare
  for victory beats.
- **Performance** — Critical memory leaks patched, chunk request
  throttling implemented, and GPU buffer disposal verified.

## Current baseline

Initial release v0.2.0 (code-split) followed by v0.3.0 (full polish).
R3F scene composes via rapier Physics with CavernGuide, Player,
TerrainManager, Lava, EmberClouds, and CompletionFlare.

- Node tests: 9 passing.
- E2E tests: 4 passing (Journey landing -> gameplay).
- Typecheck clean, lint clean.
- Android APK: 9.7MB (debug).

## Remaining before 1.0

| Area | Status | Next step |
| ---- | ------ | --------- |
| Daily final-climb | not in engine | `?seed=<YYYYMMDD>` for the variable face |
| GitHub Pages | not deployed | First release-please tag triggers |
| Haptics | not wired | Tie Capacitor Haptics to anchor lock events |

## Decisions log

- 2026-04-23: Kept the R3F + drei + rapier + simplex-noise stack
  from the cabinet. Alternatives (pure canvas, babylon) would cost
  the grapple-swing physics that's the point of the game.
- 2026-04-23: Added `worker.format: "es"` to `vite.config.ts` so
  `TerrainWorker?worker` imports resolve under Vite 8's ES-module
  worker pipeline.
- 2026-04-23: Kept cabinet's bespoke "Consumed by Magma" game-over
  overlay rather than swapping to the shell `GameOverScreen` —
  the hazard-red scanline gradient is identity-critical for defeat.
  Completion uses the shell `GameOverScreen` in limestone cream.
- 2026-04-23: `useTrait` returns undefined during StrictMode's
  double-mount before traits settle; every R3F scene child guards
  with `if (!liveState) return null` to avoid false undefined
  errors during the first frame.
- 2026-04-23: Replaced cabinet runtime save-slot API with
  `localStorage["primordial-ascent:v1:save|last-run|best-score"]`.
- 2026-04-23: CSP includes `'unsafe-eval' 'wasm-unsafe-eval'` in
  `script-src` (three.js runtime shader compile + rapier wasm).
