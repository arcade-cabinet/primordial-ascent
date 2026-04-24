import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { isRuntimePaused } from "@/lib/runtimePause";

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
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    if (intensity <= 0.0) discard;

    vec2 uv = vUv;
    
    // Wave animation
    float wave = sin(vWorldPosition.y * 0.1 + time * 1.2) * 0.5 + 0.5;
    wave += sin(vWorldPosition.x * 0.15 - time * 0.8) * 0.3;
    
    // Gradient based on wave and position
    vec3 color = mix(colorA, colorB, wave * 0.6 + 0.2);
    
    // Caustics-like effect
    float caustics = noise(vWorldPosition.xz * 0.2 + time * 0.5);
    caustics *= noise(vWorldPosition.xz * 0.1 - time * 0.3);
    color += caustics * 0.15 * intensity;

    // Atmospheric depth
    float alpha = 0.42 * intensity;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export function FluidBiome({ y, intensity = 1.0, colorA = "#0066ff", colorB = "#001133" }: { 
  y: number; 
  intensity?: number;
  colorA?: string;
  colorB?: string;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    colorA: { value: new THREE.Color(colorA) },
    colorB: { value: new THREE.Color(colorB) },
    intensity: { value: intensity }
  }), [colorA, colorB, intensity]);

  useFrame((state) => {
    if (isRuntimePaused()) return;
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
      materialRef.current.uniforms.intensity.value = intensity;
    }
  });

  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
