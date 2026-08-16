"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const options = [
  { emoji: "🌿", label: "Managing well" },
  { emoji: "🌊", label: "A bit overwhelmed", active: true },
  { emoji: "🌪️", label: "Very stressed" },
];

const goals = ["Organizing tasks", "Managing anxiety", "Venting safely", "Finding quiet spaces", "Building connections"];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[var(--background-secondary)] flex flex-col items-center justify-center p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        className="max-w-lg w-full space-y-10"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-2xl font-bold font-display mb-5 shadow-sm">M</div>
          <h1 className="text-4xl font-display font-semibold text-[var(--text-primary)] tracking-tight mb-3">Welcome to Mann Mitra</h1>
          <p className="text-[var(--text-secondary)] text-lg">Let's personalise your sanctuary. Just a couple of quick questions.</p>
        </motion.div>

        {/* Q1 */}
        <motion.div variants={fadeInUp} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 space-y-4 shadow-[0_8px_30px_rgba(50,75,68,0.04)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">How are you feeling about your workload right now?</h3>
          <div className="grid grid-cols-3 gap-3">
            {options.map(opt => (
              <button
                key={opt.label}
                className={`p-4 border-2 rounded-2xl text-center transition-all duration-200 ${
                  opt.active
                    ? "border-[var(--primary)] bg-[var(--surface-secondary)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary-soft)] hover:bg-[var(--background-secondary)]"
                }`}
              >
                <span className="text-2xl block mb-2">{opt.emoji}</span>
                <span className={`font-medium text-xs leading-tight ${opt.active ? "text-[var(--primary-hover)]" : "text-[var(--text-secondary)]"}`}>{opt.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Q2 */}
        <motion.div variants={fadeInUp} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 space-y-4 shadow-[0_8px_30px_rgba(50,75,68,0.04)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">What would you like help with? <span className="text-[var(--text-muted)] font-normal text-sm">(pick any)</span></h3>
          <div className="flex flex-wrap gap-2">
            {goals.map((g, i) => (
              <button
                key={g}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  i === 0 || i === 2
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary-soft)] hover:text-[var(--primary)]"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Q3 */}
        <motion.div variants={fadeInUp} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 space-y-4 shadow-[0_8px_30px_rgba(50,75,68,0.04)]">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">What are your hobbies? <span className="text-[var(--text-muted)] font-normal text-sm">(helps us personalise suggestions)</span></h3>
          <div className="flex flex-wrap gap-2">
            {["Reading", "Sports", "Music", "Gaming", "Art", "Coding", "Movies", "Photography", "Writing"].map((h, i) => (
              <button
                key={h}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                  i === 2 || i === 5
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary-soft)] hover:text-[var(--primary)]"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex justify-center">
          <Button size="lg" className="px-12 h-13 rounded-full text-base" asChild>
            <Link href="/dashboard">Enter your sanctuary →</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
