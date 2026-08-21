"use client";

import React from "react";
import { cn } from "@/frontend/lib/utils";

interface VolumetricCloudsProps {
  group: "far" | "mid" | "near";
  className?: string;
}

export function VolumetricClouds({ group, className }: VolumetricCloudsProps) {
  // Configuration based on depth
  const config = {
    far: {
      duration: "120s",
      scale: 1,
      y: "-5%",
      opacity: 0.25,
      blur: "blur(24px)",
      zIndex: 2,
    },
    mid: {
      duration: "90s",
      scale: 1.2,
      y: "5%",
      opacity: 0.4,
      blur: "blur(12px)",
      zIndex: 4,
    },
    near: {
      duration: "150s",
      scale: 1.5,
      y: "15%",
      opacity: 0.6,
      blur: "blur(4px)",
      zIndex: 6,
    }
  }[group];

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
      style={{ 
        zIndex: config.zIndex, 
        opacity: config.opacity,
        filter: config.blur 
      }}
    >
      <div
        className="absolute w-[150%] h-[60%] left-[-20%] top-[10%]"
        style={{
          animation: `float-drift ${config.duration} ease-in-out infinite`,
          transform: `scale(${config.scale}) translateY(${config.y})`,
          transformOrigin: "bottom center"
        }}
      >
        {/* SVG Cloud 1 - Left */}
        <div className="absolute left-[10%] top-[30%] w-[400px] h-[200px]">
          <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
            {/* Dark Underside */}
            <path d="M 50 150 Q 150 200 250 150 Q 350 180 380 120 Q 200 170 50 150 Z" fill="rgba(4,14,32,0.85)" />
            {/* Main Volume */}
            <path d="M 30 140 C 10 100 80 50 150 80 C 200 20 300 30 350 90 C 390 120 370 160 300 160 C 200 170 80 170 30 140 Z" fill="rgba(24,56,84,0.7)" />
            {/* Moonlit Rim (Top Right) */}
            <path d="M 120 70 C 200 10 300 20 340 80 C 280 40 180 30 120 70 Z" fill="rgba(184,215,219,0.6)" filter="blur(3px)" />
          </svg>
        </div>

        {/* SVG Cloud 2 - Right */}
        <div className="absolute left-[50%] top-[20%] w-[500px] h-[250px]">
          <svg viewBox="0 0 500 250" className="w-full h-full overflow-visible">
            {/* Dark Underside */}
            <path d="M 80 180 Q 250 220 400 180 Q 480 200 450 140 Q 250 200 80 180 Z" fill="rgba(4,14,32,0.8)" />
            {/* Main Volume */}
            <path d="M 50 150 C 30 100 150 40 250 80 C 320 20 420 40 460 110 C 490 150 440 190 350 190 C 200 200 100 190 50 150 Z" fill="rgba(24,56,84,0.75)" />
            {/* Moonlit Rim (Top Right) */}
            <path d="M 220 60 C 320 10 410 30 450 100 C 380 50 280 40 220 60 Z" fill="rgba(184,215,219,0.65)" filter="blur(3.5px)" />
          </svg>
        </div>
        
        {/* SVG Cloud 3 - Background filler */}
        <div className="absolute left-[30%] top-[40%] w-[300px] h-[150px] opacity-70">
          <svg viewBox="0 0 300 150" className="w-full h-full overflow-visible">
            <path d="M 20 100 C 10 50 100 20 180 50 C 240 10 280 50 290 80 C 250 120 150 130 20 100 Z" fill="rgba(32,74,106,0.5)" />
            <path d="M 150 40 C 220 5 270 30 280 70 C 230 40 170 30 150 40 Z" fill="rgba(121,175,194,0.3)" filter="blur(3px)" />
          </svg>
        </div>
      </div>
    </div>
  );
}
