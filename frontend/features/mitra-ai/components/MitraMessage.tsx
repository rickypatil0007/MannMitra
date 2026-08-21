import { motion, useReducedMotion } from "framer-motion";
import { Brain, CheckCircle2, Loader2 } from "lucide-react";
import { MitraMessage as IMitraMessage } from "../types/mitra.types";
import { motionTokens } from "@/frontend/lib/motion/tokens";

interface MitraMessageProps {
  msg: IMitraMessage;
}

export function MitraMessage({ msg }: MitraMessageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.ease.out }}
      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
    >
      {msg.role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-[var(--moonlit-cyan)]/10 border border-[var(--moonlit-cyan)]/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_15px_var(--moonlit-cyan)] shadow-[var(--moonlit-cyan)]/10">
          <Brain className="w-4 h-4 text-[var(--moonlit-cyan)] drop-shadow-[0_0_8px_var(--moonlit-cyan)]" />
        </div>
      )}

      <div className={`max-w-[85%] md:max-w-[75%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed backdrop-blur-md ${
            msg.role === "user"
              ? "bg-white/10 text-white rounded-tr-sm border border-white/20 shadow-lg font-light"
              : "bg-[var(--moonlit-cyan)]/5 text-white/90 border border-[var(--moonlit-cyan)]/10 rounded-tl-sm whitespace-pre-wrap shadow-lg font-light"
          } ${!msg.content && msg.toolInvocations ? 'bg-transparent border-none px-0 py-0 shadow-none backdrop-filter-none' : ''}`}
        >
          {msg.content}
          
          {msg.toolInvocations?.map((toolInvocation, index) => {
            const isDone = 'result' in toolInvocation;
            return (
              <motion.div 
                key={index}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: motionTokens.duration.fast }}
                className={`text-xs mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg border backdrop-blur-sm ${isDone ? 'bg-white/10 border-white/20 text-white/80' : 'bg-[var(--moonlit-cyan)]/10 border-[var(--moonlit-cyan)]/20 text-[var(--moonlit-cyan)] animate-pulse'}`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {isDone ? 'Action completed' : 'Mitra is processing an action...'}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
