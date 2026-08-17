"use client";

import * as motion from "framer-motion/client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, Wind, BookHeart, Coffee, MapPin, Play, Pause, X } from "lucide-react";
import Link from "next/link";

const resources = [
  { id: "breathe", title: "5-Minute Breathing", category: "Audio", icon: Wind, bg: "bg-[var(--surface-secondary)]", iconColor: "text-[var(--primary)]", duration: 300 },
  { id: "lofi", title: "Lo-Fi Study Beats", category: "Music", icon: Headphones, bg: "bg-[#F0F5FF]", iconColor: "text-[#5B7FD4]" },
  { id: "read", title: "Overcoming Perfectionism", category: "Reading", icon: BookHeart, bg: "bg-[#FFF6ED]", iconColor: "text-[var(--accent-warm)]" },
  { id: "morning", title: "Morning Grounding", category: "Audio", icon: Coffee, bg: "bg-[#FFF8EE]", iconColor: "text-[var(--warning)]" },
];

export default function ComfortPage() {
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  const handleResourceClick = (res: any) => {
    if (res.id === "breathe") {
      setActiveResource(res.id);
      setTimeLeft(res.duration);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="space-y-8 relative min-h-[60vh]"
    >
      <div>
        <h1 className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight">Comfort Library</h1>
        <p className="text-[var(--text-secondary)] mt-1">Curated resources to help you decompress and reset.</p>
      </div>

      {activeResource === "breathe" && (
        <Card className="bg-[var(--primary-soft)] border-[var(--primary)] border overflow-hidden">
          <CardContent className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--surface)] flex items-center justify-center mb-6 shadow-sm">
              <Wind className={`w-10 h-10 text-[var(--primary)] ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>
            <h3 className="text-xl font-bold text-[var(--primary-hover)] mb-2">4-7-8 Breathing</h3>
            <p className="text-[var(--primary-hover)]/70 mb-8 max-w-sm">Inhale for 4, hold for 7, exhale for 8. Follow the rhythm.</p>
            
            <div className="text-6xl font-display font-bold text-[var(--primary)] mb-8 tracking-tighter">
              {formatTime(timeLeft)}
            </div>

            <div className="flex gap-4">
              <Button size="icon" className="w-14 h-14 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] shadow-md" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
              <Button size="icon" variant="outline" className="w-14 h-14 rounded-full bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--danger)]" onClick={() => setActiveResource(null)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {resources.map((res, i) => (
          <Card key={i} onClick={() => handleResourceClick(res)} className={`hover:shadow-[0_2px_16px_rgba(30,80,60,0.1)] transition-all duration-300 cursor-pointer group ${activeResource === res.id ? 'ring-2 ring-[var(--primary)]' : ''}`}>
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-2xl ${res.bg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                <res.icon className={`w-6 h-6 ${res.iconColor}`} />
              </div>
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">{res.category}</p>
              <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug">{res.title}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quiet Space CTA */}
      <div className="rounded-2xl bg-[var(--primary-hover)] overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface)]/10 text-[var(--primary-foreground)]/80 text-xs font-medium mb-4">
              <MapPin className="w-3.5 h-3.5" /> Campus Feature
            </div>
            <h2 className="text-2xl font-display font-semibold text-[var(--primary-foreground)] mb-2">Need a quiet space?</h2>
            <p className="text-[var(--primary-foreground)]/70 leading-relaxed max-w-md">
              Find the least crowded study rooms and silent zones on campus — updated in real time.
            </p>
          </div>
          <Button asChild className="bg-[var(--primary-soft)] text-[var(--primary-hover)] hover:bg-[var(--surface)] font-semibold shrink-0 h-12 px-6">
            <Link href="/spaces">Open Campus Map</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
