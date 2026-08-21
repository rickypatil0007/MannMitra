"use client";

import React, { useState, useEffect } from "react";

export function ForegroundGrass() {
  const [blades, setBlades] = useState<any[]>([]);

  useEffect(() => {
    setBlades(
      Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        height: `${Math.random() * 40 + 60}px`, // 60-100px
        width: `${Math.random() * 10 + 5}px`, // 5-15px
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 2 + 4}s`, // 4-6s sway
        rotation: Math.random() * 20 - 10, // -10 to +10deg initial lean
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[9]">
      <div className="absolute bottom-0 w-full h-[100px]">
        {blades.map((b) => (
          <div
            key={b.id}
            className="absolute bottom-[-10px] bg-[var(--meadow-deep)] rounded-t-[100%]"
            style={{
              left: b.left,
              width: b.width,
              height: b.height,
              transformOrigin: "bottom center",
              transform: `rotate(${b.rotation}deg)`,
              animation: `grass-sway ${b.duration} ease-in-out infinite`,
              animationDelay: b.delay,
              boxShadow: "inset -2px 0 4px rgba(6, 21, 47, 0.4)",
            }}
          />
        ))}
      </div>
      
      {/* Front-most dark shadow gradient to anchor the scene */}
      <div 
        className="absolute bottom-0 w-full h-[8vh]" 
        style={{
          background: `linear-gradient(to top, rgba(6, 21, 47, 0.9) 0%, transparent 100%)`,
        }}
      />
    </div>
  );
}
