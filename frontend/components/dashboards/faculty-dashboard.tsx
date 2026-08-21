"use client";

import { motion } from "framer-motion";
import { Activity, ShieldAlert, GraduationCap, Users, BookOpen, AlertCircle, TrendingUp, Building2 } from "lucide-react";

export function FacultyDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-5xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight">Faculty Insights</h1>
          <p className="text-white/60 font-light mt-1">Aggregated, privacy-preserving trends to help you support your students.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-medium text-[var(--moonlit-cyan)] backdrop-blur-md">
          <Building2 className="w-3.5 h-3.5" /> Department of Computer Science
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)] bg-red-500/5 backdrop-blur-md rounded-2xl overflow-hidden p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-red-200/80">Average Stress Level</p>
              <p className="text-3xl font-display font-medium text-red-100 mt-1">3.8 <span className="text-sm text-red-300 font-medium">/ 5</span></p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-400" />
            </div>
          </div>
          <p className="text-xs text-red-400 mt-4 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" /> +1.2 from last week
          </p>
        </div>

        <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Active Students</p>
              <p className="text-3xl font-display font-medium text-white mt-1">428</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-white/60" />
            </div>
          </div>
          <p className="text-xs text-white/50 font-light mt-4">76% of enrolled students</p>
        </div>
        
        <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Support Requests</p>
              <p className="text-3xl font-display font-medium text-white mt-1">12</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[var(--moonlit-cyan)]/10 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-[var(--moonlit-cyan)]" />
            </div>
          </div>
          <p className="text-xs text-[var(--moonlit-cyan)]/80 mt-4">Pending counsellor assignment</p>
        </div>
        
        <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">Avg Study Hours</p>
              <p className="text-3xl font-display font-medium text-white mt-1">34 <span className="text-sm font-light text-white/50">hrs/wk</span></p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white/60" />
            </div>
          </div>
          <p className="text-xs text-amber-300 mt-4 font-medium">Unusually high for this period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Insights Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="pb-3 border-b border-white/10 p-5">
              <div className="text-lg font-medium flex items-center gap-2 text-white/90">
                <AlertCircle className="w-5 h-5 text-amber-400" /> Primary Stress Drivers
              </div>
            </div>
            <div className="p-0">
              <div className="divide-y divide-white/10">
                {[
                  { title: "CS301 Midterm Examination", value: 68, trend: "Rising rapidly" },
                  { title: "Software Engineering Project Milestone", value: 45, trend: "Stable" },
                  { title: "Placement Interviews Preparation", value: 32, trend: "Rising" }
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="font-medium text-white/90">{item.title}</h4>
                      <p className="text-sm text-white/50 font-light mt-1">Cited in {item.value}% of high-stress reports</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${i === 0 ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-white/10 text-white/70 border-white/20"}`}>{item.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[var(--moonlit-cyan)]/5 border border-[var(--moonlit-cyan)]/20 shadow-2xl backdrop-blur-md rounded-2xl p-6">
            <h4 className="text-[var(--moonlit-cyan)] font-medium flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5" /> Recommended Institutional Action
            </h4>
            <p className="text-white/80 text-sm leading-relaxed font-light">
              Based on aggregated student data, the overlapping deadlines for CS301 and the SE Project are causing severe pressure spikes across the third-year students. Consider extending the SE Project milestone by 48 hours to alleviate the bottleneck.
            </p>
          </div>
        </div>

        {/* Privacy Guardrails */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md rounded-2xl overflow-hidden p-6">
            <div className="w-12 h-12 rounded-full bg-[var(--sky-deep)]/20 border border-[var(--sky-deep)]/30 flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-medium font-display mb-3 text-white">Privacy Preserved</h3>
            <ul className="space-y-3 text-sm text-white/70 font-light">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--moonlit-cyan)] mt-1.5 shrink-0 shadow-[0_0_5px_var(--moonlit-cyan)]" />
                All data is fully anonymized.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--moonlit-cyan)] mt-1.5 shrink-0 shadow-[0_0_5px_var(--moonlit-cyan)]" />
                No individual student chats, diaries, or records are accessible.
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--moonlit-cyan)] mt-1.5 shrink-0 shadow-[0_0_5px_var(--moonlit-cyan)]" />
                Threshold limits prevent tracking small groups.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
