import { isVitestBrowser } from "@/lib/testing";
import type { ChunkData } from "@/engine/TerrainWorker";
import TerrainWorker from "@/engine/TerrainWorker?worker";
import { CONFIG } from "@/engine/types";
import { useFrame, useThree } from "@react-three/fiber";
import { RigidBody, TrimeshCollider } from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Chunk({ data }: { data: ChunkData }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(data.normals, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(data.colors, 4));
    geo.setIndex(new THREE.BufferAttribute(data.indices, 1));
    return geo;
  }, [data]);

  // Free the GPU VBO + typed array uploads when this chunk unmounts
  // (evicted from render range). Without this, every chunk ever rendered
  // stays resident on the GPU and leaks memory over the course of a dive.
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  // Empty chunks (no triangles) crash rapier with "expected instance
  // of TA" because TrimeshCollider won't accept a zero-index mesh.
  // Air chunks are a valid outcome of the voxel mesher — just render
  // nothing (no collider, no mesh) when the chunk has no geometry.
  // Placed AFTER all hooks so the rules-of-hooks order is preserved.
  const hasGeometry = data.indices.length >= 3 && data.positions.length >= 9;
  if (!hasGeometry) return null;

  return (
    <RigidBody type="fixed" colliders={false}>
      {!isVitestBrowser && (
        <TrimeshCollider args={[new Float32Array(data.positions), new Uint32Array(data.indices)]} />
      )}
      <mesh geometry={geometry} userData={{ raycastable: true }} name="terrain-chunk">
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  );
}

export function TerrainManager() {
  const { camera } = useThree();
  const [chunks, setChunks] = useState<Map<string, ChunkData>>(new Map());
  const workerRef = useRef<Worker>(null);

  // Keep track of requested chunks to avoid spamming the worker
  const requestedChunks = useRef<Set<string>>(new Set());
  const currentChunkCoord = useRef<THREE.Vector3>(new THREE.Vector3(-999, -999, -999));

  useEffect(() => {
    workerRef.current = new TerrainWorker();

    workerRef.current.onmessage = (e) => {
      const data = e.data as ChunkData;
      const key = `${data.cx},${data.cy},${data.cz}`;
      // Drop zombie responses: the worker can finish generating a chunk
      // after the player has already walked out of its render range. If
      // the key is no longer in the active (requested) set, the chunk
      // has been evicted and re-inserting it would leak memory because
      // nothing will ever ask for it to be cleaned up.
      if (!requestedChunks.current.has(key)) return;
      setChunks((prev) => {
        const next = new Map(prev);
        next.set(key, data);
        return next;
      });
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useFrame(() => {
    if (!workerRef.current) return;

    const pCx = Math.floor(camera.position.x / (CONFIG.chunkSize * CONFIG.voxelSize));
    const pCy = Math.floor(camera.position.y / (CONFIG.chunkSize * CONFIG.voxelSize));
    const pCz = Math.floor(camera.position.z / (CONFIG.chunkSize * CONFIG.voxelSize));

    // Only update if we moved to a new chunk
    if (
      pCx === currentChunkCoord.current.x &&
      pCy === currentChunkCoord.current.y &&
      pCz === currentChunkCoord.current.z
    ) {
      return;
    }
    currentChunkCoord.current.set(pCx, pCy, pCz);

    const rXZ = CONFIG.renderDistanceXZ;
    const rY = CONFIG.renderDistanceY;
    const currentKeys = new Set<string>();

    for (let cx = pCx - rXZ; cx <= pCx + rXZ; cx++) {
      for (let cy = pCy - 1; cy <= pCy + rY; cy++) {
        for (let cz = pCz - rXZ; cz <= pCz + rXZ; cz++) {
          const key = `${cx},${cy},${cz}`;
          currentKeys.add(key);
          if (!requestedChunks.current.has(key)) {
            requestedChunks.current.add(key);
            workerRef.current.postMessage({ cx, cy, cz, config: CONFIG });
          }
        }
      }
    }

    setChunks((prev) => {
      const next = new Map(prev);
      let changed = false;
      for (const key of next.keys()) {
        if (!currentKeys.has(key)) {
          next.delete(key);
          requestedChunks.current.delete(key);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  });

  return (
    <>
      {Array.from(chunks.values()).map((data) => (
        <Chunk key={`${data.cx},${data.cy},${data.cz}`} data={data} />
      ))}
    </>
  );
}
