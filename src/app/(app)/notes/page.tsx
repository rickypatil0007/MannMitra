"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, EmptyState } from "@/components/ui/shared";
import { Book, Plus, Search, Calendar, X, Save, Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

const initialNotes: Note[] = [
  { id: "1", title: "Thoughts on Midterms", content: "I feel a bit underprepared for CS301, but the rest seems manageable if I stick to the schedule.", date: "Oct 12, 2023" },
  { id: "2", title: "A Good Day", content: "Met up with Sarah today. We studied in the library and it was actually really productive.", date: "Oct 10, 2023" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "edit">("list");
  
  // Edit state
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setEditContent(
        (prev) =>
          prev +
          (prev ? "\n\n" : "") +
          `🎤 Voice Note (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}):\n"I'm feeling much better today. Taking things one step at a time helps..."`
      );
    } else {
      setIsRecording(true);
    }
  };

  const filtered = notes.filter(
    (n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setActiveNoteId(null);
    setEditTitle("");
    setEditContent("");
    setView("edit");
  };

  const openNote = (n: Note) => {
    setActiveNoteId(n.id);
    setEditTitle(n.title);
    setEditContent(n.content);
    setView("edit");
  };

  const saveNote = () => {
    if (!editTitle.trim() && !editContent.trim()) {
      setView("list");
      return;
    }

    if (activeNoteId) {
      setNotes((prev) => prev.map((n) => n.id === activeNoteId ? { ...n, title: editTitle || "Untitled", content: editContent } : n));
    } else {
      setNotes((prev) => [{
        id: Date.now().toString(),
        title: editTitle || "Untitled",
        content: editContent,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }, ...prev]);
    }
    setView("list");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-4xl"
    >
      <PageHeader 
        title="Personal Diary" 
        description="A private, encrypted space for your thoughts."
        action={
          view === "list" && (
            <Button onClick={openNew} className="gap-2">
              <Plus className="w-4 h-4" /> New Entry
            </Button>
          )
        }
      />

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#98A2B3]" />
              <Input 
                placeholder="Search notes..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {filtered.length === 0 ? (
              <EmptyState 
                icon={<Book className="w-10 h-10" />}
                title="No notes found"
                description={search ? "Try a different search term." : "Write your first diary entry to start clearing your mind."}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((note) => (
                  <Card key={note.id} className="cursor-pointer hover:shadow-soft hover:border-[var(--green-light)] transition-all duration-200" onClick={() => openNote(note)}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-[var(--text-primary)] truncate">{note.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">{note.content}</p>
                      <div className="flex items-center gap-1.5 mt-4 text-[var(--text-muted)]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-semibold tracking-wider">{note.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-4">
              <Button variant="ghost" size="sm" onClick={() => setView("list")} className="gap-2 text-[var(--text-supporting)] hover:text-[var(--text-primary)]">
                <X className="w-4 h-4" /> Close
              </Button>
              <div className="flex items-center gap-2">
                <Button 
                  variant={isRecording ? "destructive" : "outline"} 
                  size="sm" 
                  className={`gap-2 min-w-[140px] ${!isRecording ? "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--green-primary)]" : "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"}`} 
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-1" />
                      {formatTime(recordingTime)}
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" /> Record Voice
                    </>
                  )}
                </Button>
                <Button size="sm" onClick={saveNote} className="gap-2 bg-[var(--green-primary)] text-white hover:bg-[var(--green-dark)]">
                  <Save className="w-4 h-4" /> Save Entry
                </Button>
              </div>
            </div>

            {/* Recording visualizer */}
            <AnimatePresence>
              {isRecording && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-50 rounded-xl p-6 flex flex-col items-center justify-center gap-4 border border-red-100 overflow-hidden"
                >
                  <p className="text-red-500 font-medium text-sm animate-pulse">Recording voice note...</p>
                  <div className="flex items-center gap-1 h-12">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 bg-red-400 rounded-full"
                        animate={{ height: ["20%", "100%", "20%"] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.05,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <input 
              type="text"
              placeholder="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-2xl font-display font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border-none focus:outline-none focus:ring-0 bg-transparent px-0"
            />
            
            <textarea
              placeholder="Start writing or recording..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[400px] text-base text-[var(--text-secondary)] placeholder:text-[var(--text-muted)] border-none focus:outline-none focus:ring-0 bg-transparent px-0 resize-none leading-relaxed"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
