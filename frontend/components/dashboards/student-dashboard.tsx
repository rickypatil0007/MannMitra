"use client";

import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/frontend/lib/motion/tokens";
import { StaggerContainer } from "@/frontend/components/motion/StaggerContainer";
import { SlideUp } from "@/frontend/components/motion/SlideUp";
import { FadeIn } from "@/frontend/components/motion/FadeIn";
import { 
  MessageSquareHeart, CheckCircle2, Clock, Calendar, 
  TrendingDown, ArrowRight, Activity, BookOpen, Users, 
  HeartHandshake, Sparkles
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Mock Data
const tasks = [
  { id: "1", title: "Review CS301 Lecture Notes", time: "10:00 AM", done: false, priority: "High" },
  { id: "2", title: "Start History Essay Draft",   time: "2:00 PM",  done: false, priority: "Medium" },
  { id: "3", title: "Group Project Meeting",        time: "4:30 PM",  done: true,  priority: "Low" },
];

const recommendations = [
  { id: 1, type: "comfort", title: "5-Minute Breathing Exercise", icon: BookOpen },
  { id: 2, type: "community", title: "Join 'Exam Stress' Discussion", icon: Users },
  { id: 3, type: "support", title: "Speak to a Peer Listener", icon: HeartHandshake }
];

export function StudentDashboard() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Simulate a wellness state fetch
  const [wellnessState, setWellnessState] = useState<"good" | "stressed" | "overwhelmed">("good");

  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.ease.out }}
      className="space-y-8"
    >
      {/* ─── Top Section: Greeting & Quick Mitra Access ─── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight">
            {greeting}, Alex.
          </h1>
          <p className="text-white/60 mt-1 text-sm font-light">
            You have 2 pending tasks today. Your stress levels are stable.
          </p>
        </div>
        <Link 
          href="/mitra"
          className="inline-flex items-center gap-2 shrink-0 bg-white/10 hover:bg-white/20 text-white shadow-soft rounded-xl px-4 py-2.5 transition-colors border border-white/10 text-sm font-medium"
        >
          <MessageSquareHeart className="w-4 h-4" />
          Talk to Mitra
        </Link>
      </section>

      <StaggerContainer delayChildren={0.1} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ─── Left Column (Main Focus & Tasks) ─── */}
        <FadeIn className="lg:col-span-8 space-y-8">
          
          {/* Today's Focus Priority */}
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Soft decorative glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[var(--moonlit-cyan)] rounded-full blur-[80px] opacity-20 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[var(--moonlit-cyan)] opacity-80" />
                  <p className="text-xs font-semibold text-[var(--moonlit-cyan)] uppercase tracking-widest opacity-80">Top Priority</p>
                </div>
                <h3 className="text-xl font-display font-medium text-white leading-snug">
                  Midterm Exam in CS301 — in 4 days
                </h3>
                <p className="text-sm text-white/60 font-light mt-1.5">
                  Mitra suggests blocking out 2 hours today for review.
                </p>
              </div>
              <Link 
                href="/planner"
                className="inline-flex shrink-0 items-center bg-transparent hover:bg-white/10 text-[var(--moonlit-cyan)] border border-[var(--moonlit-cyan)]/30 rounded-full px-4 py-2 text-sm font-medium transition-colors"
              >
                Plan Study Time <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </div>
          </div>

          {/* Planner & Tasks */}
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-medium text-white/90">Today&apos;s Checklist</h2>
              <Link href="/planner" className="text-sm font-medium text-[var(--moonlit-cyan)] hover:text-white transition-colors flex items-center gap-1 opacity-80 hover:opacity-100">
                Open Planner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="space-y-2">
              {tasks.map((t) => (
                <div 
                  key={t.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    t.done 
                    ? "bg-transparent border-transparent opacity-40" 
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 cursor-pointer backdrop-blur-sm"
                  }`}
                >
                  <button className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${t.done ? "border-white bg-white" : "border-white/30 hover:border-white/60"}`}>
                    {t.done && <CheckCircle2 className="w-3 h-3 text-[var(--sky-deep)]" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${t.done ? "line-through font-light text-white/50" : "font-medium text-white/90"}`}>
                      {t.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-md bg-white/5 border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-white/50" />
                    <span className="text-xs font-light text-white/60">{t.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mitra Suggestions / Recommendations */}
          <section className="space-y-4 pt-8">
            <h2 className="text-lg font-display font-medium text-white/90">Recommended for You</h2>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <SlideUp key={rec.id}>
                  <Link href={`/${rec.type}`} className="block group h-full">
                    <div className="h-full p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <rec.icon className="w-4 h-4 text-white/80" />
                      </div>
                      <p className="text-sm font-medium text-white/90 leading-snug">{rec.title}</p>
                    </div>
                  </Link>
                </SlideUp>
              ))}
            </StaggerContainer>
          </section>

        </FadeIn>

        {/* ─── Right Column (Wellness, Check-in, Upcoming) ─── */}
        <FadeIn delay={0.2} className="lg:col-span-4 space-y-6">
          
          {/* Quick Check-in Panel */}
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--moonlit-cyan)] opacity-80" />
              <h3 className="text-sm font-medium text-white/90">Daily Check-in</h3>
            </div>
            <div className="p-5 space-y-5">
              <p className="text-sm text-white/60 font-light">
                You haven't logged your stress levels today. Taking 1 minute to reflect can improve your focus.
              </p>
              <Link 
                href="/mood"
                className="flex items-center justify-center w-full rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium py-2.5 transition-colors text-sm border border-white/5"
              >
                Log Stress Level
              </Link>
            </div>
          </div>

          {/* Wellness Pulse */}
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[var(--moonlit-cyan)] opacity-80" />
              <h3 className="text-sm font-medium text-white/90">Stress Trend</h3>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/60 font-light">Current level</span>
                  <span className="text-[var(--moonlit-cyan)] font-medium">Low</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[var(--moonlit-cyan)] opacity-80 w-1/4 h-full rounded-full shadow-[0_0_10px_var(--moonlit-cyan)]" />
                </div>
              </div>
              <p className="text-xs text-white/50 font-light leading-relaxed">
                Your stress levels have been steadily dropping since the weekend. Great job maintaining balance.
              </p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/70" />
              <h3 className="text-sm font-medium text-white/90">Upcoming</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="pl-4 border-l-[1.5px] border-[var(--moonlit-cyan)] relative">
                <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-[var(--moonlit-cyan)] ring-4 ring-transparent" />
                <p className="text-sm font-medium text-white/90">Midterm — CS301</p>
                <p className="text-xs text-white/50 font-light mt-1">Thursday, 10:00 AM</p>
              </div>
              <div className="pl-4 border-l-[1.5px] border-white/20 relative">
                <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-white/30 ring-4 ring-transparent" />
                <p className="text-sm font-medium text-white/70">Therapy Appointment</p>
                <p className="text-xs text-white/50 font-light mt-1">Friday, 2:00 PM</p>
              </div>
            </div>
          </div>

        </FadeIn>
      </StaggerContainer>
    </motion.div>
  );
}
