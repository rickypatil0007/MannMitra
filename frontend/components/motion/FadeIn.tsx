"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { fadeIn } from "@/frontend/lib/motion/variants";
import { useReducedMotion } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  viewOnce?: boolean;
}

export function FadeIn({ children, delay = 0, viewOnce = true, standalone = false, ...props }: FadeInProps & { standalone?: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  const motionProps = standalone ? {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: viewOnce, margin: "-10%" }
  } : {};

  return (
    <motion.div
      variants={fadeIn}
      transition={{ delay }}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
