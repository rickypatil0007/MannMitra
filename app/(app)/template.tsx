"use client";

import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/frontend/lib/motion/tokens";

export default function Template({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: motionTokens.opacity.hidden, y: 10 }}
      animate={{ opacity: motionTokens.opacity.visible, y: 0 }}
      exit={{ opacity: motionTokens.opacity.hidden, y: -10 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.ease.out }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
