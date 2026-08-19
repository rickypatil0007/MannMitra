"use client";

import * as motion from "framer-motion/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-8"
    >
      {/* ─── Top Section: Greeting & Quick Mitra Access ─── */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight">
            {greeting}, Alex.
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            You have 2 pending tasks today. Your stress levels are stable.
          </p>
        </div>
        <Button className="gap-2 shrink-0 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] shadow-soft rounded-xl" asChild>
          <Link href="/mitra">
            <MessageSquareHeart className="w-4 h-4" />
            Talk to Mitra
          </Link>
        </Button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ─── Left Column (Main Focus & Tasks) ─── */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Today's Focus Priority */}
          <div className="rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] p-6 shadow-soft relative overflow-hidden">
            {/* Soft decorative glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--primary-soft)] rounded-full blur-3xl opacity-50" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-[var(--primary-soft)]" />
                  <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">Top Priority</p>
                </div>
                <h3 className="text-xl font-semibold text-[var(--primary-hover)] leading-snug">
                  Midterm Exam in CS301 — in 4 days
                </h3>
                <p className="text-sm text-[var(--primary-soft)] mt-1">
                  Mitra suggests blocking out 2 hours today for review.
                </p>
              </div>
              <Button variant="secondary" size="sm" className="shrink-0 bg-[var(--surface)] hover:bg-[var(--background-secondary)] text-[var(--primary)] border-[var(--border)]" asChild>
                <Link href="/planner">Plan Study Time <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
            </div>
          </div>

          {/* Planner & Tasks */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-semibold text-[var(--text-primary)]">Today&apos;s Checklist</h2>
              <Link href="/planner" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors flex items-center gap-1">
                Open Planner <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {tasks.map((t) => (
                <div 
                  key={t.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    t.done 
                    ? "bg-[var(--background-secondary)] border-transparent opacity-60" 
                    : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--primary-soft)] hover:shadow-soft cursor-pointer"
                  }`}
                >
                  <button className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${t.done ? "border-[var(--success)] bg-[var(--success)]" : "border-[var(--border)] hover:border-[var(--primary-soft)]"}`}>
                    {t.done && <CheckCircle2 className="w-4 h-4 text-[var(--primary-foreground)]" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${t.done ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                      {t.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-[var(--background-secondary)] px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <span className="text-xs font-medium text-[var(--text-muted)]">{t.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mitra Suggestions / Recommendations */}
          <section className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
            <h2 className="text-lg font-display font-semibold text-[var(--text-primary)]">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <Link key={rec.id} href={`/${rec.type}`} className="block group">
                  <div className="h-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary-soft)] hover:shadow-soft transition-all">
                    <div className="w-8 h-8 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <rec.icon className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">{rec.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>

        {/* ─── Right Column (Wellness, Check-in, Upcoming) ─── */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Check-in Card */}
          <Card className="border-[var(--border)] shadow-sm bg-[var(--surface)] overflow-hidden">
            <CardHeader className="pb-3 bg-[var(--background-secondary)] border-b border-[var(--border-subtle)]">
              <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
                <Activity className="w-4 h-4 text-[var(--primary)]" />
                Daily Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <p className="text-sm text-[var(--text-muted)]">
                You haven't logged your stress levels today. Taking 1 minute to reflect can improve your focus.
              </p>
              <Button className="w-full bg-[var(--surface-secondary)] hover:bg-[var(--primary-soft)] text-[var(--primary-hover)] font-medium" variant="secondary" asChild>
                <Link href="/mood">Log Stress Level</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Wellness Pulse */}
          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
                <TrendingDown className="w-4 h-4 text-[var(--primary-soft)]" />
                Stress Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--text-secondary)]">Current level</span>
                  <span className="text-[var(--success)] font-semibold">Low</span>
                </div>
                <div className="w-full bg-[var(--border-subtle)] h-2 rounded-full overflow-hidden">
                  <div className="bg-[var(--primary-soft)] w-1/4 h-full rounded-full" />
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Your stress levels have been steadily dropping since the weekend. Great job maintaining balance.
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-[var(--border)] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[var(--text-primary)]">
                <Calendar className="w-4 h-4 text-[var(--text-primary)]" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pl-3 border-l-2 border-[var(--primary)] relative">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[var(--primary)] ring-4 ring-[var(--surface)]" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">Midterm — CS301</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Thursday, 10:00 AM</p>
              </div>
              <div className="pl-3 border-l-2 border-[var(--border)] relative">
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[var(--border)] ring-4 ring-[var(--surface)]" />
                <p className="text-sm font-medium text-[var(--text-secondary)]">Therapy Appointment</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Friday, 2:00 PM</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </motion.div>
  );
}
