"use client";

import React, { useEffect, useState } from "react";

export function AmbientParticles({ count = 15 }: { count?: number }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2, // 2-8px, slightly larger for blur
      duration: Math.random() * 40 + 20, // 20-60s ultra slow drift
      delay: Math.random() * 20,
    }));
    setParticles(generated);
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[10]">
      <style>
        {`
          @keyframes float-up {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            20% { opacity: 0.3; }
            80% { opacity: 0.3; }
            100% { transform: translateY(-30vh) translateX(10vw); opacity: 0; }
          }
        `}
      </style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[var(--soft-highlight)] blur-[3px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0,
            animation: `float-up ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
