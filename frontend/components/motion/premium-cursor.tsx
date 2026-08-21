"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  label: string | null;
}

export function PremiumCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(true);
  
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    label: null,
  });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the outer ring (lagging slightly behind the dot)
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(mouseX, springConfig);
  const cursorYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    setIsMounted(true);
    // Disable on mobile/touch devices
    const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setCursorState(prev => ({ ...prev, isClicking: true }));
    const handleMouseUp = () => setCursorState(prev => ({ ...prev, isClicking: false }));

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Magnetic and interactive elements hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const clickable = target.closest("a, button, [role='button'], input, select, textarea");
      if (clickable) {
        setCursorState(prev => ({ ...prev, isHovering: true }));
        return;
      }
      setCursorState(prev => ({ ...prev, isHovering: false }));
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener('resize', checkMobile);
    };
  }, [mouseX, mouseY]);

  if (!isMounted || shouldReduceMotion || isMobile) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {/* 1. Core Dot */}
      <motion.div
        className="absolute top-0 left-0 w-2 h-2 bg-[var(--primary-purple)] rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"
        style={{ x: mouseX, y: mouseY }}
        animate={{
          scale: cursorState.isClicking ? 0.8 : (cursorState.isHovering ? 0 : 1),
          opacity: cursorState.isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* 2. Soft Ambient Glow tracking cursor */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 rounded-full mix-blend-multiply opacity-30 -translate-x-1/2 -translate-y-1/2"
        style={{ 
          x: cursorXSpring, 
          y: cursorYSpring,
          background: "radial-gradient(circle, rgba(155,134,232,1) 0%, transparent 60%)",
          filter: "blur(40px)"
        }}
      >
        <AnimatePresence>
          {cursorState.label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--primary-purple)] tracking-widest uppercase"
            >
              {cursorState.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
