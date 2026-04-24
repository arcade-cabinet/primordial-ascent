---
title: Architecture
updated: 2026-04-24
status: current
domain: technical
---

# Architecture

## Stack

R3F + drei + three + rapier (3D physics), Koota (ECS), React 19 +
Vite 8, framer-motion (chrome), simplex-noise + Web Worker
(terrain), Vitest 4 + Playwright, Biome 2.4, Capacitor 8
(portrait-locked). No Tailwind build.

## Data flow

```
input (touch/pointer) → Player.tsx (grapple + first-person)
  → rapier Physics step
    → primordialEntity.set(PrimordialTrait, next)
      → useTrait re-renders HUD + Crosshair + CavernGuide
      → audioManager updates lava intensity + plays sfx
  ↑ TerrainManager streams seeded chunks from the Worker
```

The TerrainWorker generates chunks from seeded simplex noise and
sends them back over `postMessage`. The main thread composes them
into a single rapier trimesh each frame.

## Core Systems

### Seeding (Signature) System
Every ascent is defined by a "Cavern Signature" (adjective-adjective-noun).
This seed drives:
- Voxel terrain generation (density + noise).
- Cavern layout (anchor and platform placement).
- World building variety (vein colors, lighting colors).

### Audio System
Lightweight manager (`src/engine/audio.ts`) using the native Web Audio API.
- Deep sine-wave cave drone.
- Dynamic sawtooth lava rumble (frequency and gain tie to lava distance).
- Event chimes (grapple lock, surface breach) using procedural oscillators.

## Files you'll edit most

- `src/engine/primordialSimulation.ts` — sim + cavern layout +
  lava curves + session-mode scaling.
- `src/engine/TerrainWorker.ts` — chunk generation (simplex).
- `src/ui/game/Player.tsx` — grapple physics + first-person
  controls.
- `src/ui/game/TerrainManager.tsx` — worker streaming + rapier
  trimesh.
- `src/ui/game/CavernGuide.tsx` — beacons + route trail.
- `src/ui/game/Lava.tsx` — rising magma plane.
- `src/ui/game/HUD.tsx` / `Crosshair.tsx` — overlays.
- `src/ui/Game.tsx` — phase orchestrator.

## Responsibilities

| Responsibility | Owner |
| -------------- | ----- |
| Sim / cavern layout | `src/engine/primordialSimulation.ts` |
| Terrain chunks | `src/engine/TerrainWorker.ts` |
| Phase + score traits | Koota in `src/store/` |
| 3D rendering | `src/ui/game/World.tsx` + children |
| Physics step | `@react-three/rapier` |
| HUD / crosshair | `src/ui/game/{HUD,Crosshair}.tsx` |
| Save / best score | `src/hooks/{runtimeResult,useRunSnapshotAutosave}.ts` |

Save keys: `primordial-ascent:v1:save|last-run|best-score`.

## Performance contract

Target 45 FPS on mid-tier mobile (rapier + terrain is heavy). If
we drop below that on a Pixel 6 portrait, lower the chunk
resolution in `TerrainWorker` and reduce `CavernGuide` beacon
count.

## Build budget

JS ≤ 1.5 MB gzip (three + rapier + simplex anchor). CSS ≤ 50 KB.
Fonts: Oswald + Inter, weights 400/500/600/700.
