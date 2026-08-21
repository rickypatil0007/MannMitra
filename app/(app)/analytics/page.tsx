"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/frontend/lib/motion/tokens";
import { StaggerContainer } from "@/frontend/components/motion/StaggerContainer";
import { SlideUp } from "@/frontend/components/motion/SlideUp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";
import { PageHeader } from "@/frontend/components/ui/shared";
import { TrendingDown, TrendingUp, CalendarDays, BrainCircuit, Activity, Loader2, CheckCircle2, Target, AlertTriangle, PlayCircle, StopCircle, Globe2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import Link from "next/link";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getDashboardData, DashboardData } from "@/backend/actions/analytics";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';

import { GuestPrompt } from "@/frontend/components/auth/guest-prompt";

export default function AnalyticsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const useDemo = true;
  const [lang, setLang] = useState<"english" | "hindi">("english");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchAnalytics(currentUser.uid, useDemo);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [useDemo]);

  const fetchAnalytics = useCallback(async (uid: string, demo: boolean) => {
    setLoading(true);
    const res = await getDashboardData(uid, demo);
    if (res.success && res.data) {
      setDashboardData(res.data);
    }
    setLoading(false);
  }, []);


  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.ease.out }}
      className="space-y-6 max-w-5xl relative min-h-[60vh] pb-10"
    >
      <GuestPrompt feature="Analytics" description="Create an account to track your wellness trends over time." />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Wellness & Study Dashboard" 
          description="Understand your patterns to build long-term resilience."
        />
        <div className="flex items-center gap-3 shrink-0">
          <Button className="bg-white/5 text-white/90 border border-white/10 hover:bg-white/10 backdrop-blur-md" asChild>
            <Link href="/forecast">
              <CalendarDays className="w-4 h-4 mr-2 text-[var(--moonlit-cyan)]" /> View Forecast
            </Link>
          </Button>
        </div>
      </div>

      {!loading && dashboardData ? (
        <StaggerContainer delayChildren={0.1} className="space-y-6">
          
          {/* Top Row: Stress & Study Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stress Trend Card */}
            <SlideUp>
            <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden h-full">
              <div className="pb-2 border-b border-white/10 p-5">
                <h3 className="text-lg font-display font-medium text-white/90 flex items-center justify-between">
                  <span>Stress Indicator</span>
                  <div className="w-8 h-8 rounded-full bg-[var(--moonlit-cyan)]/10 flex items-center justify-center border border-[var(--moonlit-cyan)]/20">
                    <Activity className="w-4 h-4 text-[var(--moonlit-cyan)]" />
                  </div>
                </h3>
              </div>
              <div className="p-5">
                <div className="flex items-end gap-3 mb-4">
                  <span className={`text-h1 font-display font-medium ${
                    dashboardData.stressTrend.currentEstimate === 'Low' ? 'text-emerald-400' :
                    dashboardData.stressTrend.currentEstimate === 'Moderate' ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {dashboardData.stressTrend.currentEstimate}
                  </span>
                  <span className="flex items-center text-sm font-medium text-white/50 mb-1">
                    {dashboardData.stressTrend.trendDirection === "Increasing" ? (
                      <TrendingUp className="w-4 h-4 mr-1 text-amber-400" />
                    ) : dashboardData.stressTrend.trendDirection === "Decreasing" ? (
                      <TrendingDown className="w-4 h-4 mr-1 text-emerald-400" />
                    ) : null}
                    {dashboardData.stressTrend.recentChange}
                  </span>
                </div>
                <p className="text-sm text-white/90 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                  {dashboardData.stressTrend.interpretation}
                </p>
              </div>
            </div>
            </SlideUp>

            {/* Study Progress Card */}
            <SlideUp delay={0.1}>
            <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden h-full">
              <div className="pb-2 border-b border-white/10 p-5">
                <h3 className="text-lg font-display font-medium text-white/90 flex items-center justify-between">
                  <span>Study Progress</span>
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Target className="w-4 h-4 text-blue-300" />
                  </div>
                </h3>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-white/50 mb-1">Completion Rate</p>
                    <p className="text-h1 font-display font-medium text-white/90">{dashboardData.studyProgress.completionRate}%</p>
                    <p className="text-xs text-white/40 mt-1">{dashboardData.studyProgress.tasksCompleted} of {dashboardData.studyProgress.tasksPlanned} tasks</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/50 mb-1">Study Streak</p>
                    <p className="text-h1 font-display font-medium text-white/90">{dashboardData.studyProgress.studyStreak} <span className="text-sm text-white/50 font-medium">days</span></p>
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      {dashboardData.studyProgress.missedTasks > 0 && <><AlertTriangle className="w-3 h-3" /> {dashboardData.studyProgress.missedTasks} missed</>}
                    </p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500/80 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${dashboardData.studyProgress.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
            </SlideUp>

          </div>

          {/* Combined Chart */}
          <SlideUp delay={0.2}>
          <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="pb-3 border-b border-white/10 p-5">
              <h3 className="text-lg font-display font-medium text-white/90">Workload vs Stress Over Time</h3>
              <p className="text-sm font-light text-white/60 mt-1">Observe how your planned tasks and actual completion impact your stress indicator.</p>
            </div>
            <div className="p-5">
              <div className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dashboardData.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="rgba(255,255,255,0.4)" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--moonlit-cyan)" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 4]} ticks={[1, 2, 3]} tickFormatter={(val) => val===1?'Low':val===2?'Mod':val===3?'High':''} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10,25,50,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: '#fff' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px', opacity: 0.8 }} />
                    <Bar yAxisId="left" name="Tasks Planned" dataKey="tasksPlanned" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="left" name="Tasks Completed" dataKey="tasksCompleted" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Line yAxisId="right" type="monotone" name="Stress Indicator" dataKey="stressIndicator" stroke="var(--moonlit-cyan)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          </SlideUp>

          {/* AI Insights & Recommendations */}
          <SlideUp delay={0.3}>
          <div className="border border-[var(--moonlit-cyan)]/20 shadow-[0_0_30px_var(--moonlit-cyan)] shadow-[var(--moonlit-cyan)]/5 bg-[var(--moonlit-cyan)]/5 backdrop-blur-md rounded-2xl overflow-hidden">
            <div className="bg-[var(--moonlit-cyan)]/10 p-4 border-b border-[var(--moonlit-cyan)]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[var(--moonlit-cyan)]" />
                <h4 className="font-medium text-white/90">Mitra AI Recommendation</h4>
              </div>
            </div>
            <div className="p-6">
              <p className="text-base font-light text-white/80 leading-relaxed">
                {lang === "english" ? dashboardData.aiRecommendations.english : dashboardData.aiRecommendations.hindi}
              </p>
              
              {dashboardData.studyProgress.upcomingDeadlines > 0 && (
                <div className="mt-5 flex items-center gap-2 text-sm text-[var(--moonlit-cyan)] bg-[var(--moonlit-cyan)]/10 w-fit px-3 py-1.5 rounded-full border border-[var(--moonlit-cyan)]/20">
                  <CalendarDays className="w-4 h-4 text-[var(--moonlit-cyan)]" />
                  <span>You have <strong className="text-white/90 font-medium">{dashboardData.studyProgress.upcomingDeadlines}</strong> upcoming deadlines in the next 3 days.</span>
                </div>
              )}
            </div>
          </div>
          </SlideUp>

        </StaggerContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <p className="text-[var(--text-muted)] animate-pulse">Analyzing wellness patterns...</p>
        </div>
      )}
    </motion.div>
  );
}
