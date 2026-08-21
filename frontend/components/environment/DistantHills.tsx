"use client";

import React from "react";

export function DistantHills() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]">
      {/* Deep distant hills - very low contrast, high blur */}
      <div 
        className="absolute bottom-0 w-[150%] h-[40vh] left-[-15%]"
        style={{
          background: 'var(--sky-atmospheric)',
          borderRadius: '100% 80% 0 0',
          transform: 'translateY(30%)',
          filter: 'blur(16px)',
          opacity: 0.7
        }}
      />
      
      {/* Mid distant hills - slightly darker, less blur */}
      <div 
        className="absolute bottom-0 w-[130%] h-[35vh] right-[-10%]"
        style={{
          background: 'var(--meadow-deep)',
          borderRadius: '80% 100% 0 0',
          transform: 'translateY(25%)',
          filter: 'blur(8px)',
          opacity: 0.8
        }}
      />
    </div>
  );
}
