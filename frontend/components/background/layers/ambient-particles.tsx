"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: string;
  y: string;
  size: string;
  duration: number;
  delay: number;
}

interface AmbientParticlesProps {
  count?: number;
  reducedMotion?: boolean;
}

export function AmbientParticles({ count = 20, reducedMotion = false }: AmbientParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (reducedMotion || count === 0) return;
    
    const generateParticles = (): Particle[] => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`, // 1px to 3px
        duration: Math.random() * 15 + 10, // 10s to 25s
        delay: Math.random() * 10,
      }));
    };

    setParticles(generateParticles());
  }, [count, reducedMotion]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50 z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[rgba(49,151,149,0.4)]"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ["0%", "-50px"],
            x: ["0%", `${Math.random() > 0.5 ? 20 : -20}px`],
            opacity: [0, Math.random() * 0.4 + 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
