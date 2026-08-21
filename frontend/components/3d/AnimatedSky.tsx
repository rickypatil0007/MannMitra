"use client";

import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { SkyClouds } from "./SkyClouds";
import { SkyParticles } from "./SkyParticles";
import { SkyEnvironment } from "./SkyEnvironment";

export function AnimatedSky() {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hydration safety
  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none -z-20 bg-[#FCFBFF]" />;
  }

  // Accessibility: Strict fallback for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-20 bg-gradient-to-br from-[#FCFBFF] via-[#F3EEFF] to-[#FCFBFF]" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-20 bg-[#FCFBFF]">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={isMobile ? 1 : [1, 2]}
        gl={{ alpha: true, antialias: false }} // Disabled antialias since clouds are soft volumetric
      >
        <Suspense fallback={null}>
          <SkyEnvironment interactive={!isMobile} />
          <SkyClouds isMobile={isMobile} />
          <SkyParticles count={isMobile ? 75 : 250} />
        </Suspense>
      </Canvas>
    </div>
  );
}
