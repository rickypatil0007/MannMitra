"use client";

import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/frontend/lib/motion/tokens";

export function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics for a floating feel
  const smoothX = useSpring(mouseX, motionTokens.spring.gentle);
  const smoothY = useSpring(mouseY, motionTokens.spring.gentle);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches || shouldReduceMotion) return;

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, mouseX, mouseY, shouldReduceMotion]);

  const backgroundStyle = useMotionTemplate`radial-gradient(400px circle at ${smoothX}px ${smoothY}px, rgba(79, 209, 197, 0.08), transparent 50%)`;

  if (!isVisible || shouldReduceMotion) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden mix-blend-screen"
      style={{
        background: backgroundStyle,
      }}
    />
  );
}
