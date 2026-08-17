"use client";

import { useRef, useState, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Send, RotateCcw, Mic, CheckCircle2, Loader2, MessageSquare, Plus, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useChatContext } from "@/components/chat/chat-provider";

const suggestedPrompts = [
  "Help me plan my week",
  "I'm feeling overwhelmed right now",
  "What should I focus on today?",
  "I failed an exam and I don't know how to feel",
];

export default function MitraPage() {
  const {
    user,
    historyLoaded,
    conversationId,
    conversations,
    messages,
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    append,
    loadActiveConversation,
    reset,
  } = useChatContext();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

  const sendSuggested = (prompt: string) => {
    append({ role: "user", content: prompt });
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleInputChange({ target: { value: input ? input + " " + transcript : transcript } } as any);
      };
      
      recognition.start();
    } else {
      alert("Voice input is not supported in this browser.");
    }
  };

  if (!historyLoaded) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-5rem)] flex relative overflow-hidden -mx-4 sm:mx-0 sm:rounded-2xl sm:border border-[var(--border-subtle)] bg-[var(--surface)]">
      
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden absolute inset-0 bg-black/20 z-20"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`absolute md:relative z-30 h-full w-64 bg-[var(--surface-secondary)] border-r border-[var(--border-subtle)] flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-64 w-0 md:block"
        }`}
        style={{ width: isSidebarOpen ? 256 : undefined }}
      >
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[var(--text-primary)]">Chat History</h3>
          <button onClick={toggleSidebar} className="md:hidden text-[var(--text-muted)] p-1">
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3">
          <Button onClick={() => { reset(); if (window.innerWidth < 768) setIsSidebarOpen(false); }} className="w-full gap-2 bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]">
            <Plus className="w-4 h-4" /> New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                loadActiveConversation(user!.uid, c.id);
                if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                conversationId === c.id 
                  ? "bg-[var(--background-primary)] font-medium text-[var(--primary)] shadow-sm" 
                  : "text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate flex-1">{c.title || "New Conversation"}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--surface)]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] shrink-0 bg-[var(--surface)]">
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleSidebar}
              className="md:hidden p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
            <motion.div 
              animate={{ opacity: [0.8, 1, 0.8], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 rounded-full bg-[var(--surface-ai)] border border-[var(--border-subtle)] flex items-center justify-center shadow-soft"
            >
              <Brain className="w-5 h-5 text-[var(--accent-ai)]" />
            </motion.div>
            <div>
              <p className="text-base font-display font-semibold text-[var(--text-primary)]">Mitra</p>
              <p className="text-xs text-[var(--text-muted)]">Private AI companion</p>
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
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
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
                    
                    {/* Tool Invocations */}
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
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isLoading && (messages.length === 0 || messages[messages.length - 1]?.role === "user" || (messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.content)) && (
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
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="flex gap-2 flex-wrap px-4 md:px-6 pb-3 shrink-0">
            {suggestedPrompts.map((p, i) => (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={p}
                onClick={() => sendSuggested(p)}
                className="px-3 py-1.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--primary)] hover:border-[var(--primary-soft)] transition-colors"
              >
                {p}
              </motion.button>
            ))}
          </div>
        )}

        {/* Composer */}
        <form onSubmit={handleSubmit} className="shrink-0 p-4 border-t border-[var(--border-subtle)] space-y-2 bg-[var(--surface)]">
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
              onClick={startListening}
              className={`h-11 w-11 flex-shrink-0 rounded-xl border-[var(--border)] transition-colors ${
                isListening ? "bg-red-50 text-red-500 border-red-200 animate-pulse" : "text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--background-secondary)]"
              }`}
              title="Voice input"
            >
              <Mic className="w-4 h-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="h-11 w-11 flex-shrink-0 rounded-xl"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] text-center">
            Mitra is an AI. If you're in crisis, please use{" "}
            <a href="/safety" className="text-[var(--danger)] font-semibold hover:underline">SOS · Urgent Help</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
