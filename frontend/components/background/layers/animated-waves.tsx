"use client";

import { motion } from "framer-motion";

interface AnimatedWavesProps {
  reducedMotion?: boolean;
}

export function AnimatedWaves({ reducedMotion = false }: AnimatedWavesProps) {
  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden mix-blend-multiply opacity-60">
      
      {/* Wave 1: Soft teal curve */}
      <motion.svg
        className="absolute w-[200vw] h-[100vh] -left-[50vw] top-[10vh]"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        animate={{
          x: ["0%", "10%", "0%"],
          scaleY: [1, 1.1, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,500 C200,400 300,600 500,500 C700,400 800,600 1000,500 L1000,1000 L0,1000 Z"
          fill="url(#wave1-grad)"
          filter="blur(60px)"
        />
        <defs>
          <linearGradient id="wave1-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(44, 122, 123, 0)" />
            <stop offset="50%" stopColor="rgba(44, 122, 123, 0.15)" />
            <stop offset="100%" stopColor="rgba(44, 122, 123, 0)" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Wave 2: Deep blue/green ribbon */}
      <motion.svg
        className="absolute w-[250vw] h-[120vh] -left-[80vw] -top-[10vh]"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        animate={{
          x: ["0%", "-8%", "0%"],
          y: ["0%", "5%", "0%"],
        }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,600 C250,500 350,700 600,550 C850,400 950,600 1000,500 L1000,1000 L0,1000 Z"
          fill="url(#wave2-grad)"
          filter="blur(80px)"
        />
        <defs>
          <linearGradient id="wave2-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(49, 130, 206, 0.1)" />
            <stop offset="50%" stopColor="rgba(56, 161, 105, 0.08)" />
            <stop offset="100%" stopColor="rgba(49, 130, 206, 0)" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Wave 3: Muted purple accent */}
      <motion.svg
        className="absolute w-[180vw] h-[80vh] -left-[20vw] bottom-[-20vh]"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        animate={{
          x: ["0%", "15%", "0%"],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,400 C150,550 300,350 500,450 C700,550 850,350 1000,450 L1000,1000 L0,1000 Z"
          fill="url(#wave3-grad)"
          filter="blur(50px)"
        />
        <defs>
          <linearGradient id="wave3-grad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(107, 70, 193, 0)" />
            <stop offset="50%" stopColor="rgba(107, 70, 193, 0.08)" />
            <stop offset="100%" stopColor="rgba(107, 70, 193, 0)" />
          </linearGradient>
        </defs>
      </motion.svg>

    </div>
  );
}
