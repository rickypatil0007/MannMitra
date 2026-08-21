"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { scalePressVariants } from "@/frontend/lib/motion/variants";
import { useReducedMotion } from "framer-motion";
import { forwardRef } from "react";

interface ScalePressProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

export const ScalePress = forwardRef<HTMLButtonElement, ScalePressProps>(
  ({ children, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
      return (
        <button ref={ref} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
          {children}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileHover="hover"
        whileTap="tap"
        variants={scalePressVariants}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
ScalePress.displayName = "ScalePress";
