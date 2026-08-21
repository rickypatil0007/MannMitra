"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function BlurText({ text, className = "", delay = 0 }: BlurTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  // Split the text into words
  const words = text.split(" ");

  return (
    <h1 ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block mr-[0.25em]" // Added a small margin right for spacing between words
          initial={{ filter: "blur(10px)", opacity: 0, y: 10 }}
          animate={isInView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: delay + index * 0.08, // Stagger effect
          }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
