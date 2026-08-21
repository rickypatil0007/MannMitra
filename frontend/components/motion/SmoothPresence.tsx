"use client";

import { AnimatePresence, AnimatePresenceProps } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface SmoothPresenceProps extends AnimatePresenceProps {
  children: React.ReactNode;
}

export function SmoothPresence({ children, ...props }: SmoothPresenceProps) {
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is enabled, we still render children but we disable AnimatePresence
  // Actually, AnimatePresence doesn't animate anything by itself, it just enables exit animations.
  // The child components must handle the reduced motion.
  // But we can skip AnimatePresence completely for reduced motion if we want immediate unmounting.
  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return <AnimatePresence {...props}>{children}</AnimatePresence>;
}
