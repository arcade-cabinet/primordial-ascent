---
title: State
updated: 2026-04-23
status: in-progress
domain: context
---

# State

## Current baseline

Initial cut extracted from `jbcom/arcade-cabinet` on 2026-04-23.
R3F scene composes via rapier Physics with CavernGuide, Player,
TerrainManager, Lava. TerrainWorker streams chunks from
simplex-noise. HUD shows altitude, time, distance-to-lava, grapple
reserve, route cue. Crosshair shows grapple lock state.

- Node tests: 9 passing.
- Typecheck clean, build clean at ~3.5 MB JS (~1.2 MB gzip) +
  ~22 KB CSS + Oswald/Inter font files.
- Headless Chromium landing snapshot at 1280×800: ember-orange
  Oswald title + verb chips + CTA. Play-phase R3F scene needs
  pointer-lock which doesn't fire in headless; verified
  interactively instead.

## Remaining before 1.0

| Area | Status | Next step |
| ---- | ------ | --------- |
| Audio | not started | Cave drone + anchor lock click + lava rumble |
| Icons | placeholder | Ember-grapple SVG favicon + Android pack |
| Pointer-lock e2e | blocked by harness | Mocked pointer-lock test path |
| Android APK | not scaffolded | `pnpm exec cap add android` + verify |
| GitHub Pages | not deployed | First release-please tag triggers |
| Daily final-climb | not in engine | `?seed=<YYYYMMDD>` for the variable face |
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
