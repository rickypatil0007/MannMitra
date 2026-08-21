"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/frontend/lib/utils";

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "default" | "green" | "soft" | "warm" | "ai";
}

export function SpotlightCard({
  children,
  className,
  variant = "default",
  ...props
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (shouldReduceMotion) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className={cn(
        "group relative rounded-[20px] border transition-colors overflow-hidden cursor-pointer",
        "hover:shadow-card hover:border-[var(--primary-soft)]", // Card Lift & Soft Border Glow
        variant === "default" && "bg-[var(--surface)] border-[var(--border-subtle)]",
        variant === "green"  && "bg-[var(--surface-secondary)] border-[var(--border-subtle)]",
        variant === "soft"   && "bg-[var(--surface-secondary)] border-[var(--border-subtle)]",
        variant === "warm"   && "bg-[var(--surface-community)] border-[var(--border-subtle)]",
        variant === "ai"     && "bg-[var(--surface-ai)] border-[var(--border-subtle)]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {/* Spotlight effect */}
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-screen"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(79, 209, 197, 0.1),
                transparent 40%
              )
            `,
          }}
        />
      )}
      {/* Content wrapper to ensure it stays above the spotlight */}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
