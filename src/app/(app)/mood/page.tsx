"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Wind, Zap, Frown, AlertCircle, CheckCircle, History, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { recordMood, getMoodHistory } from "@/actions/mood";
import { StressLevel } from "@prisma/client";

// ─── Design spec: 5-point scale, supportive labels (no "Severe Stress")
// ─── Mood colors: soft emotional tones (NOT medical dashboard colors)
const stressLevels = [
  { value: 1, label: "Very Calm",    emoji: "😌", barColor: "bg-[var(--mood-good)]",        textColor: "text-[var(--mood-good)]"  },
  { value: 2, label: "Mostly Okay",  emoji: "🙂", barColor: "bg-[var(--mood-calm)]",        textColor: "text-[var(--mood-calm)]"  },
  { value: 3, label: "Some Tension", emoji: "😐", barColor: "bg-[var(--mood-okay)]",        textColor: "text-[var(--text-muted)]"  },
  { value: 4, label: "High Pressure",emoji: "😟", barColor: "bg-[var(--mood-low)]",         textColor: "text-[var(--accent-ai)]"  },
  { value: 5, label: "Overwhelmed",  emoji: "😰", barColor: "bg-[var(--mood-overwhelmed)]", textColor: "text-[var(--accent-warm)]"  },
];

const moods = [
  { label: "Calm",       icon: Wind  },
  { label: "Focused",    icon: Zap   },
  { label: "Anxious",    icon: Frown },
  { label: "Exhausted",  icon: AlertCircle },
  { label: "Hopeful",    icon: Smile },
];



const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function MoodPage() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedStress, setSelectedStress] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState<"checkin" | "history">("checkin");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchHistory(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (uid: string) => {
    const res = await getMoodHistory(uid);
    if (res.success && res.records) {
      const mapped = res.records.map((r: any) => {
        const levelMap: Record<string, number> = {
          VERY_LOW: 1, LOW: 2, MODERATE: 3, HIGH: 4, VERY_HIGH: 5
        };
        return {
          date: new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
          level: levelMap[r.stressLevel] || 3,
          mood: r.moodLabel || "Okay",
          note: r.notes || "",
        };
      });
      setHistory(mapped);
    }
  };

  const handleSubmit = async () => {
    if (selectedStress && selectedMood && user) {
      setSubmitting(true);
      const levelMap: Record<number, StressLevel> = {
        1: "VERY_LOW", 2: "LOW", 3: "MODERATE", 4: "HIGH", 5: "VERY_HIGH"
      };
      const stressLevelEnum = levelMap[selectedStress] || "MODERATE";
      
      const res = await recordMood(user.uid, selectedStress, stressLevelEnum, selectedMood, note);
      
      if (res.success) {
        setSubmitted(true);
        await fetchHistory(user.uid);
      }
      setSubmitting(false);
    }
  };

  const highPressureWarning = selectedStress !== null && selectedStress >= 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="space-y-8 max-w-2xl"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight">Wellness Check-in</h1>
          <p className="text-[var(--text-secondary)] mt-1">A moment to pause and notice how you&apos;re feeling.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("checkin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              view === "checkin"
                ? "bg-[var(--surface-secondary)] text-[var(--primary-hover)] border border-[var(--primary-soft)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]"
            }`}
          >
            Check-in
          </button>
          <button
            onClick={() => setView("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              view === "history"
                ? "bg-[var(--surface-secondary)] text-[var(--primary-hover)] border border-[var(--primary-soft)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]"
            }`}
          >
            <History className="w-4 h-4" /> History
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">

        {/* ─── CHECK-IN VIEW ─── */}
        {view === "checkin" && !submitted && (
          <motion.div
            key="checkin"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="space-y-6"
          >
            {/* Stress Scale */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>How much pressure are you feeling right now?</CardTitle>
                  <CardDescription>Tap a level — 1 is very calm, 5 is overwhelmed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {stressLevels.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setSelectedStress(s.value)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                          selectedStress === s.value
                            ? "border-[var(--primary)] bg-[var(--surface-secondary)]"
                            : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary-soft)] hover:bg-[var(--background-secondary)]"
                        }`}
                      >
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="text-[10px] font-semibold text-center text-[var(--text-secondary)] leading-tight">{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Visual bar */}
                  {selectedStress && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                    >
                      <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1.5">
                        <span>Very Calm</span>
                        <span className={`font-semibold ${stressLevels[selectedStress - 1].textColor}`}>
                          {stressLevels[selectedStress - 1].label}
                        </span>
                        <span>Overwhelmed</span>
                      </div>
                      <div className="w-full bg-[var(--background-secondary)] h-2 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(selectedStress / 5) * 100}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" as const }}
                          className={`${stressLevels[selectedStress - 1].barColor} h-full rounded-full`}
                        />
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Safety Guardrail — gentle nudge for high pressure (per spec STU-07-02) */}
            <AnimatePresence>
              {highPressureWarning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl bg-[#FFF6ED] border border-[#FFD9AE] p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-[var(--warning)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#7A4A1E]">You&apos;re carrying a lot right now.</p>
                    <p className="text-sm text-[#7A4A1E]/80 mt-0.5">
                      That&apos;s okay — you don&apos;t have to carry it alone. Consider{" "}
                      <a href="/mitra" className="underline font-medium text-[var(--warning)]">talking to Mitra</a>{" "}
                      or <a href="/support" className="underline font-medium text-[var(--warning)]">booking a counsellor</a>.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mood Selector */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>What&apos;s the dominant feeling?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((m) => (
                      <button
                        key={m.label}
                        onClick={() => setSelectedMood(m.label)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                          selectedMood === m.label
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                            : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary-soft)] hover:text-[var(--primary)]"
                        }`}
                      >
                        <m.icon className="w-4 h-4" />
                        {m.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Optional Note */}
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Anything else on your mind? <span className="text-[var(--text-muted)] font-normal text-sm">(optional)</span></CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write a short note for yourself… it stays private."
                    rows={3}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[rgba(95,184,166,0.15)] transition-all duration-200"
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                className="w-full h-13 text-base rounded-full"
                onClick={handleSubmit}
                disabled={!selectedStress || !selectedMood || submitting || !user}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Check-in"}
              </Button>
              {(!selectedStress || !selectedMood) && (
                <p className="text-xs text-center text-[var(--text-muted)] mt-2">Select a stress level and a mood to continue.</p>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* ─── SUCCESS STATE ─── */}
        {view === "checkin" && submitted && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 space-y-5"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-[var(--primary-hover)]">Check-in saved.</h2>
            <p className="text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
              Thank you for pausing. Noticing how you feel is the first step to taking care of yourself. 🌿
            </p>
            <div className="flex gap-3 justify-center pt-4">
              <Button variant="secondary" onClick={() => { setSubmitted(false); setSelectedStress(null); setSelectedMood(null); setNote(""); }}>
                Log another
              </Button>
              <Button onClick={() => setView("history")}>
                View history
              </Button>
            </div>
          </motion.div>
        )}

        {/* ─── HISTORY VIEW ─── */}
        {view === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* 7-day bar chart (visual-only prototype) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Last 5 Check-ins</CardTitle>
                <CardDescription>Your stress trend over time.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-20">
                  {history.slice().reverse().map((h, i) => {
                    const lvl = stressLevels[h.level - 1];
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(h.level / 5) * 100}%` }}
                          transition={{ delay: i * 0.07, duration: 0.4, ease: "easeOut" as const }}
                          className={`w-full rounded-t-lg ${lvl.barColor} opacity-80 min-h-[6px]`}
                          style={{ height: `${(h.level / 5) * 64}px` }}
                        />
                        <span className="text-[10px] text-[var(--text-muted)]">{i === history.length - 1 ? "Today" : `${history.length - 1 - i}d`}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Empty state check */}
            {history.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-lg font-semibold text-[var(--text-primary)]">You haven&apos;t logged how you&apos;re feeling yet today.</p>
                <p className="text-[var(--text-secondary)] text-sm">Check-ins help you spot patterns over time.</p>
                <Button onClick={() => setView("checkin")} className="mt-4">Do your first check-in</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((h, i) => {
                  const lvl = stressLevels[h.level - 1];
                  return (
                    <Card key={i}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-[var(--surface-secondary)]`}>
                          {lvl.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-sm font-semibold ${lvl.textColor}`}>{lvl.label}</span>
                            <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{h.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-[var(--text-secondary)] px-2 py-0.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--primary-soft)]">{h.mood}</span>
                            {h.note && <span className="text-xs text-[var(--text-muted)] truncate">{h.note}</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
