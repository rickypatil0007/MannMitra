import { useRef, useEffect, KeyboardEvent } from "react";
import { Send, Mic } from "lucide-react";
import { MitraChatState } from "../types/mitra.types";

interface MitraInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  chatState: MitraChatState;
  startListening?: () => void;
  isListening?: boolean;
}

export function MitraInput({
  input,
  handleInputChange,
  handleSubmit,
  chatState,
  startListening,
  isListening,
}: MitraInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSending = chatState === "sending" || chatState === "responding";

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div className="p-4 md:p-6 border-t border-white/10 bg-transparent relative z-20 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto flex items-end gap-2">
        <div className="relative flex-1 bg-white/5 border border-white/10 rounded-2xl focus-within:border-white/30 focus-within:bg-white/10 transition-all shadow-2xl backdrop-blur-sm">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKey}
            placeholder="Tell Mitra what's on your mind..."
            className="w-full max-h-[120px] min-h-[52px] bg-transparent resize-none py-3.5 pl-4 pr-12 text-white placeholder:text-white/30 focus:outline-none scrollbar-thin font-light"
            rows={1}
            disabled={isSending}
          />
          {startListening && (
            <button
              type="button"
              onClick={startListening}
              className={`absolute right-3 bottom-3 p-1.5 rounded-full transition-colors ${
                isListening ? "bg-red-500/10 text-red-500" : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
              title="Voice Input"
              disabled={isSending}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="flex-shrink-0 flex items-center justify-center w-[52px] h-[52px] rounded-2xl bg-white/10 text-white hover:bg-white/20 border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg backdrop-blur-sm"
        >
          <Send className="w-5 h-5 ml-1" />
        </button>
      </form>
    </div>
  );
}
