"use client";

import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";

export function ChatMockUI() {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square md:aspect-[4/3] flex items-center justify-center">
      
      {/* Glow Behind */}
      <div className="absolute inset-0 bg-[#A78BFA]/10 blur-[100px] rounded-full" />
      
      {/* Mock Chat Window */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full bg-[#0a111a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Chat Header */}
        <div className="h-14 border-b border-white/10 flex items-center px-6 gap-3 bg-white/5">
          <div className="w-8 h-8 rounded-full bg-[#A78BFA]/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div>
            <div className="text-sm font-medium text-white/90">Mitra AI</div>
            <div className="text-xs text-white/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
            </div>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 p-6 flex flex-col gap-4 relative overflow-hidden">
          
          {/* User Bubble */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="self-end max-w-[80%] bg-[var(--primary)] text-white/90 p-3 rounded-2xl rounded-tr-sm text-sm shadow-md"
          >
            I'm feeling really overwhelmed with exams coming up.
          </motion.div>

          {/* AI Bubble */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="self-start max-w-[80%] bg-white/10 text-white/80 p-3 rounded-2xl rounded-tl-sm text-sm border border-white/5 backdrop-blur-sm"
          >
            It's completely normal to feel that way. Let's break it down. What's the hardest part right now?
          </motion.div>

        </div>

        {/* Chat Input Area */}
        <div className="h-14 border-t border-white/10 flex items-center px-4 bg-white/5">
          <div className="flex-1 h-8 bg-white/5 rounded-full border border-white/10 px-4 flex items-center">
            <span className="text-xs text-white/30">Type a message...</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
