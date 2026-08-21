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
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md p-6 relative overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.1)]">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-display font-medium text-white/90">High Pressure Window</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">UPCOMING</span>
              </div>
              <p className="text-sm text-white/70 mt-1 leading-relaxed font-light">
                Based on your schedule, there are multiple critical deadlines approaching. Specifically on: {highPressureDays.map((d: any) => d.dateStr).join(", ")}.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 mt-6 pt-5 border-t border-amber-500/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Contributing Factors</h4>
              <ul className="space-y-1.5">
                {highPressureDays[0]?.details.map((detail: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-white/80 font-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">Suggested Action</h4>
              <Button size="sm" asChild className="w-full bg-amber-500/80 hover:bg-amber-500 text-white border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] gap-2">
                <Link href="/mitra">Generate Preventive Plan</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--moonlit-cyan)]/10 border border-[var(--moonlit-cyan)]/20 backdrop-blur-md p-6 relative overflow-hidden shadow-[0_0_30px_rgba(121,175,194,0.1)]">
          <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-12 h-12 rounded-full bg-[var(--moonlit-cyan)]/20 border border-[var(--moonlit-cyan)]/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[var(--moonlit-cyan)]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-display font-medium text-white/90">All Clear</h2>
              <p className="text-sm text-white/70 mt-1 leading-relaxed font-light">
                Your upcoming week looks manageable. Keep up the good work and don't forget to take breaks!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7-Day Timeline */}
      {/* 7-Day Timeline */}
      <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
        <div className="pb-3 border-b border-white/10 p-5">
          <h3 className="text-lg font-display font-medium text-white/90">7-Day Horizon</h3>
          <p className="text-sm font-light text-white/60 mt-1">Your upcoming week at a glance.</p>
        </div>
        <div className="p-5">
          <div className="relative border-l-2 border-white/10 ml-3 space-y-6 pb-2">
            {timeline?.map((day: any, idx: number) => {
              const isNormal = day.status === "NORMAL";
              const isWarning = day.status === "WARNING";
              const isHigh = day.status === "HIGH";

              const dotColorClass = isHigh ? "bg-red-400" : isWarning ? "bg-amber-400" : "bg-[var(--moonlit-cyan)]";
              const dotBorderClass = isHigh ? "bg-red-500/20 border-red-500/30" : isWarning ? "bg-amber-500/20 border-amber-500/30" : "bg-[var(--moonlit-cyan)]/20 border-[var(--moonlit-cyan)]/30";
              const titleColorClass = isHigh ? "text-red-400" : isWarning ? "text-amber-400" : "text-white/90";
              const subtitleColorClass = isHigh ? "text-red-400/70" : isWarning ? "text-amber-400/70" : "text-white/60";
              const boxClass = isHigh ? "bg-red-500/10 border-red-500/20" : isWarning ? "bg-amber-500/10 border-amber-500/20" : "bg-white/5 border-white/10";
              const labelColorClass = isHigh ? "text-red-400" : isWarning ? "text-amber-400" : "text-white/50";

              return (
                <div key={idx} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border flex items-center justify-center ${dotBorderClass}`}>
                    <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${dotColorClass}`} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-xs font-medium uppercase tracking-wider ${labelColorClass}`}>{day.label}</p>
                      <p className="text-[10px] text-white/40 font-light">{day.dateStr}</p>
                    </div>
                    <div className={`border rounded-xl p-3 backdrop-blur-sm shadow-sm ${boxClass}`}>
                      <div className="flex items-center gap-2">
                        {isHigh && <ShieldAlert className="w-4 h-4 text-red-400" />}
                        <p className={`text-sm font-medium ${titleColorClass}`}>{day.level}</p>
                      </div>
                      <p className={`text-xs mt-1 font-light ${subtitleColorClass}`}>
                        {day.taskCount === 0 ? "No tasks scheduled." : `${day.taskCount} task(s) scheduled.`}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
