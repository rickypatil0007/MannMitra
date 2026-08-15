"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Wind, Zap, Frown, AlertCircle, CheckCircle, History } from "lucide-react";

// ─── Design spec: 5-point scale, supportive labels (no "Severe Stress")
const stressLevels = [
  { value: 1, label: "Very Calm",    emoji: "😌", barColor: "bg-[#2E7D5B]",  textColor: "text-[#2E7D5B]"  },
  { value: 2, label: "Mostly Okay",  emoji: "🙂", barColor: "bg-[#4FA477]",  textColor: "text-[#4FA477]"  },
  { value: 3, label: "Some Tension", emoji: "😐", barColor: "bg-[#D4A45B]",  textColor: "text-[#D4A45B]"  },
  { value: 4, label: "High Pressure",emoji: "😟", barColor: "bg-[#D4875B]",  textColor: "text-[#D4875B]"  },
  { value: 5, label: "Overwhelmed",  emoji: "😰", barColor: "bg-[#C97A5B]",  textColor: "text-[#C97A5B]"  },
];

const moods = [
  { label: "Calm",       icon: Wind  },
  { label: "Focused",    icon: Zap   },
  { label: "Anxious",    icon: Frown },
  { label: "Exhausted",  icon: AlertCircle },
  { label: "Hopeful",    icon: Smile },
];

// Mock history data
const history = [
  { date: "Today, 9:00 AM",   level: 3, mood: "Anxious",  note: "Midterms are piling up." },
  { date: "Yesterday",        level: 2, mood: "Focused",  note: "" },
  { date: "2 days ago",       level: 4, mood: "Exhausted", note: "Barely slept." },
  { date: "3 days ago",       level: 2, mood: "Calm",     note: "" },
  { date: "4 days ago",       level: 3, mood: "Anxious",  note: "" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function MoodPage() {
  const [selectedStress, setSelectedStress] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState<"checkin" | "history">("checkin");

  const handleSubmit = () => {
    if (selectedStress && selectedMood) setSubmitted(true);
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
          <h1 className="text-3xl font-display font-semibold text-[#1F2937] tracking-tight">Wellness Check-in</h1>
          <p className="text-[#667085] mt-1">A moment to pause and notice how you&apos;re feeling.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("checkin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              view === "checkin"
                ? "bg-[#EFF8F1] text-[#1F5D43] border border-[#DDF2E3]"
                : "text-[#667085] hover:bg-[#F7FBF8]"
            }`}
          >
            Check-in
          </button>
          <button
            onClick={() => setView("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              view === "history"
                ? "bg-[#EFF8F1] text-[#1F5D43] border border-[#DDF2E3]"
                : "text-[#667085] hover:bg-[#F7FBF8]"
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
                            ? "border-[#2E7D5B] bg-[#EFF8F1]"
                            : "border-[#E4EDE7] bg-white hover:border-[#4FA477] hover:bg-[#F7FBF8]"
                        }`}
                      >
                        <span className="text-2xl">{s.emoji}</span>
                        <span className="text-[10px] font-semibold text-center text-[#667085] leading-tight">{s.label}</span>
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
                      <div className="flex justify-between text-xs text-[#98A2B3] mb-1.5">
                        <span>Very Calm</span>
                        <span className={`font-semibold ${stressLevels[selectedStress - 1].textColor}`}>
                          {stressLevels[selectedStress - 1].label}
                        </span>
                        <span>Overwhelmed</span>
                      </div>
                      <div className="w-full bg-[#EEF3EF] h-2 rounded-full overflow-hidden">
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
                  <AlertCircle className="w-5 h-5 text-[#D4875B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-[#7A4A1E]">You&apos;re carrying a lot right now.</p>
                    <p className="text-sm text-[#7A4A1E]/80 mt-0.5">
                      That&apos;s okay — you don&apos;t have to carry it alone. Consider{" "}
                      <a href="/mitra" className="underline font-medium text-[#D4875B]">talking to Mitra</a>{" "}
                      or <a href="/support" className="underline font-medium text-[#D4875B]">booking a counsellor</a>.
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
                            ? "bg-[#2E7D5B] text-white border-[#2E7D5B]"
                            : "bg-white text-[#667085] border-[#E4EDE7] hover:border-[#4FA477] hover:text-[#2E7D5B]"
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
                  <CardTitle>Anything else on your mind? <span className="text-[#98A2B3] font-normal text-sm">(optional)</span></CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Write a short note for yourself… it stays private."
                    rows={3}
                    className="w-full rounded-xl border border-[#D7E2DA] bg-white px-4 py-3 text-sm text-[#1F2937] placeholder:text-[#98A2B3] resize-none focus:outline-none focus:border-[#2E7D5B] focus:ring-2 focus:ring-[rgba(46,125,91,0.15)] transition-all duration-200"
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                className="w-full h-13 text-base rounded-full"
                onClick={handleSubmit}
                disabled={!selectedStress || !selectedMood}
              >
                Save Check-in
              </Button>
              {(!selectedStress || !selectedMood) && (
                <p className="text-xs text-center text-[#98A2B3] mt-2">Select a stress level and a mood to continue.</p>
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
            <div className="w-16 h-16 mx-auto rounded-full bg-[#EFF8F1] flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[#2E7D5B]" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-[#1F5D43]">Check-in saved.</h2>
            <p className="text-[#667085] max-w-sm mx-auto leading-relaxed">
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
                        <span className="text-[10px] text-[#98A2B3]">{i === history.length - 1 ? "Today" : `${history.length - 1 - i}d`}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Empty state check */}
            {history.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <p className="text-lg font-semibold text-[#1F2937]">You haven&apos;t logged how you&apos;re feeling yet today.</p>
                <p className="text-[#667085] text-sm">Check-ins help you spot patterns over time.</p>
                <Button onClick={() => setView("checkin")} className="mt-4">Do your first check-in</Button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((h, i) => {
                  const lvl = stressLevels[h.level - 1];
                  return (
                    <Card key={i}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-[#F7FBF8]`}>
                          {lvl.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-sm font-semibold ${lvl.textColor}`}>{lvl.label}</span>
                            <span className="text-xs text-[#98A2B3] flex-shrink-0">{h.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-medium text-[#667085] px-2 py-0.5 rounded-full bg-[#EFF8F1] border border-[#DDF2E3]">{h.mood}</span>
                            {h.note && <span className="text-xs text-[#98A2B3] truncate">{h.note}</span>}
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
