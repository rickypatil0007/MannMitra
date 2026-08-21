"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { PageHeader, EmptyState } from "@/frontend/components/ui/shared";
import { BookOpen, ArrowLeft, CheckCircle, ChevronRight } from "lucide-react";

const prompts = [
  { id: "difficult",   label: "What felt difficult?",                  placeholder: "What made this task or period feel hard?" },
  { id: "helped",      label: "What helped you get through it?",        placeholder: "What did you rely on — a friend, a habit, your own resilience?" },
  { id: "differently", label: "What would you try differently next time?", placeholder: "There's no wrong answer. Just think about one small change." },
];

interface Reflection {
  id: string;
  date: string;
  preview: string;
  answers: Record<string, string>;
}

const pastReflections: Reflection[] = [
  { id: "r1", date: "Yesterday", preview: "The lab report felt really overwhelming at first…", answers: { difficult: "The lab report felt really overwhelming at first, especially the analysis section.", helped: "Taking a 20-minute walk mid-afternoon helped me reset.", differently: "I'd start the analysis section 2 days earlier next time." } },
  { id: "r2", date: "3 days ago", preview: "Group meeting went better than expected…", answers: { difficult: "Coordinating everyone's availability was stressful.", helped: "We used a shared doc and it made everything clearer.", differently: "Set up the shared doc at the start of the project." } },
];

export default function ReflectionPage() {
  const [view, setView] = useState<"list" | "new" | "reading">("list");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [reading, setReading] = useState<Reflection | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>(pastReflections);

  const currentPrompt = prompts[step];
  const isLast = step === prompts.length - 1;

  const next = () => {
    if (isLast) {
      const r: Reflection = {
        id: Date.now().toString(),
        date: "Just now",
        preview: answers[prompts[0].id]?.slice(0, 60) + "…",
        answers,
      };
      setReflections((prev) => [r, ...prev]);
      setSaved(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const resetNew = () => {
    setAnswers({});
    setStep(0);
    setSaved(false);
    setView("list");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-2xl"
    >
      {view === "list" && (
        <>
          <PageHeader
            title="Reflections"
            description="A private journal to process your experiences."
            action={
              <Button onClick={() => setView("new")} className="gap-2">
                <BookOpen className="w-4 h-4" /> New Reflection
              </Button>
            }
          />
          {reflections.length === 0 ? (
            <EmptyState
              icon={<BookOpen className="w-10 h-10" />}
              title="No reflections yet."
              description="After completing something difficult, take a moment to reflect. It helps more than it seems."
              action={<Button variant="secondary" onClick={() => setView("new")}>Start your first reflection</Button>}
            />
          ) : (
            <div className="space-y-3">
              {reflections.map((r) => (
                <div key={r.id} className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl cursor-pointer hover:border-[var(--moonlit-cyan)]/30 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(121,175,194,0.1)] transition-all duration-200"
                  onClick={() => { setReading(r); setView("reading"); }}>
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-[var(--moonlit-cyan)]/70 uppercase tracking-wider mb-1">{r.date}</p>
                      <p className="text-sm text-white/90 font-light">{r.preview}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {view === "reading" && reading && (
        <>
          <button onClick={() => setView("list")} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-[var(--moonlit-cyan)]/70 uppercase tracking-wider mb-1">{reading.date}</p>
              <h2 className="text-2xl font-display font-medium text-white">Reflection</h2>
            </div>
            {prompts.map((p) => (
              <div key={p.id} className="space-y-2">
                <p className="text-sm font-medium text-[var(--moonlit-cyan)]">{p.label}</p>
                <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-xl">
                  <div className="p-5">
                    <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-light">
                      {reading.answers[p.id] || <span className="text-white/30 italic">Not answered</span>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "new" && !saved && (
        <>
          <button onClick={resetNew} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {prompts.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-[var(--moonlit-cyan)] shadow-[0_0_8px_rgba(121,175,194,0.5)]" : "bg-white/10"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <p className="text-xs font-medium text-[var(--moonlit-cyan)]/80 uppercase tracking-wider mb-2">
                  Question {step + 1} of {prompts.length}
                </p>
                <h2 className="text-2xl font-display font-medium text-white leading-tight">
                  {currentPrompt.label}
                </h2>
              </div>

              <textarea
                key={currentPrompt.id}
                value={answers[currentPrompt.id] || ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [currentPrompt.id]: e.target.value }))}
                placeholder={currentPrompt.placeholder}
                rows={6}
                autoFocus
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 text-sm text-white placeholder:text-white/30 font-light focus:outline-none focus:border-[var(--moonlit-cyan)]/50 focus:ring-1 focus:ring-[var(--moonlit-cyan)]/30 transition-all leading-relaxed"
              />

              <div className="flex gap-3 justify-between">
                {step > 0 && (
                  <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="text-white/60 hover:text-white hover:bg-white/5">Back</Button>
                )}
                <Button className="ml-auto bg-[var(--moonlit-cyan)]/80 text-white hover:bg-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/30" onClick={next} variant="secondary">
                  {isLast ? "Save reflection" : "Next →"}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}

      {view === "new" && saved && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 space-y-5"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-[var(--moonlit-cyan)]/10 border border-[var(--moonlit-cyan)]/20 flex items-center justify-center shadow-[0_0_30px_rgba(121,175,194,0.15)]">
            <CheckCircle className="w-8 h-8 text-[var(--moonlit-cyan)]" />
          </div>
          <h2 className="text-2xl font-display font-medium text-white">Reflection saved.</h2>
          <p className="text-white/60 font-light max-w-xs mx-auto leading-relaxed text-sm">
            Taking time to reflect is a powerful act of self-care. It gets easier with practice. 🌿
          </p>
          <Button variant="secondary" onClick={resetNew} className="bg-white/5 text-white hover:bg-white/10 border border-white/10">View all reflections</Button>
        </motion.div>
      )}
    </motion.div>
  );
}
