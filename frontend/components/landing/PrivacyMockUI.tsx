"use client";

import { motion } from "framer-motion";
import { Lock, ShieldCheck } from "lucide-react";

export function PrivacyMockUI() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square md:aspect-[4/3] flex items-center justify-center">
      
      {/* Glow Behind */}
      <div className="absolute inset-0 bg-[var(--primary)]/10 blur-[100px] rounded-full" />
      
      {/* Mock Window */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full bg-[#0a111a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Window Header */}
        <div className="h-12 border-b border-white/10 flex items-center px-4 justify-between bg-white/5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
            <div className="w-3 h-3 rounded-full bg-white/20" />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-white/50">
            <Lock className="w-3.5 h-3.5" />
            Encrypted Session
          </div>
        </div>

        {/* Window Body */}
        <div className="flex-1 p-6 flex flex-col gap-4 relative">
          
          {/* Skeleton lines */}
          <div className="w-3/4 h-4 rounded-full bg-white/10" />
          <div className="w-full h-4 rounded-full bg-white/10" />
          <div className="w-5/6 h-4 rounded-full bg-white/10" />
          <div className="w-1/2 h-4 rounded-full bg-white/10" />
          
          {/* Accent Skeleton line */}
          <div className="w-2/3 h-4 rounded-full bg-[var(--primary)]/20 mt-4 relative overflow-hidden">
            <div className="absolute inset-0 w-1/2 h-full bg-[var(--primary)]/40 rounded-full" />
          </div>

          {/* Privacy Badge overlay */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
            className="absolute bottom-6 right-6 bg-[var(--primary)]/10 border border-[var(--primary)]/30 backdrop-blur-md rounded-full py-2 px-4 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
              Protected
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
