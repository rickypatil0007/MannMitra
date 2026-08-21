"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  // If the user prefers reduced motion, skip the animation
  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Cinematic ease out
      }}
      className="flex-1 flex flex-col w-full h-full relative"
    >
      {children}
    </motion.div>
  );
}
