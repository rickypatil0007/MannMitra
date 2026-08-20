"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/frontend/lib/motion-presets";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={pageTransition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
