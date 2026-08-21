"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function SkyParticles({ count = 200 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  
  // Generate random positions for the particles within a wide bounding box
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60; // X
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30; // Y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10; // Z (pushed slightly back)
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      // Extremely slow rotation to simulate atmospheric drift
      points.current.rotation.y = state.clock.elapsedTime * 0.015;
      points.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Soft lavender/pink glowing particles */}
      <pointsMaterial 
        size={0.15} 
        color="#D6C9FA" 
        transparent 
        opacity={0.6} 
        sizeAttenuation={true} 
        depthWrite={false} 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
