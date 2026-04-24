import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { isRuntimePaused } from "@/lib/runtimePause";

const PARTICLE_COUNT = 150;

export function CompletionFlare({ active }: { active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = 0;
      arr[i * 3 + 1] = 0;
      arr[i * 3 + 2] = 0;
    }
    return arr;
  }, []);

  const velocities = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.5 + Math.random() * 2.5;
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      arr[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      arr[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return arr;
  }, []);

  useFrame((_state, delta) => {
    if (isRuntimePaused()) return;
    if (!pointsRef.current || !active) return;

    const attr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      attr.setX(i, attr.getX(i) + velocities[i * 3] * delta * 5);
      attr.setY(i, attr.getY(i) + velocities[i * 3 + 1] * delta * 5);
      attr.setZ(i, attr.getZ(i) + velocities[i * 3 + 2] * delta * 5);
    }
    attr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <group position={[0, 180, -178]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.45}
          color="#84f8ff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      <pointLight color="#84f8ff" intensity={30} distance={50} />
    </group>
  );
}
