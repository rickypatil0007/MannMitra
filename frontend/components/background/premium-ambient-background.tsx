"use client";

import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Layers
import { AnimatedWaves } from "./layers/animated-waves";
import { FloatingOrbs } from "./layers/floating-orbs";
import { FloatingLeaves } from "./layers/floating-leaves";
import { AmbientParticles } from "./layers/ambient-particles";

interface PremiumAmbientBackgroundProps {
  interactive?: boolean;
}

export function PremiumAmbientBackground({ interactive = true }: PremiumAmbientBackgroundProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 25 });

  // Different depths for parallax effect
  const bgX = useTransform(springX, [-1, 1], [-2, 2]);
  const bgY = useTransform(springY, [-1, 1], [-2, 2]);

  const orbsX = useTransform(springX, [-1, 1], [-5, 5]);
  const orbsY = useTransform(springY, [-1, 1], [-5, 5]);

  const wavesX = useTransform(springX, [-1, 1], [-8, 8]);
  const wavesY = useTransform(springY, [-1, 1], [-8, 8]);

  const particlesX = useTransform(springX, [-1, 1], [-12, 12]);
  const particlesY = useTransform(springY, [-1, 1], [-12, 12]);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (interactive && !isMobile && !shouldReduceMotion) {
      const handleMouseMove = (e: MouseEvent) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = (e.clientY / window.innerHeight) * 2 - 1;
        mouseX.set(nx);
        mouseY.set(ny);
      };
      
      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", checkMobile);
      };
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [interactive, isMobile, shouldReduceMotion, mouseX, mouseY]);

  // Handle route visibility and intensity
  if (pathname?.includes("/crisis") || pathname?.includes("/sos")) {
    return null;
  }

  const isDashboard = pathname?.includes("/dashboard") || pathname?.includes("/counsellor") || pathname?.includes("/faculty") || pathname?.includes("/analytics") || pathname?.includes("/planner");
  const isMitraAI = pathname?.includes("/chat") || pathname?.includes("/mitra");
  const isWellness = pathname?.includes("/wellness") || pathname?.includes("/comfort-library") || pathname?.includes("/breathing");

  // Intensity configuration
  const opacityMultiplier = isDashboard ? 0.25 : 1;
  const particleCount = isMobile ? 8 : (isDashboard ? 10 : 25);
  const orbCount = isDashboard ? 5 : 10;
  const leafCount = isMobile ? 3 : (isDashboard ? 0 : 8);

  if (!mounted) {
    return <div className="fixed inset-0 -z-10 bg-[var(--bg-base)] pointer-events-none" />;
  }

  return (
    <div className="fixed inset-0 -z-10 bg-[var(--bg-base)] pointer-events-none overflow-hidden select-none">
      
      {/* 1. Base Atmosphere: Richer gradient */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#F3EEFF_0%,#F8F6FC_40%,#FCFBFF_100%)]"
        style={{ x: bgX, y: bgY }}
      />

      {/* 2. Soft Lavender/Pink Ambient Glow - Increased opacity */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] rounded-full mix-blend-multiply"
        style={{ 
          background: isWellness 
            ? "radial-gradient(circle, rgba(155,134,232,0.12) 0%, transparent 60%)" 
            : "radial-gradient(circle, rgba(231,167,200,0.10) 0%, transparent 60%)", 
          filter: "blur(120px)" 
        }}
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: isMitraAI ? 6 : 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated Flowing Waves */}
      <motion.div className="absolute inset-0" style={{ x: wavesX, y: wavesY, opacity: opacityMultiplier }}>
        <AnimatedWaves reducedMotion={shouldReduceMotion} />
      </motion.div>

      {/* Floating Orbs */}
      <motion.div className="absolute inset-0" style={{ x: orbsX, y: orbsY, opacity: opacityMultiplier }}>
        <FloatingOrbs count={orbCount} reducedMotion={shouldReduceMotion} />
      </motion.div>

      {/* Floating Leaves */}
      <motion.div className="absolute inset-0" style={{ x: particlesX, y: particlesY, opacity: opacityMultiplier }}>
        <FloatingLeaves count={leafCount} reducedMotion={shouldReduceMotion} />
      </motion.div>

      {/* Tiny Ambient Particles */}
      <motion.div className="absolute inset-0" style={{ x: particlesX, y: particlesY, opacity: opacityMultiplier }}>
        <AmbientParticles count={particleCount} reducedMotion={shouldReduceMotion} />
      </motion.div>

      {/* Edge Vignette (Soft Lavender) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(243,238,255,0.6)_100%)] z-30" />
      
      {/* Subtle Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay z-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

    </div>
  );
}
