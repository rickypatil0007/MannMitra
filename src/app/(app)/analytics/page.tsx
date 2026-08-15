"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared";
import { TrendingDown, TrendingUp, CalendarDays, BrainCircuit, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for charts
const weeklyData = [
  { day: "Mon", stress: 3, study: 4 },
  { day: "Tue", stress: 2, study: 3 },
  { day: "Wed", stress: 4, study: 6 },
  { day: "Thu", stress: 5, study: 8 },
  { day: "Fri", stress: 3, study: 2 },
  { day: "Sat", stress: 2, study: 1 },
  { day: "Sun", stress: 2, study: 3 },
];

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-4xl"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Wellness Analytics" 
          description="Understand your patterns to build long-term resilience."
        />
        <Button variant="secondary" asChild className="shrink-0 gap-2">
          <Link href="/forecast">
            <CalendarDays className="w-4 h-4" /> View Forecast
          </Link>
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#EFF8F1] border-[#DDF2E3]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#4FA477]">Average Stress</p>
                <p className="text-3xl font-display font-semibold text-[#1F5D43] mt-1">2.8 <span className="text-sm text-[#4FA477] font-medium">/ 5</span></p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#2E7D5B]" />
              </div>
            </div>
            <p className="text-xs text-[#2E7D5B] mt-4 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> -0.4 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#667085]">Study Hours</p>
                <p className="text-3xl font-display font-semibold text-[#1F2937] mt-1">27 <span className="text-sm text-[#98A2B3] font-medium">hrs</span></p>
              </div>
            </div>
            <p className="text-xs text-[#C94A4A] mt-4 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +5 hrs from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[#667085]">Mitra Interactions</p>
                <p className="text-3xl font-display font-semibold text-[#1F2937] mt-1">12</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#F7FBF8] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-[#98A2B3]" />
              </div>
            </div>
            <p className="text-xs text-[#98A2B3] mt-4">
              Mostly asked about: Planning
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Stress vs Workload</CardTitle>
          <CardDescription>Notice how your stress levels correspond with heavy study days.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full flex items-end justify-between gap-2 pt-6">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex justify-center gap-1 h-[200px] items-end relative">
                  {/* Study Bar */}
                  <div 
                    className="w-1/3 bg-[#E4EDE7] rounded-t-sm transition-all group-hover:opacity-80" 
                    style={{ height: `${(d.study / 10) * 100}%` }}
                    title={`Study: ${d.study} hrs`}
                  />
                  {/* Stress Bar */}
                  <div 
                    className={`w-1/3 rounded-t-sm transition-all group-hover:opacity-80 ${
                      d.stress >= 4 ? 'bg-[#D4875B]' : 'bg-[#2E7D5B]'
                    }`}
                    style={{ height: `${(d.stress / 5) * 100}%` }}
                    title={`Stress: ${d.stress}/5`}
                  />
                </div>
                <span className="text-xs font-medium text-[#667085]">{d.day}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[#EEF3EF]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#E4EDE7]" />
              <span className="text-xs text-[#667085]">Study Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#2E7D5B]" />
              <span className="text-xs text-[#667085]">Stress Level</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insight */}
      <Card className="border-[#DDF2E3] shadow-[0_2px_12px_rgba(46,125,91,0.06)]">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#EFF8F1] flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5 text-[#2E7D5B]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#1F5D43]">Mitra's Observation</h4>
            <p className="text-sm text-[#1F2937] mt-1 leading-relaxed">
              Your stress levels consistently spike on Thursdays, aligning with your longest study days. Consider moving some of your Thursday workload to Tuesday, which is currently your lightest day.
            </p>
          </div>
        </CardContent>
      </Card>

    </motion.div>
  );
}
