"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { staggerContainer } from "@/frontend/lib/motion/variants";
import { useReducedMotion } from "framer-motion";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  viewOnce?: boolean;
  delayChildren?: number;
  staggerChildren?: number;
}

export function StaggerContainer({ 
  children, 
  viewOnce = true, 
  delayChildren,
  staggerChildren,
  ...props 
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewOnce, margin: "-10%" }}
      transition={{ 
        delayChildren,
        staggerChildren
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
