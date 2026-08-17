"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/shared";
import { TrendingDown, TrendingUp, CalendarDays, BrainCircuit, Activity, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getWellnessAnalytics } from "@/actions/analytics";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import { GuestPrompt } from "@/components/auth/guest-prompt";

export default function AnalyticsPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchAnalytics(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAnalytics = useCallback(async (uid: string) => {
    setLoading(true);
    const res = await getWellnessAnalytics(uid);
    if (res.success && res.weeklyData) {
      setWeeklyData(res.weeklyData);
    }
    setLoading(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-4xl relative min-h-[60vh]"
    >
      <GuestPrompt feature="Analytics" description="Create an account to track your wellness trends over time." />
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
        <Card className="bg-[var(--surface-secondary)] border-[var(--primary-soft)]">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--primary-soft)]">Average Stress</p>
                <p className="text-3xl font-display font-semibold text-[var(--primary-hover)] mt-1">
                  {loading ? "--" : (weeklyData.reduce((acc, curr) => acc + curr.stress, 0) / (weeklyData.filter(d => d.stress > 0).length || 1)).toFixed(1)} <span className="text-sm text-[var(--primary-soft)] font-medium">/ 5</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--surface)]/60 flex items-center justify-center">
                <Activity className="w-5 h-5 text-[var(--primary)]" />
              </div>
            </div>
            <p className="text-xs text-[var(--primary)] mt-4 flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> Tracked over 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Study Hours</p>
                <p className="text-3xl font-display font-semibold text-[var(--text-primary)] mt-1">
                  {loading ? "--" : weeklyData.reduce((acc, curr) => acc + curr.study, 0)} <span className="text-sm text-[var(--text-muted)] font-medium">hrs</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4 flex items-center gap-1">
              Based on scheduled tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--text-secondary)]">Mitra Interactions</p>
                <p className="text-3xl font-display font-semibold text-[var(--text-primary)] mt-1">12</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4">
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
          <div className="h-[300px] w-full pt-4">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis yAxisId="left" orientation="left" stroke="#2E7D5B" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    cursor={{ fill: 'rgba(46,125,91,0.05)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Bar yAxisId="left" name="Stress Level (1-5)" dataKey="stress" fill="#2E7D5B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar yAxisId="right" name="Study Hours" dataKey="study" fill="#CBD5E1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Insight */}
      <Card className="border-[var(--primary-soft)] shadow-[0_2px_12px_rgba(46,125,91,0.06)]">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center shrink-0">
            <BrainCircuit className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--primary-hover)]">Mitra's Observation</h4>
            <p className="text-sm text-[var(--text-primary)] mt-1 leading-relaxed">
              Based on your recent checks, your stress levels tend to rise on days with heavy task loads. Try to use the AI Planner to break tasks into smaller chunks and spread them evenly across the week.
            </p>
          </div>
        </CardContent>
      </Card>

    </motion.div>
  );
}
