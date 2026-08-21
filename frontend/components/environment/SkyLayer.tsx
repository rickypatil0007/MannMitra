import React from "react";

export function SkyLayer() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Deep sky base with moonlit radial glow (moon is top-right) */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 70% 10%, var(--sky-atmospheric) 0%, var(--sky-night) 40%, var(--sky-deep) 100%)`
        }}
      />
      
      {/* Horizon atmospheric haze */}
      <div 
        className="absolute bottom-0 w-full h-[40%]" 
        style={{
          background: `linear-gradient(to top, rgba(121, 175, 194, 0.15) 0%, rgba(32, 74, 106, 0.05) 50%, transparent 100%)`,
          filter: 'blur(10px)'
        }}
      />
    </div>
  );
}
