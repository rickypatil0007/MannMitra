"use client";

import { motion } from "framer-motion";

export function HeartbeatGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
      {/* Top Right Orb - Deep Purple */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#3B2196] rounded-full mix-blend-multiply filter blur-[120px]"
      />
      
      {/* Middle Left Orb - Primary Purple */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1, 1.15, 1],
          opacity: [0.2, 0.4, 0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-[var(--primary-purple)] rounded-full mix-blend-multiply filter blur-[120px]"
      />

      {/* Bottom Right Orb - Accent Pink */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-40 right-20 w-[400px] h-[400px] bg-[var(--accent-pink)] rounded-full mix-blend-multiply filter blur-[100px]"
      />
    </div>
  );
}
