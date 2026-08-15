"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain, Send, RotateCcw, Sparkles, Mic } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "mitra";
  content: string;
  timestamp: string;
  actions?: { label: string; href: string }[];
}

const suggestedPrompts = [
  "Help me plan my week",
  "I'm feeling overwhelmed right now",
  "What should I focus on today?",
  "I failed an exam and I don't know how to feel",
];

const initialMessages: Message[] = [
  {
    id: "0",
    role: "mitra",
    content: "Hi 👋 I'm Mitra. This is a safe, private space. You can share how you're feeling, ask for help planning your week, or just talk. What's on your mind today?",
    timestamp: "Just now",
    actions: [],
  },
];

export default function MitraPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea per spec STU-04-02
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [input]);

  const send = (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate streaming response (will be replaced by real API)
    setTimeout(() => {
      setIsTyping(false);
      const mitraMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "mitra",
        content: getMitraResponse(content),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: content.toLowerCase().includes("plan") || content.toLowerCase().includes("task")
          ? [{ label: "Open Planner", href: "/planner" }]
          : [],
      };
      setMessages((prev) => [...prev, mitraMsg]);
    }, 1800);
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send, Shift+Enter for newline — per spec STU-04-02
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => setMessages(initialMessages);

  return (
    <div className="max-w-2xl mx-auto h-[calc(100vh-7rem)] md:h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EEF3EF] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#DDF2E3] flex items-center justify-center">
            <Brain className="w-5 h-5 text-[#2E7D5B]" />
          </div>
          <div>
            <p className="text-base font-display font-semibold text-[#1F2937]">Mitra</p>
            <p className="text-xs text-[#98A2B3]">Private AI companion · Not a therapist</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/mitra/call"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2E7D5B] text-white hover:bg-[#1E5C41] transition-colors"
            title="Start Voice/Video Call"
          >
            <Mic className="w-4 h-4" />
          </a>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-[#98A2B3] hover:text-[#667085] transition-colors px-2 py-1.5 rounded-lg hover:bg-[#F7FBF8]"
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
            {msg.role === "mitra" && (
              <div className="w-8 h-8 rounded-full bg-[#DDF2E3] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Brain className="w-4 h-4 text-[#2E7D5B]" />
              </div>
            )}

            <div className={`max-w-[80%] space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#2E7D5B] text-white rounded-tr-sm"
                    : "bg-[#EFF8F1] text-[#1F2937] rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>

              {/* Contextual actions — spec STU-04-05 */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {msg.actions.map((a) => (
                    <a
                      key={a.label}
                      href={a.href}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#DDF2E3] text-xs font-semibold text-[#2E7D5B] hover:bg-[#EFF8F1] transition-colors"
                    >
                      <Sparkles className="w-3 h-3" /> {a.label}
                    </a>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-[#98A2B3] px-1">{msg.timestamp}</p>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator — spec STU-04-04 */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#DDF2E3] flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-[#2E7D5B]" />
              </div>
              <div className="bg-[#EFF8F1] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#4FA477]"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
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
              onClick={() => send(p)}
              className="px-3 py-1.5 rounded-full bg-[#F7FBF8] border border-[#E4EDE7] text-xs font-medium text-[#667085] hover:bg-[#EFF8F1] hover:text-[#2E7D5B] hover:border-[#DDF2E3] transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="shrink-0 pt-3 border-t border-[#EEF3EF] space-y-2">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-[#D7E2DA] bg-[#F7FBF8] px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#2E7D5B] focus:ring-2 focus:ring-[rgba(46,125,91,0.15)] transition-all overflow-hidden"
          />
          <Button
            size="icon"
            variant="outline"
            className="h-11 w-11 flex-shrink-0 rounded-xl border-[#D7E2DA] text-[#667085] hover:text-[#2E7D5B] hover:bg-[#F7FBF8]"
            aria-label="Voice input"
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => send()}
            disabled={!input.trim() || isTyping}
            className="h-11 w-11 flex-shrink-0 rounded-xl"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-[#98A2B3] text-center">
          Mitra is an AI. If you&apos;re in crisis, please use{" "}
          <a href="/safety" className="text-[#C94A4A] font-semibold hover:underline">SOS · Urgent Help</a>.
        </p>
      </div>
    </div>
  );
}

function getMitraResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("overwhelm") || lower.includes("stress"))
    return "That sounds really heavy. Feeling overwhelmed is your mind's way of saying there's too much at once. Want to try breaking things down together? Sometimes just naming what's piling up makes it feel more manageable. 🌿";
  if (lower.includes("plan") || lower.includes("week") || lower.includes("task"))
    return "Let's build a plan together. What are the 2-3 most important things you need to get done? We can organize them in your Planner and figure out a realistic order.";
  if (lower.includes("fail") || lower.includes("exam"))
    return "I'm really sorry to hear that. Failing something feels awful — especially when you worked hard. But one exam doesn't define you or your potential. Do you want to talk about what happened, or would you prefer we focus on what comes next?";
  if (lower.includes("focus") || lower.includes("today"))
    return "For today, I'd suggest picking just ONE important task to anchor your morning. What's the thing that, if done today, would make you feel most relieved?";
  return "Thank you for sharing that with me. I want to make sure I understand — could you tell me a bit more? I'm here and not in a rush. 💚";
}
