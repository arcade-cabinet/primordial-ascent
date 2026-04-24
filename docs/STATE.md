---
title: State
updated: 2026-04-24
status: in-progress
domain: context
---

# State

## 2026-04-24 update (Final Release Polish)

All systems are production-ready and verified. The game has been
transformed from a POC into a fully defined experience.

### Final Polish Deliverables
- **Cavern Signature (Seeding)** — Full procedural generation of terrain,
  layout, and environmental variety tied to adjective-adjective-noun seeds.
- **New Ascent Console** — Diegetic modal for signature customization
  and pressure level selection (Cozy/Standard/Challenge).
- **Audio Engine** — Procedural Web Audio with ambient drones, dynamic
  lava rumbles, and event chimes.
- **Visual Stacks** — Added EmberClouds, CompletionFlare, and
  SeedSignpost for diegetic world-building.
- **Infrastructure** — Automated GitHub Pages deployment, Playwright
  E2E journey tests (Passing on Desktop/Mobile), and optimized builds.

## Current baseline

Version 0.3.0 (Internal Release). R3F scene composes via rapier Physics.
All world data is deterministic based on the Cavern Signature.

- Node tests: 9 passing.
- E2E tests: 2 passing (Full Journey on Desktop & Mobile).
- Typecheck/Lint: Clean.
- Bundle size: ~1.2MB gzip (Landing ~80KB).
- Android APK: 9.7MB verified.

## Remaining for 1.0 (Live Ops)

| Area | Status | Next step |
| ---- | ------ | --------- |
| Global Leaderboard | not in engine | Tie to signature + completion time |
| Haptics | not wired | Tie Capacitor Haptics to anchor lock events |
| Controller Support | partial | Map Gamepad API to joystick events |

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
