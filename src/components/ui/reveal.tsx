"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  width?: "fit-content" | "100%";
}

export function Reveal({ children, delay = 0, className = "", width = "fit-content" }: RevealProps) {
  return (
    <div style={{ position: "relative", width }} className={className}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: delay, ease: [0.16, 1, 0.3, 1] }} // Calm, smooth spring-like ease
      >
        {children}
      </motion.div>
    </div>
  );
}
