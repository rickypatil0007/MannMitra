"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background-primary)]/80 backdrop-blur-sm">
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Outer pulsing ring */}
        <motion.div
          className="absolute w-16 h-16 rounded-full border-2 border-[var(--primary-purple)]"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Inner solid dot */}
        <motion.div
          className="w-4 h-4 rounded-full bg-[var(--primary-purple)] shadow-[0_0_20px_rgba(108,76,232,0.5)]"
          animate={{
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
