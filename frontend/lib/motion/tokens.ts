export const motionTokens = {
  duration: {
    micro: 0.15,
    fast: 0.2,
    normal: 0.35,
    slow: 0.6,
    verySlow: 0.8,
    ambient: 8,
  },
  ease: {
    // Soft, smooth, natural, minimal overshoot
    smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // ease-in-out-like but smoother
    out: [0.16, 1, 0.3, 1] as [number, number, number, number], // Custom expo out for gentle reveals
    in: [0.4, 0, 1, 1] as [number, number, number, number],
  },
  spring: {
    soft: { type: "spring" as const, stiffness: 200, damping: 20, mass: 0.8 },
    gentle: { type: "spring" as const, stiffness: 150, damping: 15, mass: 1 },
    bouncy: { type: "spring" as const, stiffness: 250, damping: 20, mass: 0.8 }, // Use sparingly
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
  scale: {
    hover: 1.02,
    tap: 0.97,
  },
  opacity: {
    hidden: 0,
    visible: 1,
    dimmed: 0.6,
  }
};
