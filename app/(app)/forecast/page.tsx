"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";
import { PageHeader } from "@/frontend/components/ui/shared";
import { AlertCircle, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getStressForecast } from "@/backend/actions/analytics";
import Link from "next/link";

export default function ForecastPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchForecast(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchForecast = async (uid: string) => {
    setLoading(true);
    const res = await getStressForecast(uid);
    if (res.success) {
      setForecast(res);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-[var(--text-muted)]" />
        <h2 className="text-xl font-display font-semibold">Sign in to see your forecast</h2>
        <p className="text-[var(--text-secondary)]">Create an account to get personalized stress forecasting based on your schedule.</p>
      </div>
    );
  }

  const { timeline, highPressureDetected, highPressureDays } = forecast || {};

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
      {highPressureDetected ? (
        <div className="rounded-2xl bg-[#FFF6ED] border border-[#FFD9AE] p-6 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[var(--accent-warm)]/10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-warm)]/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-[var(--accent-warm)]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-display font-semibold text-[#7A4A1E]">High Pressure Window</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-warm)] text-[var(--primary-foreground)]">UPCOMING</span>
              </div>
              <p className="text-sm text-[#7A4A1E]/80 mt-1 leading-relaxed">
                Based on your schedule, there are multiple critical deadlines approaching. Specifically on: {highPressureDays.map((d: any) => d.dateStr).join(", ")}.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 mt-6 pt-5 border-t border-[#FFD9AE]/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#7A4A1E] uppercase tracking-wider">Contributing Factors</h4>
              <ul className="space-y-1.5">
                {highPressureDays[0]?.details.map((detail: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#7A4A1E]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-warm)] mt-1.5 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-[#7A4A1E] uppercase tracking-wider">Suggested Action</h4>
              <Button size="sm" asChild className="w-full bg-[#7A4A1E] hover:bg-[#5C3716] text-[var(--primary-foreground)] gap-2">
                <Link href="/mitra">Generate Preventive Plan</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--surface-community)] border border-[var(--primary-soft)] p-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-12 h-12 rounded-full bg-[var(--primary-soft)] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-display font-semibold text-[var(--text-primary)]">All Clear</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
                Your upcoming week looks manageable. Keep up the good work and don't forget to take breaks!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">7-Day Horizon</CardTitle>
          <CardDescription>Your upcoming week at a glance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative border-l-2 border-[var(--border-subtle)] ml-3 space-y-6 pb-2">
            {timeline?.map((day: any, idx: number) => {
              const isNormal = day.status === "NORMAL";
              const isWarning = day.status === "WARNING";
              const isHigh = day.status === "HIGH";

              const dotColorClass = isHigh ? "bg-[var(--danger)]" : isWarning ? "bg-[var(--accent-warm)]" : "bg-[var(--primary-soft)]";
              const dotBorderClass = isHigh ? "bg-[var(--danger-soft)]" : isWarning ? "bg-[#FFF6ED]" : "bg-[var(--border-subtle)]";
              const titleColorClass = isHigh ? "text-[var(--danger)]" : isWarning ? "text-[#7A4A1E]" : "text-[var(--text-primary)]";
              const subtitleColorClass = isHigh ? "text-[var(--danger)]/70" : isWarning ? "text-[#7A4A1E]/70" : "text-[var(--text-secondary)]";
              const boxClass = isHigh ? "bg-[var(--danger-soft)] border-[#FECACA]" : isWarning ? "bg-[var(--surface)] border-[#FFD9AE]" : "bg-[var(--background-secondary)] border-[var(--border)]";
              const labelColorClass = isHigh ? "text-[var(--danger)]" : isWarning ? "text-[var(--accent-warm)]" : "text-[var(--text-muted)]";

              return (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${dotBorderClass}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${dotColorClass}`} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${labelColorClass}`}>{day.label}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">{day.dateStr}</p>
                    </div>
                    <div className={`border rounded-xl p-3 shadow-sm ${boxClass}`}>
                      <div className="flex items-center gap-2">
                        {isHigh && <ShieldAlert className="w-4 h-4 text-[var(--danger)]" />}
                        <p className={`text-sm font-semibold ${titleColorClass}`}>{day.level}</p>
                      </div>
                      <p className={`text-xs mt-1 ${subtitleColorClass}`}>
                        {day.taskCount === 0 ? "No tasks scheduled." : `${day.taskCount} task(s) scheduled.`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
