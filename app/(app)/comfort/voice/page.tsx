"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { PageHeader } from "@/frontend/components/ui/shared";
import { ArrowLeft, Mic, Square, Play, Pause, Trash2, Shield } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import Link from "next/link";

interface VoiceNote {
  id: string;
  duration: number; // in seconds
  date: string;
}

const mockNotes: VoiceNote[] = [
  { id: "1", duration: 15, date: "Oct 12, 2023" },
  { id: "2", duration: 42, date: "Oct 5, 2023" },
];

export default function VoiceNotesPage() {
  const [notes, setNotes] = useState<VoiceNote[]>(mockNotes);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // For playback simulation
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (recordingTime > 0) {
      setNotes([{
        id: Date.now().toString(),
        duration: recordingTime,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }, ...notes]);
    }
    setRecordingTime(0);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (playingId === id) setPlayingId(null);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <Link href="/comfort" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Comfort Library
      </Link>
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mx-auto mb-4">
          <Mic className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <h1 className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight">Self-Comfort Notes</h1>
        <p className="text-[var(--text-secondary)] mt-2 max-w-md mx-auto">Record encouraging messages to yourself. Play them back when you need a reminder of your strength.</p>
      </div>

      <Card className="bg-[var(--background-secondary)] border-[var(--border)]">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-4xl font-display font-semibold text-[var(--text-primary)] tracking-wider">
            {formatTime(recordingTime)}
          </div>
          
          <div className="flex justify-center">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-16 h-16 rounded-full bg-[var(--danger)] hover:bg-[var(--danger)] text-[var(--primary-foreground)] flex items-center justify-center transition-colors shadow-lg shadow-[var(--danger)]/20"
              >
                <Square className="w-6 h-6 fill-current" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="w-16 h-16 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] flex items-center justify-center transition-colors shadow-lg shadow-[var(--primary)]/20 relative"
              >
                <div className="absolute inset-0 rounded-full border-2 border-[var(--primary)] animate-ping opacity-20" />
                <Mic className="w-6 h-6" />
              </button>
            )}
          </div>
          <p className={isRecording ? "text-[var(--danger)] font-medium text-sm animate-pulse" : "text-[var(--text-secondary)] text-sm"}>
            {isRecording ? "Recording..." : "Tap to start recording"}
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-[var(--text-muted)] px-1">
        <span className="font-semibold uppercase tracking-wider">Your Recordings</span>
        <div className="flex items-center gap-1.5 bg-[var(--surface-secondary)] text-[var(--primary)] px-2 py-0.5 rounded-full text-xs">
          <Shield className="w-3 h-3" /> Encrypted locally
        </div>
      </div>

      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">
            You don't have any voice notes yet.
          </div>
        ) : (
          notes.map(note => (
            <Card key={note.id} className="hover:shadow-[0_2px_12px_rgba(30,80,60,0.05)] transition-all duration-200">
              <CardContent className="p-4 flex items-center gap-4">
                <button
                  onClick={() => setPlayingId(playingId === note.id ? null : note.id)}
                  className="w-10 h-10 rounded-full bg-[var(--background-secondary)] hover:bg-[var(--surface-secondary)] flex items-center justify-center text-[var(--primary)] transition-colors shrink-0"
                >
                  {playingId === note.id ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                </button>
                <div className="flex-1">
                  <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                    {playingId === note.id && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: note.duration, ease: "linear" }}
                        className="h-full bg-[var(--primary-soft)]"
                      />
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
                    <span className="font-medium text-[var(--text-secondary)]">{note.date}</span>
                    <span>{formatTime(note.duration)}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors rounded-lg hover:bg-[var(--danger-soft)]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </motion.div>
  );
}
