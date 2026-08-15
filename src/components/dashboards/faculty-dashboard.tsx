"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, Badge } from "@/components/ui/shared";
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
        <PageHeader 
          title="Faculty Insights" 
          description="Aggregated, privacy-preserving trends to help you support your students."
        />
        <div className="flex items-center gap-2 bg-[var(--background-soft)] border border-[var(--border)] px-3 py-1.5 rounded-full text-xs font-medium text-[var(--green-primary)]">
          <Building2 className="w-3.5 h-3.5" /> Department of Computer Science
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-[#FFF2F2] border-[#FECACA]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#9F2F2F]">Average Stress Level</p>
                <p className="text-3xl font-display font-semibold text-[#C94A4A] mt-1">3.8 <span className="text-sm text-[#9F2F2F] font-medium">/ 5</span></p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#C94A4A]" />
              </div>
            </div>
            <p className="text-xs text-[#C94A4A] mt-4 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +1.2 from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-[var(--border)] shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Active Students</p>
                <p className="text-3xl font-display font-semibold text-[var(--text-primary)] mt-1">428</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--background-soft)] flex items-center justify-center">
                <Users className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4">76% of enrolled cohort</p>
          </CardContent>
        </Card>
        
        <Card className="border-[var(--border)] shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Support Requests</p>
                <p className="text-3xl font-display font-semibold text-[var(--text-primary)] mt-1">12</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--background-soft)] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4">Pending counsellor assignment</p>
          </CardContent>
        </Card>
        
        <Card className="border-[var(--border)] shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Avg Study Hours</p>
                <p className="text-3xl font-display font-semibold text-[var(--text-primary)] mt-1">34 <span className="text-sm font-medium text-[var(--text-muted)]">hrs/wk</span></p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--background-soft)] flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4">Unusually high for this period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Insights Panel */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-[var(--border)] shadow-soft">
            <CardHeader className="pb-3 border-b border-[var(--border-soft)]">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#D4875B]" /> Primary Stress Drivers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border-soft)]">
                {[
                  { title: "CS301 Midterm Examination", value: 68, trend: "Rising rapidly" },
                  { title: "Software Engineering Project Milestone", value: 45, trend: "Stable" },
                  { title: "Placement Interviews Preparation", value: 32, trend: "Rising" }
                ].map((item, i) => (
                  <div key={i} className="p-5 flex items-center justify-between hover:bg-[var(--background-soft)] transition-colors">
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">{item.title}</h4>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">Cited in {item.value}% of high-stress reports</p>
                    </div>
                    <Badge variant={i === 0 ? "warning" : "muted"}>{item.trend}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-[var(--background-green)] border border-[var(--green-light)] rounded-2xl p-6">
            <h4 className="text-[var(--green-dark)] font-semibold flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5" /> Recommended Institutional Action
            </h4>
            <p className="text-[var(--green-primary)] text-sm leading-relaxed">
              Based on aggregated student data, the overlapping deadlines for CS301 and the SE Project are causing severe pressure spikes across the third-year cohort. Consider extending the SE Project milestone by 48 hours to alleviate the bottleneck.
            </p>
          </div>
        </div>

        {/* Privacy Guardrails */}
        <div className="space-y-4">
          <Card className="bg-[var(--text-primary)] text-white border-transparent">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold font-display mb-2">Privacy Preserved</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-medium)] mt-1.5 shrink-0" />
                  All data is fully anonymized.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-medium)] mt-1.5 shrink-0" />
                  No individual student chats, diaries, or records are accessible.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-medium)] mt-1.5 shrink-0" />
                  Threshold limits prevent tracking small groups.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

      </div>
    </motion.div>
  );
}
