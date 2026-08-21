"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/frontend/components/ui/button";
import { MessageSquare, Plus, PanelLeftClose, Loader2, Trash2, Video } from "lucide-react";
import { useChatContext } from "@/frontend/components/chat/chat-provider";
import { MitraChat } from "@/frontend/features/mitra-ai/components/MitraChat";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (!historyLoaded) {
    return (
      <div className="flex h-[calc(100vh-7rem)] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-5rem)] flex flex-col md:flex-row relative overflow-hidden -mx-4 sm:mx-0 sm:rounded-2xl sm:border border-white/10 bg-transparent">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button onClick={toggleSidebar} className="text-white/60 p-1">
            <PanelLeftClose className="w-5 h-5 rotate-180" />
          </button>
          <h3 className="font-medium text-sm text-white/90">Mitra AI</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/mitra/call')} className="h-8 gap-2 text-[var(--moonlit-cyan)] hover:text-white bg-[var(--moonlit-cyan)]/10 hover:bg-[var(--moonlit-cyan)]/20">
          <Video className="w-4 h-4" />
          <span className="text-xs font-semibold">Visual Call</span>
        </Button>
      </div>

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
        className={`absolute md:relative z-30 h-full w-64 bg-white/5 backdrop-blur-lg border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-64 w-0 md:block"
        }`}
        style={{ width: isSidebarOpen ? 256 : undefined }}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-medium text-sm text-white/90">Chat History</h3>
          <button onClick={toggleSidebar} className="md:hidden text-white/60 p-1">
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3">
          <Button onClick={() => { reset(); if (window.innerWidth < 768) setIsSidebarOpen(false); }} className="w-full gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/10">
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
                    ? "bg-white/10 font-medium text-white shadow-sm" 
                    : "text-white/60 font-light hover:bg-white/5 hover:text-white/90"
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
                className="absolute right-2 p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                title="Delete Chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 relative bg-transparent">
        {/* Desktop Visual Call Button Header */}
        <div className="hidden md:block absolute top-4 right-6 z-20">
           <Button variant="outline" size="sm" onClick={() => router.push('/mitra/call')} className="gap-2 shadow-lg border-white/20 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full px-4 font-medium transition-all hover:scale-105">
             <Video className="w-4 h-4 text-[var(--moonlit-cyan)]" />
             Visual Call Mode
           </Button>
        </div>
        
        <MitraChat
          firebaseUid={user?.uid || null}
          conversationId={conversationId || null}
          initialMessages={messages}
        />
      </div>
    </div>
  );
}
