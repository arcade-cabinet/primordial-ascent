import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { isRuntimePaused } from "@/lib/runtimePause";

const EMBER_COUNT = 42;

export function EmberClouds() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(EMBER_COUNT * 3);
    for (let i = 0; i < EMBER_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = Math.random() * 200;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60 - 40;
    }
    return arr;
  }, []);

  const velocities = useMemo(() => {
    const arr = new Float32Array(EMBER_COUNT);
    for (let i = 0; i < EMBER_COUNT; i++) {
      arr[i] = 0.5 + Math.random() * 2.5;
    }
    return arr;
  }, []);

  useFrame((_state, delta) => {
    if (isRuntimePaused()) return;
    if (!pointsRef.current) return;

    const attr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < EMBER_COUNT; i++) {
      let y = attr.getY(i);
      y -= velocities[i] * delta * 10;
      if (y < -20) y = 200;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.65}
        color="#ff7448"
        transparent
        opacity={0.74}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
