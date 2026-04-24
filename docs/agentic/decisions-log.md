---
title: Decisions log — Primordial Ascent
updated: 2026-04-24
status: current
domain: context
---

# Primordial Ascent — Decisions log

---

## 2026-04-24 — Empty voxel chunks render nothing (no RigidBody, no mesh)

**Reason:** Air chunks are a valid outcome of the voxel mesher —
above the surface, past a cavern, etc. Mounting a
`TrimeshCollider` on a zero-index mesh crashed Rapier with
"expected instance of TA."

**Constraint:** Early-return `null` when
`indices.length < 3 || positions.length < 9`. Must happen AFTER
the `useMemo` + `useEffect(dispose)` hooks so rules-of-hooks order
is preserved. PR #9.

---

## 2026-04-24 — Chunk geometry disposes on unmount

**Reason:** `useMemo` creates a `BufferGeometry` per chunk.
r3f's auto-dispose doesn't reliably reach custom-built geometries,
so every evicted chunk leaked its GPU VBO + Float32Array
(positions, normals, colors) + Uint32Array (indices) uploads. Over
a full ascent this is dozens-to-hundreds of leaked GPU buffers.

**Constraint:** `useEffect(() => () => geometry.dispose(),
[geometry])` co-located with the `useMemo`. PR #10.

---

## 2026-04-24 — Worker onmessage drops zombie chunk responses

**Reason:** The worker can finish generating a chunk AFTER the
player has walked out of its render range. Before this patch the
onmessage handler unconditionally re-inserted the returned chunk
into the `chunks` Map, where it sat forever — nothing would ever
ask for it to be cleaned up again, but it was holding a
BufferGeometry and a collider until full unmount.

**Constraint:** onmessage checks `requestedChunks.current.has(key)`
before `setChunks`. If the chunk has already been evicted from the
request set, drop the response. PR #10.

---

## 2026-04-24 — Player grapple raycast is throttled + filtered

**Reason:** The grapple-range check previously ran
`raycaster.intersectObjects(scene.children, true)` every frame.
This walks the entire scene graph recursively, including every
chunk's thousands of triangles, every cavern guide, every beacon.
At 60Hz with dozens of loaded chunks this is a severe CPU+GC
spike — not a leak, but exactly the wrong thing to do inside a
`useFrame`.

**Constraint:** Accumulate `delta` and only raycast when the
accumulator crosses 125ms (~8Hz). Traverse scene once per raycast
and filter to meshes flagged `userData.raycastable`; only chunk
meshes opt in. Hoist `cameraDirection` and tether-start
`Vector3` allocations into refs so `useFrame` no longer allocates
per tick. PR #10.

---

## 2026-04-24 — Spawn safety platform below player start

**Reason:** Player was spawning midair before terrain finished
loading. On a slow device or first load, the player fell through
empty space into lava within seconds — "CONSUMED BY MAGMA" before
the first terrain chunk arrived.

**Constraint:** Fixed RigidBody 20×1×20 plane 8 meters below
`CONFIG.playerStartPosition`. Exists unconditionally — fine
aesthetically because the player is facing up in the ascent
direction. Earlier PR that also rolled in the real-Tailwind +
ember-button fixes.

---

## 2026-04-24 — Raycast-candidates are chunks only, via userData

**Reason:** Even after throttling, raycasting against every mesh
in the scene was overkill. But we can't use names (`'terrain-chunk'`
is set on the mesh, not the RigidBody wrapper) in a way that
filters efficiently.

**Constraint:** Each Chunk mesh gets `userData={{ raycastable: true }}`.
Player does `scene.traverse(...)` once per raycast tick and
collects only meshes with that flag before calling
`raycaster.intersectObjects(candidates, false)`. PR #10.
