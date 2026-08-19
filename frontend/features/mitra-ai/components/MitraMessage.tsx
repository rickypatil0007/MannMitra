import { motion } from "framer-motion";
import { Brain, CheckCircle2, Loader2 } from "lucide-react";
import { MitraMessage as IMitraMessage } from "../types/mitra.types";

interface MitraMessageProps {
  msg: IMitraMessage;
}

export function MitraMessage({ msg }: MitraMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
    >
      {msg.role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-[var(--surface-ai)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft">
          <Brain className="w-4 h-4 text-[var(--accent-ai)]" />
        </div>
      )}

      <div className={`max-w-[85%] md:max-w-[75%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            msg.role === "user"
              ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-tr-sm"
              : "bg-[var(--surface-ai)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-tl-sm whitespace-pre-wrap"
          } ${!msg.content && msg.toolInvocations ? 'bg-transparent border-none px-0 py-0' : ''}`}
        >
          {msg.content}
          
          {msg.toolInvocations?.map((toolInvocation, index) => {
            const isDone = 'result' in toolInvocation;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`text-xs mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg border ${isDone ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-[var(--accent-ai)]/10 border-[var(--accent-ai)]/20 text-[var(--accent-ai)] animate-pulse'}`}
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
