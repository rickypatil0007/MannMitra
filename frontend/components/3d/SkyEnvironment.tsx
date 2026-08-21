"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function SkyEnvironment({ interactive = true }: { interactive?: boolean }) {
  const group = useRef<THREE.Group>(null);
  
  // We use useMemo to avoid recreating the vector on every frame
  const target = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (interactive && group.current) {
      // Extremely subtle mouse parallax
      // Mouse coordinates are normalized between -1 and 1
      target.current.set(
        (state.pointer.x * 0.8), 
        (state.pointer.y * 0.8), 
        0
      );
      // Smoothly interpolate the camera/group position towards the target
      group.current.position.lerp(target.current, 0.02);
    }
  });

  return (
    <group ref={group}>
      {/* Soft Ambient White Light */}
      <ambientLight intensity={1.5} color="#FFFFFF" />
      
      {/* Soft Pink Directional Light (Sunlight equivalent) */}
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#FCEFF7" />
      
      {/* Soft Lavender Fill Light from below */}
      <directionalLight position={[-10, -5, -10]} intensity={0.8} color="#F3EEFF" />

      {/* Atmospheric Fog - perfectly matches the background color to blend the horizon */}
      <fogExp2 attach="fog" color="#FCFBFF" density={0.012} />
    </group>
  );
}
