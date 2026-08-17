"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, PanelLeftClose, Loader2, Trash2 } from "lucide-react";
import { useChatContext } from "@/components/chat/chat-provider";
import { MitraChat } from "@/features/mitra-ai/components/MitraChat";

export default function MitraPage() {
  const {
    user,
    historyLoaded,
    conversationId,
    conversations,
    loadActiveConversation,
    reset,
    messages,
    removeConversation,
  } = useChatContext();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
            <div key={c.id} className="relative group flex items-center">
              <button
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
                <span className="truncate flex-1 pr-6">{c.title || "New Conversation"}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeConversation(user!.uid, c.id);
                }}
                className="absolute right-2 p-1.5 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <MitraChat
        firebaseUid={user?.uid || null}
        conversationId={conversationId || null}
        initialMessages={messages}
      />
    </div>
  );
}
