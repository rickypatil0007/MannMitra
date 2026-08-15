"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared";
import { AlertCircle, CalendarClock, ShieldAlert, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForecastPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-3xl"
    >
      <PageHeader 
        title="Stress Forecast" 
        description="Predicting pressure points before they become overwhelming."
      />

      {/* Primary Forecast Alert */}
      <div className="rounded-2xl bg-[#FFF6ED] border border-[#FFD9AE] p-6 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#D4875B]/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <div className="w-12 h-12 rounded-full bg-[#D4875B]/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-[#D4875B]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-display font-semibold text-[#7A4A1E]">High Pressure Window</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4875B] text-white">UPCOMING</span>
            </div>
            <p className="text-sm text-[#7A4A1E]/80 mt-1 leading-relaxed">
              Based on your previous patterns, the combination of your CS301 midterm and History Essay submission next week is likely to cause significant stress.
            </p>
          </div>
        </div>
        
        <div className="relative z-10 mt-6 pt-5 border-t border-[#FFD9AE]/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#7A4A1E] uppercase tracking-wider">Contributing Factors</h4>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-sm text-[#7A4A1E]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4875B] mt-1.5 shrink-0" />
                2 major deadlines within 48 hours
              </li>
              <li className="flex items-start gap-2 text-sm text-[#7A4A1E]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4875B] mt-1.5 shrink-0" />
                Historically high stress during CS exams
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-[#7A4A1E] uppercase tracking-wider">Suggested Action</h4>
            <Button size="sm" className="w-full bg-[#7A4A1E] hover:bg-[#5C3716] text-white gap-2">
              Generate Preventive Plan
            </Button>
          </div>
        </div>
      </div>

      {/* 7-Day Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">7-Day Horizon</CardTitle>
          <CardDescription>Your upcoming week at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-[#EEF3EF] ml-3 space-y-6 pb-2">
            {/* Day 1 - Normal */}
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#EEF3EF] border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4FA477]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#98A2B3] uppercase tracking-wider mb-1">Tomorrow</p>
                <div className="bg-[#F7FBF8] border border-[#E4EDE7] rounded-xl p-3">
                  <p className="text-sm font-semibold text-[#1F2937]">Normal Workload</p>
                  <p className="text-xs text-[#667085] mt-1">1 minor task scheduled.</p>
                </div>
              </div>
            </div>

            {/* Day 3 - Warning */}
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#FFF6ED] border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4875B]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#D4875B] uppercase tracking-wider mb-1">In 3 Days</p>
                <div className="bg-white border border-[#FFD9AE] rounded-xl p-3 shadow-sm">
                  <p className="text-sm font-semibold text-[#7A4A1E]">Pressure Building</p>
                  <p className="text-xs text-[#7A4A1E]/70 mt-1">History Essay Draft due.</p>
                </div>
              </div>
            </div>

            {/* Day 4 - High */}
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#FFF2F2] border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C94A4A]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#C94A4A] uppercase tracking-wider mb-1">In 4 Days</p>
                <div className="bg-[#FFF2F2] border border-[#FECACA] rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#C94A4A]" />
                    <p className="text-sm font-semibold text-[#9F2F2F]">Peak Stress Window</p>
                  </div>
                  <p className="text-xs text-[#9F2F2F]/70 mt-1">CS301 Midterm Exam.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </motion.div>
  );
}
