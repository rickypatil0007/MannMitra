"use client";

import { motion, useReducedMotion } from "framer-motion";

export function DreamscapeBackground({ subdued = false }: { subdued?: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className={`dreamscape ${subdued ? "dreamscape-subdued" : ""}`}>
      <div className="dreamscape-stars" />
      <motion.div className="dreamscape-cloud dreamscape-cloud-one" animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, -12, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="dreamscape-cloud dreamscape-cloud-two" animate={reduceMotion ? undefined : { x: [0, -20, 0], y: [0, 18, 0] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="dreamscape-ribbon" animate={reduceMotion ? undefined : { rotate: [0, 2, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
    </div>
  );
}
