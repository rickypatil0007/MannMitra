"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { PageHeader } from "@/frontend/components/ui/shared";
import { Button } from "@/frontend/components/ui/button";
import { Search, Send, User } from "lucide-react";
import { Input } from "@/frontend/components/ui/input";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageText, setMessageText] = useState("");

  const contacts = [
    { id: 1, name: "Student #482", lastMessage: "Thank you for the session yesterday.", unread: false, time: "10:30 AM" },
    { id: 2, name: "Student #391", lastMessage: "Can we reschedule our appointment?", unread: true, time: "Yesterday" },
    { id: 3, name: "Student #842", lastMessage: "The breathing exercises helped a lot.", unread: false, time: "Mon" },
  ];

  const messages = [
    { sender: "counsellor", text: "Hi, just checking in. How have you been feeling since our last session?", time: "09:00 AM" },
    { sender: "student", text: "I've been feeling a bit better, but the upcoming exams are still causing me a lot of stress. I tried the grounding technique you mentioned.", time: "10:15 AM" },
    { sender: "counsellor", text: "That's great that you tried the grounding technique. It takes practice. We can go over some more strategies tomorrow.", time: "10:20 AM" },
    { sender: "student", text: "Thank you for the session yesterday. Looking forward to tomorrow.", time: "10:30 AM" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-5xl h-[calc(100vh-8rem)] flex flex-col"
    >
      <PageHeader 
        title="Secure Messaging" 
        description="Communicate privately with your assigned students."
      />

      <Card className="border-[var(--border)] shadow-soft flex-1 overflow-hidden flex">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-[var(--border-subtle)] flex flex-col bg-[var(--background)]">
          <div className="p-4 border-b border-[var(--border-subtle)]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
              <Input placeholder="Search students..." className="pl-9 bg-[var(--surface)] border-[var(--border)]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {contacts.map(contact => (
              <button 
                key={contact.id}
                onClick={() => setSelectedChat(contact.id)}
                className={`w-full text-left p-4 border-b border-[var(--border-subtle)] flex items-start gap-3 transition-colors ${selectedChat === contact.id ? 'bg-[var(--surface-secondary)] border-l-4 border-l-[var(--primary)]' : 'hover:bg-[var(--surface-secondary)]'}`}
              >
                <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-semibold text-sm ${contact.unread ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{contact.name}</span>
                    <span className="text-xs text-[var(--text-muted)]">{contact.time}</span>
                  </div>
                  <p className={`text-xs truncate ${contact.unread ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>{contact.lastMessage}</p>
                </div>
                {contact.unread && (
                  <span className="w-2 h-2 rounded-full bg-[var(--danger)] shrink-0 mt-1.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[var(--surface)]">
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--background)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Student #482</h3>
              <p className="text-xs text-[var(--text-muted)]">Active Caseload</p>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === "counsellor" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                  msg.sender === "counsellor" 
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-tr-sm" 
                    : "bg-[var(--background-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tl-sm"
                }`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1.5 text-right ${msg.sender === "counsellor" ? "text-white/70" : "text-[var(--text-muted)]"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--background)]">
            <div className="flex gap-2">
              <Input 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a secure message..." 
                className="bg-[var(--surface)] border-[var(--border)]"
                onKeyDown={(e) => { if (e.key === 'Enter') setMessageText(''); }}
              />
              <Button onClick={() => setMessageText('')} size="icon" className="shrink-0 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)]">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
