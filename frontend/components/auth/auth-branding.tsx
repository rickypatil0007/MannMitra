"use client";

import { motion } from "framer-motion";
import { FloatingOrbs } from "@/frontend/components/ui/animated";
import { fadeInUp, staggerContainer, staggerItem } from "@/frontend/lib/motion-presets";

const TAGS = ["Private", "Anonymous", "AI-powered", "Free"];

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex flex-col flex-1 bg-[var(--primary-hover)] relative overflow-hidden text-[var(--primary-foreground)] items-center justify-center p-12">
      <FloatingOrbs />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 max-w-md text-center space-y-6"
      >
        <motion.div
          variants={fadeInUp}
          className="w-16 h-16 mx-auto rounded-2xl bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-2xl font-bold font-display shadow-lg animate-float"
        >
          M
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-4xl font-display font-semibold tracking-tight text-[var(--primary-foreground)]"
        >
          Mann Mitra
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-[var(--primary-foreground)]/75 text-lg font-sans leading-relaxed"
        >
          A private digital sanctuary for students. Turn academic pressure into clarity, one day at a time.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-2 pt-4">
          {TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              variants={staggerItem}
              custom={i}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
              className="px-3 py-1.5 text-xs rounded-full bg-[var(--surface)]/10 text-[var(--primary-foreground)]/80 border border-white/15 font-medium cursor-default"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function AuthMobileLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="lg:hidden text-center mb-6"
    >
      <div className="w-12 h-12 mx-auto rounded-xl bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xl font-bold font-display mb-4 animate-float">
        M
      </div>
      <h1 className="text-2xl font-display font-semibold tracking-tight text-[var(--text-primary)]">
        Mann Mitra
      </h1>
    </motion.div>
  );
}
