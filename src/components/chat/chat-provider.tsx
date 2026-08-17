"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const initialMitraMessage = {
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
  messages: any[];
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
  const [messages, setMessages] = useState<any[]>([initialMitraMessage]);

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
        setMessages(mapped);
      } else {
        setMessages([initialMitraMessage]);
      }
    }
    setHistoryLoaded(true);
    setLoadingHistory(false);
  };

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
