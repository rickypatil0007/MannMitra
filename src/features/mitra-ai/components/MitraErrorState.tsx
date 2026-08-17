import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { MITRA_CONSTANTS } from "../constants/mitra.constants";

interface MitraErrorStateProps {
  onRetry: () => void;
  message?: string;
}

export function MitraErrorState({ onRetry, message = MITRA_CONSTANTS.ERROR_MESSAGES.DEFAULT }: MitraErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="flex gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft">
        <AlertCircle className="w-4 h-4 text-red-500" />
      </div>

      <div className="max-w-[85%] md:max-w-[75%] flex flex-col items-start gap-2">
        <div className="bg-red-500/5 text-red-600 dark:text-red-400 border border-red-500/10 px-4 py-3 rounded-2xl rounded-tl-sm text-sm">
          {message}
        </div>
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--surface-hover)]"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Try Again
        </button>
      </div>
    </motion.div>
  );
}
