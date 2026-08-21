"use client";

import React, { useState, useEffect } from "react";

export function StarField({ count = 40 }: { count?: number }) {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 1.5 + 0.5; // 0.5px to 2px max
        const x = Math.random() * 100;
        const y = Math.random() * 50; // Keep in top 50%
        const duration = Math.random() * 20 + 10; // 10s to 30s slow twinkle
        const delay = Math.random() * 10;
        const opacity = Math.random() * 0.3 + 0.1; // 0.1 to 0.4 very dim

        return {
          id: i,
          size,
          x,
          y,
          duration,
          delay,
          opacity,
        };
      })
    );
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; transform: scale(0.9); }
            50% { opacity: 0.5; transform: scale(1.05); }
          }
        `}
      </style>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
            boxShadow: star.size > 1.2 ? '0 0 2px 0px rgba(184, 215, 219, 0.3)' : 'none',
          }}
        />
      ))}
    </div>
  );
}
