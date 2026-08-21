"use client";

import { Clouds, Cloud } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function SkyClouds({ isMobile }: { isMobile: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (group.current) {
      // Very slow continuous breathing rotation
      group.current.rotation.y = state.clock.elapsedTime * 0.01;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });

  return (
    <group ref={group}>
      <Clouds limit={isMobile ? 40 : 80}>
        {/* Core Soft White Clouds */}
        <Cloud seed={1} segments={isMobile ? 10 : 20} bounds={[10, 4, 10]} volume={12} color="#FFFFFF" opacity={0.8} position={[0, 0, -8]} speed={0.05} />
        
        {/* Soft Lavender Clouds */}
        <Cloud seed={2} segments={isMobile ? 10 : 15} bounds={[15, 6, 8]} volume={10} color="#F3EEFF" opacity={0.4} position={[-6, 2, -12]} speed={0.08} />

        {/* Soft Pink Clouds */}
        <Cloud seed={3} segments={isMobile ? 10 : 15} bounds={[15, 5, 8]} volume={10} color="#FCEFF7" opacity={0.4} position={[6, -2, -15]} speed={0.06} />

        {/* Subtle Cool Blue Background Cloud */}
        <Cloud seed={4} segments={isMobile ? 10 : 15} bounds={[20, 8, 10]} volume={15} color="#F0F4FA" opacity={0.3} position={[0, -4, -20]} speed={0.04} />
      </Clouds>
    </group>
  );
}
