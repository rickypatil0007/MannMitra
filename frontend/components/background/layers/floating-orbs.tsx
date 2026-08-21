"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Orb {
  id: number;
  x: string;
  y: string;
  size: string;
  color: string;
  duration: number;
  delay: number;
}

interface FloatingOrbsProps {
  count?: number;
  reducedMotion?: boolean;
}

const colors = [
  "rgba(49, 151, 149, 0.06)", // Soft Teal
  "rgba(49, 130, 206, 0.05)", // Soft Blue
  "rgba(107, 70, 193, 0.04)", // Soft Purple
  "rgba(56, 161, 105, 0.05)", // Soft Green
  "rgba(213, 63, 140, 0.03)", // Very Soft Pink
];

export function FloatingOrbs({ count = 8, reducedMotion = false }: FloatingOrbsProps) {
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    if (reducedMotion || count === 0) return;
    
    const generateOrbs = (): Orb[] => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 80 + 10}%`,
        y: `${Math.random() * 80 + 10}%`,
        size: `${Math.random() * 30 + 20}vw`, // 20vw to 50vw
        color: colors[Math.random() * colors.length | 0],
        duration: Math.random() * 10 + 8, // 8s to 18s
        delay: Math.random() * 5,
      }));
    };

    setOrbs(generateOrbs());
  }, [count, reducedMotion]);

  if (orbs.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none mix-blend-multiply z-10 overflow-hidden">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 60%)`,
            filter: "blur(60px)",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: ["0%", `${Math.random() > 0.5 ? 10 : -10}%`, "0%"],
            y: ["0%", `${Math.random() > 0.5 ? 15 : -15}%`, "0%"],
            scale: [1, 1.05, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
