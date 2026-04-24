---
title: Decisions log — Primordial Ascent
updated: 2026-04-24
status: current
domain: context
---

# Primordial Ascent — Decisions log

---

## 2026-04-24 — Manual Rapier Initialization (Single-Threaded)

**Problem:** Vite 8 (Rolldown) production builds inject rehydration scripts into workers that fail when Rapier loads its WASM-wrapped worker, causing a fatal "black screen" crash. E2E tests confirmed "importScripts failed to load" on blob URLs.

**Decision:** Abandoned the R3F-native worker-based physics. Instead, we manually call `init()` from `@dimforge/rapier3d-compat` in a `useEffect` within `GameStage.tsx`.

**Outcome:** Resolved persistent production crashes. Physics now runs reliably on the main thread in single-threaded mode, bypasses Vite's worker wrapping.

---

## 2026-04-24 — Inlined Terrain Worker (Blob)

**Problem:** Bundled Web Workers were failing to resolve dependency paths (like `simplex-noise`) in production, even when configured with IIFE format. Vite's production "help" logic was injecting incompatible scripts.

**Decision:** Inlined the entire worker source as a template literal string in `TerrainManager.tsx`, including a zero-dependency Simplex Noise implementation. Instantiated via `Blob` and `createObjectURL`.

**Outcome:** Zero-friction worker loading across all deployment targets.

---

## 2026-04-24 — Procedural Biome Overhaul

**Problem:** Static voxel biomes felt repetitive and lacked organic depth.

**Decision:** Introduced a shader-based `FluidBiome` (undersea water/magma layers) and tied voxel vein colors/pulsing to the adjective-adjective-noun seed signature.

**Outcome:** Significant increase in visual depth and variety across different cavern signatures.

---

## 2026-04-24 — Empty voxel chunks render nothing (no RigidBody, no mesh)

**Reason:** Air chunks are a valid outcome of the voxel mesher. Mounting a `TrimeshCollider` on a zero-index mesh crashed Rapier.

**Constraint:** Early-return `null` when `indices.length < 3 || positions.length < 9`. Must happen AFTER the `useMemo` + `useEffect(dispose)` hooks so rules-of-hooks order is preserved.

---

## 2026-04-24 — Chunk geometry disposes on unmount

**Reason:** r3f's auto-dispose doesn't reliably reach custom-built geometries. Every evicted chunk leaked its GPU VBO.

**Constraint:** `useEffect(() => () => geometry.dispose(), [geometry])` co-located with the `useMemo`.

---

## 2026-04-24 — Worker onmessage drops zombie chunk responses

**Reason:** The worker can finish generating a chunk AFTER the player has already walked out of its render range.

**Constraint:** onmessage checks `requestedChunks.current.has(key)` before `setChunks`.

---

## 2026-04-24 — Player grapple raycast is throttled + filtered

**Reason:** Running scene-wide raycasts at 60Hz caused CPU spikes.

**Constraint:** Throttled to ~8Hz. Traversed scene once per raycast and filtered to meshes flagged `userData.raycastable`.
