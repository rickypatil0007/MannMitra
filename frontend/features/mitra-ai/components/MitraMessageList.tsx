import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { MitraMessage as IMitraMessage } from "../types/mitra.types";
import { MitraMessage } from "./MitraMessage";
import { MitraTypingIndicator } from "./MitraTypingIndicator";
import { MitraErrorState } from "./MitraErrorState";
import { MitraChatState } from "../types/mitra.types";

interface MitraMessageListProps {
  messages: IMitraMessage[];
  chatState: MitraChatState;
  onRetry: () => void;
}

export function MitraMessageList({ messages, chatState, onRetry }: MitraMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatState]);

  const showTyping = chatState === "sending" || chatState === "responding";
  const showError = chatState === "error";

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MitraMessage key={msg.id} msg={msg} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {showTyping && (messages.length === 0 || messages[messages.length - 1]?.role === "user" || (messages[messages.length - 1]?.role === "assistant" && !messages[messages.length - 1]?.content)) && (
          <MitraTypingIndicator />
        )}
      </AnimatePresence>
      
      {showError && <MitraErrorState onRetry={onRetry} />}

      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
