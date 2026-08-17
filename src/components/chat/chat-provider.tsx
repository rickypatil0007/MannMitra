"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useChat, Message } from "ai/react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const initialMitraMessage: Message = {
  id: "0",
  role: "assistant",
  content: "Hi 👋 I'm Mitra. This is a safe, private space. You can share how you're feeling, ask for help planning your week, or just talk. What's on your mind today?",
};

type ChatContextType = {
  user: User | null;
  loadingHistory: boolean;
  historyLoaded: boolean;
  conversationId: string | null;
  conversations: any[];
  messages: Message[];
  input: string;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setMessages: (messages: Message[]) => void;
  append: (message: Message | Omit<Message, 'id'>) => Promise<string | null | undefined>;
  loadActiveConversation: (uid: string, cid?: string) => Promise<void>;
  reset: () => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [initialDbMessages, setInitialDbMessages] = useState<Message[]>([initialMitraMessage]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadConversationsList(currentUser.uid);
        await loadActiveConversation(currentUser.uid);
      } else {
        setHistoryLoaded(true);
        setLoadingHistory(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadConversationsList = async (uid: string) => {
    const { getUserConversations } = await import("@/actions/chat");
    const res = await getUserConversations(uid);
    if (res.success && res.conversations) {
      setConversations(res.conversations);
    }
  };

  const loadActiveConversation = async (uid: string, cid?: string) => {
    setLoadingHistory(true);
    setHistoryLoaded(false);
    const { getConversationHistory } = await import("@/actions/chat");
    const res = await getConversationHistory(uid, cid);
    
    if (res.success && res.conversationId) {
      setConversationId(res.conversationId);
      if (res.messages && res.messages.length > 0) {
        const mapped = res.messages.map((m: any) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          toolInvocations: m.toolInvocations,
        }));
        setInitialDbMessages(mapped);
      } else {
        setInitialDbMessages([initialMitraMessage]);
      }
    }
    setHistoryLoaded(true);
    setLoadingHistory(false);
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, append } = useChat({
    api: "/api/chat",
    initialMessages: initialDbMessages,
    body: { firebaseUid: user?.uid, conversationId },
    maxSteps: 5,
  });

  useEffect(() => {
    if (historyLoaded) {
      setMessages(initialDbMessages);
    }
  }, [initialDbMessages, historyLoaded, setMessages]);

  const reset = async () => {
    if (!user) return;
    const { createNewConversation } = await import("@/actions/chat");
    const res = await createNewConversation(user.uid);
    if (res.success && res.conversationId) {
      await loadConversationsList(user.uid);
      await loadActiveConversation(user.uid, res.conversationId);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        loadingHistory,
        historyLoaded,
        conversationId,
        conversations,
        messages,
        input,
        isLoading,
        handleInputChange,
        handleSubmit,
        setMessages,
        append,
        loadActiveConversation,
        reset,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}
