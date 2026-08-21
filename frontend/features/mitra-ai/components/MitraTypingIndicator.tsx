import { motion, useReducedMotion } from "framer-motion";
import { Brain } from "lucide-react";
import { motionTokens } from "@/frontend/lib/motion/tokens";

export function MitraTypingIndicator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
      transition={{ duration: motionTokens.duration.fast, ease: motionTokens.ease.out }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-[var(--moonlit-cyan)]/10 border border-[var(--moonlit-cyan)]/20 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_var(--moonlit-cyan)] shadow-[var(--moonlit-cyan)]/20">
        <Brain className="w-4 h-4 text-[var(--moonlit-cyan)] drop-shadow-[0_0_8px_var(--moonlit-cyan)]" />
      </div>
      <div className="flex items-center">
        <motion.div
          className="h-1 bg-[var(--moonlit-cyan)] rounded-full drop-shadow-[0_0_5px_var(--moonlit-cyan)]"
          animate={{
            width: ["12px", "40px", "12px"],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
}
