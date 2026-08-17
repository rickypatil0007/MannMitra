"use client";

import * as motion from "framer-motion/client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Headphones, Wind, BookHeart, Play, Pause, X, Music, ExternalLink, SkipForward, SkipBack } from "lucide-react";

type LofiTrack = {
  id: string;
  title: string;
  description: string;
  youtubeVideoId: string;
};

const lofiTracks: LofiTrack[] = [
  {
    id: "focus",
    title: "Lofi Focus",
    description: "Soft beats for focused study sessions.",
    youtubeVideoId: "jfKfPfyJRdk"
  },
  {
    id: "chill",
    title: "Lofi Chill",
    description: "Relaxing background music for quiet breaks.",
    youtubeVideoId: "5yx6BWlEVcY"
  }
];

const resources = [
  { id: "breathe", title: "5-Minute Breathing", category: "Audio", icon: Wind, bg: "bg-[var(--surface-secondary)]", iconColor: "text-[var(--primary)]", duration: 300 },
  { id: "lofi", title: "Lo-Fi Study Beats", category: "Music", icon: Headphones, bg: "bg-[#F0F5FF]", iconColor: "text-[#5B7FD4]" },
  { id: "read", title: "Overcoming Perfectionism", category: "Reading", icon: BookHeart, bg: "bg-[#FFF6ED]", iconColor: "text-[var(--accent-warm)]" },
];

export default function ComfortPage() {
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [embedError, setEmbedError] = useState(false);

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

  const handleResourceClick = (res: typeof resources[number]) => {
    if (res.id === "breathe") {
      setActiveResource(res.id);
      setTimeLeft(res.duration ?? 0);
      setIsPlaying(true);
    } else if (res.id === "lofi") {
      setActiveResource("lofi");
      setEmbedError(false);
    } else if (res.id === "read") {
      setActiveResource("read");
    }
  };

  const closeResource = () => {
    setActiveResource(null);
    setEmbedError(false);
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

      {/* ─── Breathing Exercise Player ─── */}
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
              <Button size="icon" variant="outline" className="w-14 h-14 rounded-full bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--danger)]" onClick={closeResource}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Lo-Fi Music Player ─── */}
      {activeResource === "lofi" && (
        <Card className="bg-[#F0F5FF] border-[#5B7FD4]/30 border overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-display font-semibold text-[var(--text-primary)]">Lofi Study Space</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Take a breath, settle in, and focus.</p>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] shrink-0" onClick={closeResource}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* YouTube Embed */}
            {embedError ? (
              <div className="rounded-xl bg-[var(--surface)] border border-[var(--border)] p-8 text-center mb-6">
                <Headphones className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
                <p className="text-sm text-[var(--text-secondary)] font-medium">Lofi player couldn't be loaded right now. Please try another track.</p>
                <div className="flex justify-center mt-4">
                  <Button variant="outline" size="sm" onClick={() => setEmbedError(false)}>Retry</Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden bg-black/5 shadow-sm mb-6 w-full">
                <iframe
                  key={lofiTracks[currentTrackIndex].id}
                  src={`https://www.youtube.com/embed/${lofiTracks[currentTrackIndex].youtubeVideoId}?rel=0&modestbranding=1`}
                  title={lofiTracks[currentTrackIndex].title}
                  className="w-full aspect-video rounded-xl border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={() => setEmbedError(true)}
                />
              </div>
            )}

            {/* Track Info & Selection */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-[var(--text-primary)]">Lofi Study Session</h4>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Background music for studying, reading, or taking a quiet break.</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-3">Choose your vibe</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lofiTracks.map((track, idx) => (
                    <button
                      key={track.id}
                      onClick={() => { setCurrentTrackIndex(idx); setEmbedError(false); }}
                      className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                        currentTrackIndex === idx 
                        ? "bg-[#5B7FD4]/10 border-[#5B7FD4] shadow-sm" 
                        : "bg-[var(--surface)] border-[var(--border)] hover:border-[#5B7FD4]/50 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${currentTrackIndex === idx ? "bg-[#5B7FD4] text-white" : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"}`}>
                          {currentTrackIndex === idx ? <Headphones className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                        </div>
                        <p className="font-semibold text-[var(--text-primary)] text-sm">{track.title}</p>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] pl-11">{track.description}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-center text-[var(--text-muted)] mt-5">Music starts when you press play.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Overcoming Perfectionism Book Detail ─── */}
      {activeResource === "read" && (
        <Card className="bg-[#FFF6ED] border-[var(--accent-warm)]/20 border overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center shadow-sm">
                  <BookHeart className="w-5 h-5 text-[var(--accent-warm)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recommended Reading</h3>
                  <p className="text-xs text-[var(--text-muted)]">Self-help resource</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" className="rounded-full text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)]" onClick={closeResource}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Book Cover Placeholder */}
              <div className="w-36 h-52 rounded-xl bg-gradient-to-br from-[#F97316]/20 via-[#FBBF24]/15 to-[#F59E0B]/25 border border-[var(--accent-warm)]/20 flex flex-col items-center justify-center shrink-0 shadow-sm mx-auto sm:mx-0">
                <BookHeart className="w-10 h-10 text-[var(--accent-warm)] mb-3" />
                <p className="text-xs font-bold text-[var(--accent-warm)] text-center px-3 leading-tight">Overcoming Perfectionism</p>
              </div>

              {/* Book Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-2">
                    Overcoming Perfectionism
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    Perfectionism can feel like a strength, but when it starts holding you back — making you procrastinate,
                    fear failure, or feel never &quot;good enough&quot; — it becomes a barrier to your wellbeing.
                  </p>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  This resource explores practical strategies for recognizing perfectionist patterns and
                  gently shifting toward self-compassion. It&apos;s okay to aim high — and it&apos;s also okay to be human.
                </p>

                <div className="bg-[var(--surface)] rounded-xl p-4 border border-[var(--border-subtle)]">
                  <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
                    &quot;Progress, not perfection, is what we should be asking of ourselves.&quot;
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <Button className="bg-[var(--accent-warm)] hover:bg-[var(--accent-warm)]/90 text-white gap-2" asChild>
                    <a href="https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Perfectionism" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                      Explore Resource
                    </a>
                  </Button>
                </div>

                <p className="text-xs text-[var(--text-muted)]">
                  Free resource from the Centre for Clinical Interventions (CCI) — evidence-based self-help modules.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── Resource Cards Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
    </motion.div>
  );
}
