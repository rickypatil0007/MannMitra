import { motion } from "framer-motion";
import { Brain } from "lucide-react";

export function MitraTypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-[var(--surface-ai)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 shadow-soft">
        <Brain className="w-4 h-4 text-[var(--accent-ai)]" />
      </div>
      <div className="bg-[var(--surface-ai)] border border-[var(--border-subtle)] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--accent-ai)]"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}
