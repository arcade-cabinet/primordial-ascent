import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface SeedSignpostProps {
  seed: string;
}

export function SeedSignpost({ seed }: SeedSignpostProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = 10.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 10.5, -6]}>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[2.5, 2.8, 0.4, 32]} />
        <meshStandardMaterial color="#c75415" emissive="#c75415" emissiveIntensity={2} />
      </mesh>
      
      <pointLight color="#c75415" intensity={15} distance={10} />
      
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.45}
        color="#f2e8d9"
        font="Oswald"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
        textAlign="center"
      >
        CAVERN SIGNATURE
      </Text>
      
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.8}
        color="#c75415"
        font="Oswald"
        anchorX="center"
        anchorY="middle"
        maxWidth={6}
        textAlign="center"
      >
        {seed.toUpperCase()}
      </Text>
      
      {/* Decorative rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
          <torusGeometry args={[3.5 + i * 0.8, 0.02, 8, 64]} />
          <meshBasicMaterial color="#c75415" transparent opacity={0.3 - i * 0.1} />
        </mesh>
      ))}
    </group>
  );
}
