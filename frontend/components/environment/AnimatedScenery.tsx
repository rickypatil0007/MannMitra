"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { SkyLayer } from "./SkyLayer";
import { StarField } from "./StarField";
import { VolumetricClouds } from "./VolumetricClouds";
import { DistantHills } from "./DistantHills";
import { MeadowLayer } from "./MeadowLayer";
import { ForegroundGrass } from "./ForegroundGrass";
import { MeadowFlowers } from "./MeadowFlowers";

export function AnimatedScenery() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Parallax spring values
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", listener);
    
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion, mouseX, mouseY]);

  // 11-layer depth transforms
  const hazeX = useTransform(mouseX, [-1, 1], [-2, 2]);
  const hazeY = useTransform(mouseY, [-1, 1], [-1, 1]);

  const farCloudX = useTransform(mouseX, [-1, 1], [-4, 4]);
  const farCloudY = useTransform(mouseY, [-1, 1], [-2, 2]);
  
  const midCloudX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const midCloudY = useTransform(mouseY, [-1, 1], [-4, 4]);

  const hillX = useTransform(mouseX, [-1, 1], [-12, 12]);
  const hillY = useTransform(mouseY, [-1, 1], [-6, 6]);

  const midMeadowX = useTransform(mouseX, [-1, 1], [-16, 16]);
  const midMeadowY = useTransform(mouseY, [-1, 1], [-8, 8]);

  const frontMeadowX = useTransform(mouseX, [-1, 1], [-20, 20]);
  const frontMeadowY = useTransform(mouseY, [-1, 1], [-10, 10]);

  const grassX = useTransform(mouseX, [-1, 1], [-25, 25]);
  const grassY = useTransform(mouseY, [-1, 1], [-12, 12]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[var(--sky-deep)]">
      {/* Layer 01: Sky */}
      <SkyLayer />
      
      {/* Camera Wrapper */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          animation: prefersReducedMotion ? 'none' : 'float-drift 120s ease-in-out infinite'
        }}
      >
        {/* Layer 02: Stars */}
        {!prefersReducedMotion && <StarField count={40} />}
        
        {/* Layer 03: Atmospheric Haze */}
        <motion.div className="absolute inset-0 z-[1]" style={{ x: hazeX, y: hazeY }}>
          <div className="absolute bottom-0 w-full h-[50%] bg-gradient-to-t from-[rgba(121,175,194,0.1)] to-transparent blur-[20px]" />
        </motion.div>

        {!prefersReducedMotion ? (
          <>
            {/* Layer 04: Far Clouds */}
            <motion.div className="absolute inset-0" style={{ x: farCloudX, y: farCloudY }}>
              <VolumetricClouds group="far" />
            </motion.div>
            
            {/* Layer 05: Mid Clouds */}
            <motion.div className="absolute inset-0" style={{ x: midCloudX, y: midCloudY }}>
              <VolumetricClouds group="mid" />
            </motion.div>
            
            {/* Layer 06: Distant Hills */}
            <motion.div className="absolute inset-0" style={{ x: hillX, y: hillY }}>
              <DistantHills />
            </motion.div>

            {/* Layer 07: Middle Meadow */}
            <motion.div className="absolute inset-0" style={{ x: midMeadowX, y: midMeadowY }}>
              <MeadowLayer type="mid" />
            </motion.div>

            {/* Layer 08: Foreground Meadow */}
            <motion.div className="absolute inset-0" style={{ x: frontMeadowX, y: frontMeadowY }}>
              <MeadowLayer type="front" />
            </motion.div>

            {/* Layer 09: Foreground Grass */}
            <motion.div className="absolute inset-0" style={{ x: grassX, y: grassY }}>
              <ForegroundGrass />
            </motion.div>

            {/* Layer 10: Flowers */}
            <motion.div className="absolute inset-0" style={{ x: grassX, y: grassY }}>
              <MeadowFlowers />
            </motion.div>
          </>
        ) : (
          <>
            {/* Static fallbacks for accessibility */}
            <VolumetricClouds group="far" className="!animation-none" />
            <DistantHills />
            <MeadowLayer type="front" />
          </>
        )}
      </div>
    </div>
  );
}
