"use client";

import { motion } from "framer-motion";
import { FloatingOrbs } from "@/frontend/components/ui/animated";
import { fadeInUp, staggerContainer, staggerItem } from "@/frontend/lib/motion-presets";

const TAGS = ["Private", "Anonymous", "AI-powered", "Free"];

export function AuthBrandingPanel() {
  return (
    <div className="hidden lg:flex flex-col w-[440px] relative overflow-hidden items-center justify-center p-12 bg-[radial-gradient(ellipse_at_top_left,#8065E9_0%,#6C4CE8_40%,#4b35a8_100%)] text-white">
      {/* Subtle overlay glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
      
      <FloatingOrbs />
      
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay z-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-20 max-w-sm text-center space-y-8"
      >
        <motion.div
          variants={fadeInUp}
          className="w-20 h-20 mx-auto rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white text-3xl font-bold font-display shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/20 animate-float"
        >
          M
        </motion.div>

        <div className="space-y-3">
          <motion.h1
            variants={fadeInUp}
            className="text-4xl font-display font-semibold tracking-tight text-white drop-shadow-sm"
          >
            Mann Mitra
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-white/80 text-[17px] font-sans leading-relaxed px-4"
          >
            A private digital sanctuary for students. Turn academic pressure into clarity, one day at a time.
          </motion.p>
        </div>

        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-2 pt-2">
          {TAGS.map((tag, i) => (
            <motion.span
              key={tag}
              variants={staggerItem}
              custom={i}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              className="px-3.5 py-1.5 text-[13px] rounded-full bg-white/10 backdrop-blur-sm text-white/90 border border-white/20 font-medium cursor-default shadow-sm transition-colors"
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
