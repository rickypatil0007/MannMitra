"use client";

import React, { useState, useEffect } from "react";

export function MeadowFlowers() {
  const [flowers, setFlowers] = useState<any[]>([]);

  useEffect(() => {
    setFlowers(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        bottom: `${Math.random() * 15 + 2}%`, // Near the bottom 2-17% of screen
        size: `${Math.random() * 3 + 2}px`, // 2-5px
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 2 + 5}s`, // 5-7s sway
        opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8
        // Mix of soft whites and pale blues
        color: Math.random() > 0.3 ? "rgba(255, 255, 255, 0.8)" : "rgba(184, 215, 219, 0.9)",
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[10]">
      {flowers.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: f.left,
            bottom: f.bottom,
            width: f.size,
            height: f.size,
            backgroundColor: f.color,
            opacity: f.opacity,
            transformOrigin: "bottom center",
            animation: `grass-sway-strong ${f.duration} ease-in-out infinite`,
            animationDelay: f.delay,
            boxShadow: `0 0 ${parseInt(f.size) * 2}px ${f.color}`,
          }}
        />
      ))}
    </div>
  );
}
