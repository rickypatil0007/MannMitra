"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { PageHeader, EmptyState } from "@/frontend/components/ui/shared";
import { Book, Plus, Search, Calendar, X, Save, Mic, Trash2, Pin, PinOff, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getNotes, createNote, updateNote, deleteNote, togglePinNote } from "@/backend/actions/notes";

// ─── Reflection Prompts: curated, rotating daily prompts
const REFLECTION_PROMPTS = [
  "What made you smile today, even for a moment?",
  "What's one thing you learned about yourself this week?",
  "If you could tell your morning self one thing, what would it be?",
  "What are you grateful for right now?",
  "What's something difficult you handled well recently?",
  "Describe a small moment of peace you experienced today.",
  "What would you like to let go of?",
  "Who made a positive difference in your day?",
  "What's a challenge you're facing, and what's one tiny step forward?",
  "How did you take care of yourself today?",
  "What's something you're proud of, no matter how small?",
  "If your stress could talk, what would it say? What would you say back?",
  "Write a letter to your future self — what do you hope for?",
  "What boundary did you set or wish you had set today?",
  "Describe one thing that felt 'enough' today.",
];

function getDailyPrompts(): string[] {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const shuffled = [...REFLECTION_PROMPTS].sort((a, b) => {
    const ha = (dayIndex * 31 + a.length) % REFLECTION_PROMPTS.length;
    const hb = (dayIndex * 31 + b.length) % REFLECTION_PROMPTS.length;
    return ha - hb;
  });
  return shuffled.slice(0, 3);
}

interface NoteData {
  id: string;
  title: string | null;
  content: string;
  isPinned: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

import { GuestPrompt } from "@/frontend/components/auth/guest-prompt";

export default function NotesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "edit">("list");

  // Edit state
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // Reflection prompts
  const [dailyPrompts] = useState(() => getDailyPrompts());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchNotes(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchNotes = useCallback(async (uid: string, searchTerm?: string) => {
    setLoading(true);
    const res = await getNotes(uid, searchTerm);
    if (res.success && res.notes) {
      setNotes(res.notes as NoteData[]);
    }
    setLoading(false);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!user) return;
    const timeout = setTimeout(() => {
      fetchNotes(user.uid, search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, user, fetchNotes]);

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

  const openNew = (prompt?: string) => {
    if (user?.isAnonymous) return;
    setActiveNoteId(null);
    setEditTitle("");
    setEditContent(prompt ? `💭 ${prompt}\n\n` : "");
    setView("edit");
  };

  const openNote = (n: NoteData) => {
    if (user?.isAnonymous) return;
    setActiveNoteId(n.id);
    setEditTitle(n.title || "");
    setEditContent(n.content);
    setView("edit");
  };

  const saveNote = async () => {
    if (!user || user.isAnonymous || (!editTitle.trim() && !editContent.trim())) {
      setView("list");
      return;
    }

    setSaving(true);
    if (activeNoteId) {
      await updateNote(user.uid, activeNoteId, editTitle, editContent);
    } else {
      await createNote(user.uid, editTitle, editContent);
    }
    await fetchNotes(user.uid, search);
    setSaving(false);
    setView("list");
  };

  const handleDelete = async () => {
    if (!user || user.isAnonymous || !activeNoteId) return;
    setDeleting(true);
    await deleteNote(user.uid, activeNoteId);
    await fetchNotes(user.uid, search);
    setDeleting(false);
    setView("list");
  };

  const handleTogglePin = async (noteId: string) => {
    if (!user || user.isAnonymous) return;
    await togglePinNote(user.uid, noteId);
    await fetchNotes(user.uid, search);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-4xl relative min-h-[60vh]"
    >
      <GuestPrompt feature="Diary" description="Create an account to securely save your private thoughts and reflections." />
      <PageHeader
        title="Personal Diary"
        description="A private, encrypted space for your thoughts."
        action={
          view === "list" && (
            <Button onClick={() => openNew()} className="gap-2">
              <Plus className="w-4 h-4" /> New Entry
            </Button>
          )
        }
      />

      <AnimatePresence mode="wait">
        {view === "list" ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* Reflection Prompts */}
            <div className="border border-[var(--moonlit-cyan)]/20 bg-[var(--moonlit-cyan)]/5 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[var(--moonlit-cyan)]" />
                  <span className="text-sm font-medium text-[var(--moonlit-cyan)]">Today&apos;s Reflection Prompts</span>
                </div>
                <div className="space-y-2">
                  {dailyPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => openNew(prompt)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--moonlit-cyan)]/40 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(121,175,194,0.1)] transition-all text-sm text-white/70 hover:text-white font-light"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search notes..."
                className="pl-9 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:border-[var(--moonlit-cyan)]/50 focus:ring-1 focus:ring-[var(--moonlit-cyan)]/50 rounded-2xl h-11"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Notes Grid */}
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--primary)]" />
              </div>
            ) : notes.length === 0 ? (
              <EmptyState
                icon={<Book className="w-10 h-10" />}
                title="No notes found"
                description={search ? "Try a different search term." : "Write your first diary entry to start clearing your mind."}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl hover:shadow-[0_0_20px_rgba(121,175,194,0.15)] hover:border-[var(--moonlit-cyan)]/30 hover:bg-white/10 transition-all duration-200 relative group overflow-hidden"
                    onClick={() => openNote(note)}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-white/90 truncate flex-1">{note.title || "Untitled"}</h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(note.id);
                          }}
                          className={`shrink-0 p-1 rounded-full transition-colors ${
                            note.isPinned
                              ? "text-[var(--moonlit-cyan)]"
                              : "text-white/30 opacity-0 group-hover:opacity-100 hover:text-white"
                          }`}
                        >
                          {note.isPinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-sm text-white/60 font-light mt-1.5 line-clamp-2 leading-relaxed">{note.content}</p>
                      <div className="flex items-center gap-1.5 mt-4 text-white/40">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase font-medium tracking-wider">
                          {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        {note.isPinned && (
                          <span className="ml-auto text-[10px] uppercase font-medium tracking-wider text-[var(--moonlit-cyan)]">Pinned</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
              <Button variant="ghost" size="sm" onClick={() => setView("list")} className="gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-4 h-4" /> Close
              </Button>
              <div className="flex items-center gap-2">
                {activeNoteId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="gap-2 text-[var(--danger)] border-[var(--danger)]/30 hover:bg-[var(--danger)]/10"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete
                  </Button>
                )}
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  className={`gap-2 min-w-[140px] ${!isRecording ? "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--primary)]" : "bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-red-200"}`}
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
                <Button
                  size="sm"
                  onClick={saveNote}
                  disabled={saving}
                  className="gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Entry
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
              className="w-full text-2xl font-display font-medium text-white placeholder:text-white/30 border-none focus:outline-none focus:ring-0 bg-transparent px-0"
            />

            <textarea
              placeholder="Start writing or recording..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[400px] text-base text-white/80 font-light placeholder:text-white/30 border-none focus:outline-none focus:ring-0 bg-transparent px-0 resize-none leading-relaxed"
              autoFocus
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
