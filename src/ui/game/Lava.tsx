import { PrimordialTrait } from "@/store/traits";
import { primordialEntity } from "@/store/world";
import { isRuntimePaused } from "@/lib/runtimePause";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  
  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    
    // Animate texture coordinates
    float n = noise(uv * 10.0 + time * 0.5);
    float wave = sin(vWorldPosition.x * 0.1 + time) * cos(vWorldPosition.z * 0.1 + time);
    
    vec3 color = mix(colorA, colorB, uv.y + n * 0.2 + wave * 0.1);
    
    // Glower near the surface
    float glow = smoothstep(0.0, 0.2, uv.y);
    color += colorA * glow * 0.4;

    gl_FragColor = vec4(color, 0.94);
  }
`;

export function Lava() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const liveState = primordialEntity.get(PrimordialTrait);
  const isWater = liveState?.seed.includes("Ancient") || liveState?.seed.includes("Abyss");

  const uniforms = useMemo(
    () => ({
      time: { value: 0 },
      colorA: { value: new THREE.Color(isWater ? "#00e5ff" : "#ff3300") },
      colorB: { value: new THREE.Color(isWater ? "#001133" : "#3a0500") },
    }),
    [isWater]
  );

  useFrame((state) => {
    if (isRuntimePaused()) return;

    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      const pState = primordialEntity.get(PrimordialTrait);
      if (pState?.phase === "playing") {
        meshRef.current.position.y = pState.lavaHeight;
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -40, 0]}>
      <planeGeometry args={[1000, 1000, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}
