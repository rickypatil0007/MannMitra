import React from "react";
import { cn } from "@/frontend/lib/utils";

export function MeadowLayer({ type = "mid" }: { type?: "mid" | "front" }) {
  if (type === "mid") {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[7]">
        <div 
          className="absolute bottom-0 w-[140%] h-[28vh] left-[-20%]"
          style={{
            background: 'linear-gradient(to bottom, var(--meadow-natural), var(--meadow-deep))',
            borderRadius: '100% 90% 0 0',
            transform: 'translateY(15%)',
            filter: 'blur(3px)',
            opacity: 0.95,
            boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.2)'
          }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[8]">
      <div 
        className="absolute bottom-0 w-[120%] h-[22vh] right-[-10%]"
          style={{
            background: 'linear-gradient(to bottom, var(--meadow-soft), var(--meadow-natural))',
            borderRadius: '90% 100% 0 0',
            transform: 'translateY(10%)',
            boxShadow: 'inset 0 20px 40px rgba(4,14,32, 0.6), inset 0 2px 0 rgba(184,215,219,0.15)',
          }}
      >
        {/* Subtle horizon moonlit glow on the grass edge */}
        <div className="absolute top-0 w-full h-[60px] bg-gradient-to-b from-[rgba(184,215,219,0.1)] to-transparent rounded-[100%]" />
      </div>
    </div>
  );
}
