import { useState, useCallback, useEffect } from "react";
import { useChat } from "ai/react";
import { MitraChatState, MitraMessage } from "../types/mitra.types";
import { MITRA_CONSTANTS } from "../constants/mitra.constants";

import { MitraClient } from "../services/mitra-client";

interface UseMitraChatProps {
  firebaseUid: string | null;
  conversationId: string | null;
  initialMessages?: MitraMessage[];
}

export function useMitraChat({ firebaseUid, conversationId, initialMessages = [] }: UseMitraChatProps) {
  const [chatState, setChatState] = useState<MitraChatState>("idle");

  const chat = useChat({
    api: MitraClient.getApiRoute(),
    // We transform MitraMessage to ai/react Message internally
    initialMessages: initialMessages as any,
    onResponse: (response) => {
      if (response.ok) {
        setChatState("responding");
      } else {
        setChatState("error");
      }
    },
    onFinish: () => {
      setChatState("success");
    },
    onError: (error) => {
      console.error("[MitraAI] Chat stream error:", error);
      setChatState("error");
    },
  });

  const { messages, input, handleInputChange, handleSubmit, setMessages, append: originalAppend, isLoading } = chat;

  // Sync messages when changing conversation
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages as any);
    }
  }, [initialMessages, setMessages]);

  // Sync loading state
  useEffect(() => {
    if (isLoading && chatState === "idle") {
      setChatState("sending");
    } else if (!isLoading && chatState === "sending") {
      // Handled by onResponse/onFinish but fallback here
    }
  }, [isLoading, chatState]);

  const append = useCallback(
    async (content: string) => {
      setChatState("sending");
      try {
        await originalAppend(
          { role: "user", content },
          { data: { firebaseUid, conversationId } as any }
        );
      } catch (error) {
        console.error("[MitraAI] Append error:", error);
        setChatState("error");
      }
    },
    [originalAppend, firebaseUid, conversationId]
  );

  const retry = useCallback(() => {
    setChatState("idle");
    // Remove the last user message if it failed, or just allow the user to resubmit
  }, []);

  return {
    messages: messages as unknown as MitraMessage[],
    input,
    handleInputChange,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim()) return;
      setChatState("sending");
      chat.handleSubmit(e, { data: { firebaseUid, conversationId } as any });
    },
    append,
    setMessages: setMessages as any,
    chatState,
    retry,
    isLoading,
  };
}
