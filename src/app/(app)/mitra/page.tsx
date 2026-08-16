"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Send, RotateCcw, Sparkles, Mic, CheckCircle2, Loader2 } from "lucide-react";
import { useChat, Message } from "ai/react";

const suggestedPrompts = [
  "Help me plan my week",
  "I'm feeling overwhelmed right now",
  "What should I focus on today?",
  "I failed an exam and I don't know how to feel",
];

const initialMitraMessage: Message = {
  id: "0",
  role: "assistant",
  content: "Hi 👋 I'm Mitra. This is a safe, private space. You can share how you're feeling, ask for help planning your week, or just talk. What's on your mind today?",
};

export default function MitraPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
    api: "/api/chat",
    initialMessages: [initialMitraMessage],
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Auto-resize textarea per spec STU-04-02
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

  const reset = () => setMessages([initialMitraMessage]);

  const sendSuggested = (prompt: string) => {
    append({ role: "user", content: prompt });
  };

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-7rem)] md:h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ opacity: [0.8, 1, 0.8], scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-[var(--surface-ai)] border border-[var(--border-subtle)] flex items-center justify-center shadow-soft"
          >
            <Brain className="w-5 h-5 text-[var(--accent-ai)]" />
          </motion.div>
          <div>
            <p className="text-base font-display font-semibold text-[var(--text-primary)]">Mitra</p>
            <p className="text-xs text-[var(--text-muted)]">Private AI companion · Not a therapist</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/mitra/call"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors"
            title="Start Voice/Video Call"
          >
            <Mic className="w-4 h-4" />
          </a>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors px-2 py-1.5 rounded-lg hover:bg-[var(--background-secondary)]"
            title="New conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" /> New chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-5 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <motion.div 
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 rounded-full bg-[var(--surface-ai)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft"
              >
                <Brain className="w-4 h-4 text-[var(--accent-ai)]" />
              </motion.div>
            )}

            <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-tr-sm"
                    : "bg-[var(--surface-ai)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-tl-sm whitespace-pre-wrap"
                } ${!msg.content && msg.toolInvocations ? 'bg-transparent border-none px-0 py-0' : ''}`}
              >
                {msg.content}
                
                {/* Tool Invocations (Reduces Perceived Lag) */}
                {msg.toolInvocations?.map((toolInvocation, index) => {
                  const isDone = 'result' in toolInvocation;
                  return (
                    <div key={index} className={`text-xs mt-2 flex items-center gap-1.5 px-3 py-2 rounded-lg border ${isDone ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-[var(--accent-ai)]/10 border-[var(--accent-ai)]/20 text-[var(--accent-ai)] animate-pulse'}`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      {isDone ? 'Action completed' : 'Mitra is processing an action...'}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator — spec STU-04-04 */}
        <AnimatePresence>
          {isLoading && messages[messages.length - 1].role === "user" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
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
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts — shown when no user messages */}
      {messages.length === 1 && (
        <div className="flex gap-2 flex-wrap pb-3 shrink-0">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => sendSuggested(p)}
              className="px-3 py-1.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-soft)] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form onSubmit={handleSubmit} className="shrink-0 pt-3 border-t border-[var(--border-subtle)] space-y-2">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKey}
            placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(95,184,166,0.15)] transition-all overflow-hidden"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-11 w-11 flex-shrink-0 rounded-xl border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--background-secondary)]"
            aria-label="Voice input"
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-11 w-11 flex-shrink-0 rounded-xl"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] text-center">
          Mitra is an AI. If you&apos;re in crisis, please use{" "}
          <a href="/safety" className="text-[var(--danger)] font-semibold hover:underline">SOS · Urgent Help</a>.
        </p>
      </form>
    </div>
  );
}
