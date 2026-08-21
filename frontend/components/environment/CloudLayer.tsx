"use client";

import React from "react";
import { cn } from "@/frontend/lib/utils";

interface CloudLayerProps {
  speed?: "fast" | "mid" | "slow";
  opacity?: number;
  scale?: number;
  yOffset?: number;
  className?: string;
}

export function CloudLayer({
  speed = "mid",
  opacity = 0.5,
  scale = 1,
  yOffset = 0,
  className,
}: CloudLayerProps) {
  // Speed mapping based on requirements
  const duration = speed === "slow" ? "120s" : speed === "mid" ? "90s" : "60s";
  
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}
      style={{ zIndex: 2, opacity }}
    >
      <style>
        {`
          @keyframes drift {
            0% { transform: translateX(-5%); }
            50% { transform: translateX(5%); }
            100% { transform: translateX(-5%); }
          }
        `}
      </style>
      <div
        className="w-[120%] h-full absolute left-[-10%]"
        style={{
          animation: `drift ${duration} ease-in-out infinite`,
          transform: `scale(${scale}) translateY(${yOffset}%)`,
        }}
      >
        {/* Procedural Cloud Shapes using overlapping radial gradients */}
        <div 
          className="absolute w-full h-[300px] top-[40%]"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(112, 156, 181, 0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
            transform: 'scaleX(1.5)',
          }}
        />
        <div 
          className="absolute w-full h-[400px] top-[30%] left-[20%]"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(40, 88, 120, 0.3) 0%, transparent 60%)',
            filter: 'blur(30px)',
            transform: 'scaleX(2)',
          }}
        />
        <div 
          className="absolute w-full h-[250px] top-[45%] left-[-20%]"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(18, 60, 104, 0.5) 0%, transparent 60%)',
            filter: 'blur(15px)',
            transform: 'scaleX(1.2)',
          }}
        />
      </div>
    </div>
  );
}
