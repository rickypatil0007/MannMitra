"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Leaf {
  id: number;
  x: string;
  y: string;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  flipX: boolean;
}

interface FloatingLeavesProps {
  count?: number;
  reducedMotion?: boolean;
}

export function FloatingLeaves({ count = 6, reducedMotion = false }: FloatingLeavesProps) {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    if (reducedMotion || count === 0) return;
    
    const generateLeaves = (): Leaf[] => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 20 + 15, // 15px to 35px
        rotation: Math.random() * 360,
        duration: Math.random() * 13 + 12, // 12s to 25s
        delay: Math.random() * 10,
        flipX: Math.random() > 0.5,
      }));
    };

    setLeaves(generateLeaves());
  }, [count, reducedMotion]);

  if (leaves.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden opacity-30">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-[var(--primary)]"
          style={{
            left: leaf.x,
            top: leaf.y,
            width: leaf.size,
            height: leaf.size,
          }}
          initial={{ opacity: 0, rotate: leaf.rotation, scaleX: leaf.flipX ? -1 : 1 }}
          animate={{
            x: ["0px", `${leaf.flipX ? -40 : 40}px`],
            y: ["0px", "-60px"],
            rotate: [leaf.rotation, leaf.rotation + (leaf.flipX ? -15 : 15)],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear",
          }}
        >
          {/* Simple leaf SVG */}
          <svg viewBox="0 0 24 24" fill="currentColor" opacity="0.6">
            <path d="M12 2C7.58 2 4 5.58 4 10C4 16.5 12 22 12 22C12 22 20 16.5 20 10C20 5.58 16.42 2 12 2ZM12 18.2C9.43 14.28 6 10.74 6 10C6 6.69 8.69 4 12 4C15.31 4 18 6.69 18 10C18 10.74 14.57 14.28 12 18.2Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
