---
title: Claude Code Instructions
updated: 2026-04-23
status: current
---

# Primordial Ascent — Agent Instructions

## What This Is

A **portrait touch-grapple climber**. The player swings up a volcanic
cavern using a first-person grapple, lands on moss ledges to rest,
and stays ahead of the rising magma. Each run threads a seeded
cavern until a variable final climb. The stakes are felt, not
scored: the game rewards muscle memory with the grapple, not speed.

## Critical Rules

1. **Engine is deterministic.** `src/engine/primordialSimulation.ts`
   is pure TypeScript. No DOM or WebGL.
2. **R3F + drei + rapier own the 3D.** `src/ui/game/World.tsx`
   composes Physics, CavernGuide, Player, TerrainManager, Lava.
   HUD + Crosshair are DOM overlays.
3. **Koota ECS.** `primordialEntity` carries PhaseTrait +
   PrimordialTrait. Every scene child reads via `useTrait` and
   bails early if state is absent (StrictMode mount order).
4. **Web Worker terrain.** `src/engine/TerrainWorker.ts` generates
   chunks using simplex-noise; `vite.config.ts` has
   `worker.format: "es"` to match.
5. **CSP allows unsafe-eval.** Three.js runtime shader compile.
6. **Portrait-locked.** `capacitor.config.ts` pins
   `ScreenOrientation.lock = "portrait"`.
7. **No Tailwind build.** Identity lives in `global.css`; a pinned
   utility subset covers legacy `className` strings.
8. **pnpm + Biome only.**
9. **Finale phrasing.** Completion reads "Surface Breached"
   (limestone cream). Failure reads "Consumed by Magma"
   (hazard red, still dramatic but part of the diorama — not a
   GAME OVER scream).

## Commands

```bash
pnpm dev / build / typecheck / lint / test / test:browser / test:e2e
pnpm cap:sync / cap:open:android / cap:run:android
```

## Project Structure

- `src/engine/` — sim + types + TerrainWorker.
- `src/store/` — Koota world + PrimordialTrait + shared traits.
- `src/lib/` — sessionMode, runtimePause, testing, types, utils,
  eventBus.
- `src/hooks/` — useContainerSize, useGameLoop,
  useRunSnapshotAutosave, runtimeResult, useResponsive.
- `src/theme/` — tokens + global.css + tw.css.
- `src/ui/Game.tsx` — phase orchestrator, save, overlays.
- `src/ui/game/World.tsx` — R3F scene.
- `src/ui/game/{Player,TerrainManager,Lava,CavernGuide}.tsx` —
  scene children.
- `src/ui/game/{HUD,Crosshair}.tsx` — DOM overlays.
- `src/ui/shell/` — identity chrome.

## Design palette

```
--color-bg:        #120907  volcanic void
--color-charcoal:  #2a1c18  basalt rock
--color-ember:     #c75415  ember orange (hero channel, grapple)
--color-limestone: #e8dcc0  limestone cream (rest / completion)
--color-fg:        #f2e8d9  warm parchment
--color-fg-muted:  #a0907c  muted limestone
--color-warn:      #ff375f  hazard red (consumed by magma)
```

Display font: Oswald (slab-adjacent heavy weight).
Body font: Inter.
