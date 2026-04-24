---
title: Next work — Primordial Ascent
updated: 2026-04-24
status: current
domain: context
---

# Primordial Ascent — Next work

Handoff for the next agent (or human). Read cold — no prior
conversation context required.

## Current state (as of 2026-04-24)

- React 19 + react-three-fiber + three 0.180 +
  `@react-three/rapier` 2.2 + a voxel `TerrainWorker` that streams
  chunks to the render thread.
- Player controller with grapple, thermals, floating joystick on
  mobile, keyboard on desktop.
- Lava hazard + "CONSUMED BY MAGMA" defeat path.
- Spawn safety platform below the player start position so the
  sim doesn't immediately fall through unloaded terrain.
- Memory-spike audit perf patches landed (PRs #9 + #10):
  - Empty voxel chunks (`indices.length < 3`) no longer mount a
    RigidBody+TrimeshCollider. Rapier was crashing with
    "expected instance of TA" on zero-index meshes.
  - Chunk component disposes its `BufferGeometry` on unmount so
    evicted chunks free their GPU VBO + Float32/Uint32 uploads
    (previously a leak per evicted chunk across a full ascent).
  - Worker onmessage drops zombie responses — if a chunk key is no
    longer in `requestedChunks` by the time the worker replies
    (player has walked out of render range), the chunk is dropped
    instead of zombie-inserting into the chunks Map.
  - Player grapple raycast is throttled to ~8 Hz, filtered to
    meshes flagged `userData.raycastable` (only terrain chunks
    opt in), and the two per-frame `new THREE.Vector3()`
    allocations are now refs.

## What's NOT done

### Priority 1 — long-session memory soak test

This repo was flagged as the **most likely suspect** for the
memory-spike that prompted the audit. The critical leaks are
patched, but no long-session soak test exists yet to confirm
memory stays flat across an actual ascent.

- Build a simple "dev mode" that teleports the player up through
  the terrain at fixed intervals to rapidly cycle chunks. Observe
  GPU memory + heap in DevTools across 5 minutes.
- Confirm `dispose()` on the BufferGeometry actually drops the
  GPU buffer (not just React-side). r3f's auto-dispose sometimes
  misses custom geometries.

### Priority 2 — journey-harness parity with bioluminescent-sea

bs ships a multi-viewport Playwright harness at `e2e/journey.spec.ts`
that dumps screenshots + diagnostics per beat. pa has NO
Playwright setup yet. Copy the pattern:

- Add `e2e/` + `playwright.config.ts` + `e2e/journey.spec.ts`.
- Unique port (e.g. 41734).
- Three viewport projects.
- Beats: landing → INITIATE SEQUENCE → first-frame (confirm player
  on spawn platform, HUD visible) → 5s of ascent (confirm chunks
  cycling, no crash).
- Probe selectors: add `data-testid` hooks to landing screen, the
  HUD panels, the FloatingJoystick, the Crosshair.
- Include a `--mute-audio --use-angle=gl --enable-webgl` launch
  args block like bs has — this repo uses WebGL so GPU fallback
  will confuse results.

### Priority 3 — graphics + gameplay

- **INITIATE SEQUENCE button color** — was `var(--color-glow)`
  (undefined in pa's palette). Patched to `var(--color-ember)`
  (#c75415) in PR #20-series. Verify still correct.
- **Lava pacing in standard mode** — player dies in ~71s on the
  first run without much warning; tune the rise rate or add a
  pre-warn signal.
- **Voxel palette** — currently generic browns. A primordial
  volcanic palette (obsidian, basalt, magma veins) would sell the
  setting.
- **Grapple feedback** — when in range the crosshair changes, but
  the tether preview is subtle. Add a pulse / glow on the target
  chunk.

### Priority 4 — memory-spike audit Medium / Low (not spike-class)

- **`src/ui/game/CavernGuide.tsx:222`** — `createCavernLayout()`
  is called twice (line 17 + 222). Duplicate work, not a leak.
- **`src/ui/game/Player.tsx:77`** — the click-handler raycaster
  allocates a `new THREE.Vector2(0, 0)` per click. Negligible but
  trivial to fix with a module-level constant.
- **`src/engine/TerrainWorker.ts:28-31`** — builds `number[]` and
  converts to typed arrays at the end; peaks at 2× memory during
  chunk build. Direct Float32Array/Uint32Array would halve the
  peak but complicates the voxel mesher.
- **`src/ui/game/TerrainManager.tsx:94`** — worker messages are
  posted in nested XZ×Y loops with no throttle or backpressure.
  On fast descent the worker queue grows unbounded. Add a rolling
  cap on outstanding requests OR a MessageChannel batch.
- **`src/ui/game/TerrainManager.tsx` eviction** — uses a
  bounding-box `currentKeys` check that only runs when the player
  crosses a chunk boundary. Player hovering near a boundary while
  terrain loads can retain far chunks longer than ideal.

### Priority 5 — preexisting lint errors

Both on `main`, unrelated to any perf PR:

- `src/ui/game/Crosshair.tsx:10` — `if (!liveState) return null;`
  before `useState` / `useEffect` — rules-of-hooks violation.
  Restructure so hooks call unconditionally; guard the returned
  JSX.
- `src/ui/game/TetherGuide.tsx` (similar pattern, around line 226) —
  conditional hook call.

## How to ship

1. Branch off main. Conventional Commits.
2. `pnpm typecheck` must stay green. `pnpm lint` has two
   preexisting errors (see above); don't introduce more.
3. When a harness exists: run it across all three viewports.
4. `gh pr create` + `gh pr merge <n> --auto --squash`.

## Key files

- `src/ui/game/TerrainManager.tsx` — Chunk component (geometry
  disposal + empty-chunk guard), worker lifecycle (zombie-message
  drop).
- `src/ui/game/Player.tsx` — controller, grapple raycast throttle,
  tether line.
- `src/engine/TerrainWorker.ts` — voxel mesher.
- `src/engine/types.ts` — `CONFIG` with physics tuning +
  `playerStartPosition`.
- `src/ui/game/World.tsx` — Physics + safety platform + top-level
  scene.

## Don'ts

- Do NOT re-introduce a per-frame `scene.traverse` or
  `raycaster.intersectObjects(scene.children, true)` — filter to a
  small candidates list, throttle, or read from a ref-maintained
  mesh set.
- Do NOT create a BufferGeometry in a `useMemo` without a matching
  `useEffect(() => () => geometry.dispose(), [geometry])`.
- Do NOT skip the empty-chunk guard. Rapier will crash on a
  zero-index Trimesh.
- Do NOT remove `userData.raycastable` from Chunk meshes — it's
  how Player.tsx filters.
