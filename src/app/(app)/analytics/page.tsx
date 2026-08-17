"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared";
import { TrendingDown, TrendingUp, CalendarDays, BrainCircuit, Activity, Loader2, CheckCircle2, Target, AlertTriangle, PlayCircle, StopCircle, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getDashboardData, DashboardData } from "@/actions/analytics";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';

import { GuestPrompt } from "@/components/auth/guest-prompt";

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


  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-5xl relative min-h-[60vh] pb-10"
    >
      <GuestPrompt feature="Analytics" description="Create an account to track your wellness trends over time." />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Wellness & Study Dashboard" 
          description="Understand your patterns to build long-term resilience."
        />
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="secondary" asChild className="gap-2">
            <Link href="/forecast">
              <CalendarDays className="w-4 h-4" /> View Forecast
            </Link>
          </Button>
        </div>
      </div>

      {!loading && dashboardData ? (
        <div className="space-y-6">
          
          {/* Top Row: Stress & Study Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Stress Trend Card */}
            <Card className="border-[var(--primary-soft)] bg-gradient-to-br from-[var(--surface)] to-[var(--background-secondary)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Stress Indicator</span>
                  <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 mb-4">
                  <span className={`text-4xl font-display font-bold ${
                    dashboardData.stressTrend.currentEstimate === 'Low' ? 'text-green-500' :
                    dashboardData.stressTrend.currentEstimate === 'Moderate' ? 'text-amber-500' :
                    'text-red-500'
                  }`}>
                    {dashboardData.stressTrend.currentEstimate}
                  </span>
                  <span className="flex items-center text-sm font-medium text-[var(--text-secondary)] mb-1">
                    {dashboardData.stressTrend.trendDirection === "Increasing" ? (
                      <TrendingUp className="w-4 h-4 mr-1 text-amber-500" />
                    ) : dashboardData.stressTrend.trendDirection === "Decreasing" ? (
                      <TrendingDown className="w-4 h-4 mr-1 text-green-500" />
                    ) : null}
                    {dashboardData.stressTrend.recentChange}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--surface-secondary)] p-3 rounded-lg border border-[var(--border-subtle)]">
                  {dashboardData.stressTrend.interpretation}
                </p>
              </CardContent>
            </Card>

            {/* Study Progress Card */}
            <Card className="border-[var(--border-subtle)] bg-[var(--surface)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Study Progress</span>
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Completion Rate</p>
                    <p className="text-3xl font-display font-bold text-[var(--text-primary)]">{dashboardData.studyProgress.completionRate}%</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{dashboardData.studyProgress.tasksCompleted} of {dashboardData.studyProgress.tasksPlanned} tasks</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-secondary)] mb-1">Study Streak</p>
                    <p className="text-3xl font-display font-bold text-[var(--text-primary)]">{dashboardData.studyProgress.studyStreak} <span className="text-sm text-[var(--text-muted)] font-medium">days</span></p>
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      {dashboardData.studyProgress.missedTasks > 0 && <><AlertTriangle className="w-3 h-3" /> {dashboardData.studyProgress.missedTasks} missed</>}
                    </p>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 w-full bg-[var(--border-subtle)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${dashboardData.studyProgress.completionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Combined Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Workload vs Stress Over Time</CardTitle>
              <CardDescription>Observe how your planned tasks and actual completion impact your stress indicator.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={dashboardData.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="var(--text-muted)" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--primary)" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 4]} ticks={[1, 2, 3]} tickFormatter={(val) => val===1?'Low':val===2?'Mod':val===3?'High':''} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                      cursor={{ fill: 'var(--surface-secondary)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    <Bar yAxisId="left" name="Tasks Planned" dataKey="tasksPlanned" fill="var(--border-subtle)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="left" name="Tasks Completed" dataKey="tasksCompleted" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Line yAxisId="right" type="monotone" name="Stress Indicator" dataKey="stressIndicator" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights & Recommendations */}
          <Card className="border-t-4 border-t-[var(--accent-ai)] overflow-hidden shadow-md">
            <div className="bg-[var(--surface-ai)] p-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[var(--accent-ai)]" />
                <h4 className="font-semibold text-[var(--text-primary)]">Mitra AI Recommendation</h4>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-[1.05rem] text-[var(--text-primary)] leading-relaxed">
                {lang === "english" ? dashboardData.aiRecommendations.english : dashboardData.aiRecommendations.hindi}
              </p>
              
              {dashboardData.studyProgress.upcomingDeadlines > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-secondary)] bg-[var(--background-secondary)] w-fit px-3 py-1.5 rounded-full">
                  <CalendarDays className="w-4 h-4 text-[var(--primary)]" />
                  <span>You have <strong>{dashboardData.studyProgress.upcomingDeadlines}</strong> upcoming deadlines in the next 3 days.</span>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          <p className="text-[var(--text-muted)] animate-pulse">Analyzing wellness patterns...</p>
        </div>
      )}
    </motion.div>
  );
}
