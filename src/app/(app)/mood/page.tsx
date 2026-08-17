"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/shared";
import { CheckCircle2, Loader2, PlayCircle, StopCircle, Globe2, Sparkles, TrendingUp, TrendingDown, CheckSquare, ListTodo, Activity } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDailyInsights, DailyInsightData } from "@/actions/dailyInsights";
import { recordMood } from "@/actions/mood";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GuestPrompt } from "@/components/auth/guest-prompt";

const emojis = [
  { val: 1, char: "😌", eng: "You're feeling very calm. Great state for deep work!", hi: "आप बहुत शांत महसूस कर रहे हैं। पढ़ाई के लिए यह बहुत अच्छा समय है!" },
  { val: 2, char: "🙂", eng: "You're doing well. Keep up the steady pace.", hi: "आप अच्छा कर रहे हैं। अपनी गति बनाए रखें।" },
  { val: 3, char: "😐", eng: "You're doing okay. Take things one step at a time.", hi: "चिंता मत करो, धीरे-धीरे आगे बढ़ो। तुम अच्छा कर रहे हो।" },
  { val: 4, char: "😟", eng: "It seems a bit tough today, but you are not alone.", hi: "आज थोड़ा मुश्किल लग रहा है, लेकिन तुम अकेले नहीं हो।" },
  { val: 5, char: "😣", eng: "Take a deep breath. It's okay to step away and rest.", hi: "गहरी सांस लें। थोड़ी देर आराम करना बिल्कुल ठीक है।" }
];

export default function DailyInsightsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [insights, setInsights] = useState<DailyInsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const useDemo = true;
  const [lang, setLang] = useState<"english" | "hindi">("english");
  const [savingEmoji, setSavingEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchData(currentUser.uid, useDemo);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [useDemo]);

  const fetchData = async (uid: string, demo: boolean) => {
    setLoading(true);
    const res = await getDailyInsights(uid, demo);
    if (res.success && res.data) {
      setInsights(res.data);
    }
    setLoading(false);
  };

  const handleEmojiClick = async (val: number) => {
    setSelectedEmoji(val);
    if (user && !useDemo) {
      setSavingEmoji(true);
      const levelMap: Record<number, any> = { 1: "VERY_LOW", 2: "LOW", 3: "MODERATE", 4: "HIGH", 5: "VERY_HIGH" };
      await recordMood(user.uid, val, levelMap[val], "Emoji Check-in", "");
      await fetchData(user.uid, false);
      setSavingEmoji(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-5xl relative min-h-[60vh] pb-10"
    >
      <GuestPrompt feature="Daily Insights" description="Create an account to track your daily wellness." />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Daily Insights" 
          description="Your personal wellness and study summary."
        />
        <div className="flex items-center gap-3 shrink-0">
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" /></div>
      ) : insights ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Emoji Check-in & Summary */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Emoji Check-in */}
            <Card className="border-[var(--primary-soft)] overflow-hidden">
              <div className="bg-[var(--surface-secondary)] px-4 py-3 border-b border-[var(--border-subtle)] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="font-semibold text-sm">How are you feeling right now?</h3>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between">
                  {emojis.map((e) => (
                    <button
                      key={e.val}
                      onClick={() => handleEmojiClick(e.val)}
                      disabled={savingEmoji}
                      className={`text-3xl sm:text-4xl hover:scale-110 transition-transform duration-200 ${selectedEmoji === e.val ? 'scale-125 drop-shadow-md' : 'opacity-70 hover:opacity-100'}`}
                    >
                      {e.char}
                    </button>
                  ))}
                </div>
                
                <AnimatePresence mode="wait">
                  {selectedEmoji && (
                    <motion.div
                      key={selectedEmoji}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-[var(--primary-soft)] text-[var(--primary-hover)] p-3 rounded-lg text-sm text-center leading-relaxed"
                    >
                      {lang === "english" ? emojis.find(e => e.val === selectedEmoji)?.eng : emojis.find(e => e.val === selectedEmoji)?.hi}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Today's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] font-medium">Completed</p>
                      <p className="text-lg font-bold">{insights.summary.tasksCompleted} Tasks</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <ListTodo className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] font-medium">Remaining</p>
                      <p className="text-lg font-bold">{insights.summary.tasksRemaining} Tasks</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${insights.summary.stressIndicator >= 4 ? 'bg-red-100' : 'bg-green-100'}`}>
                      <Activity className={`w-4 h-4 ${insights.summary.stressIndicator >= 4 ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)] font-medium">Stress Indicator</p>
                      <p className="text-lg font-bold">{insights.summary.stressIndicator >= 4 ? "High" : insights.summary.stressIndicator === 3 ? "Moderate" : "Low"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Charts & Report */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Weekly Bar Graph */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weekly Activity & Stress</CardTitle>
                <CardDescription>Your reported stress versus tasks completed over the last 7 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                      <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--primary)' }} domain={[0, 5]} ticks={[1,3,5]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}
                        cursor={{ fill: 'var(--surface-secondary)' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Bar yAxisId="left" name="Tasks Completed" dataKey="tasksCompleted" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar yAxisId="right" name="Stress Level (1-5)" dataKey="stressLevel" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Stress Report generated text */}
            <Card className="border-[var(--border-subtle)] bg-[var(--surface)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  Generated Stress Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {insights.detailedInsights ? (
                  <div className="space-y-4">
                    <div className="bg-[var(--background-secondary)] p-3 rounded-lg border border-[var(--border-subtle)]">
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">Today's Summary</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{insights.detailedInsights.today}</p>
                    </div>
                    <div className="bg-[var(--background-secondary)] p-3 rounded-lg border border-[var(--border-subtle)]">
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">Wellness Insight</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{insights.detailedInsights.wellness}</p>
                    </div>
                    <div className="bg-[var(--background-secondary)] p-3 rounded-lg border border-[var(--border-subtle)]">
                      <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1">Study Insight</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{insights.detailedInsights.study}</p>
                    </div>
                    <div className="bg-[var(--primary-soft)] p-3 rounded-lg border border-[var(--primary)]/30">
                      <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">Suggested Action</p>
                      <p className="text-sm font-medium text-[var(--primary-hover)]">{insights.detailedInsights.action}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Current Indicator</p>
                        <p className="font-semibold text-[var(--text-primary)]">{insights.stressReport.currentIndicator}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Weekly Trend</p>
                        <p className="font-semibold flex items-center gap-1">
                          {insights.stressReport.weeklyTrend}
                          {insights.stressReport.weeklyTrend === "Improving" && <TrendingDown className="w-3.5 h-3.5 text-green-500" />}
                          {insights.stressReport.weeklyTrend === "Increasing" && <TrendingUp className="w-3.5 h-3.5 text-amber-500" />}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Highest Stress Day</p>
                        <p className="font-semibold text-amber-600">{insights.stressReport.highestDay}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">Lowest Stress Day</p>
                        <p className="font-semibold text-green-600">{insights.stressReport.lowestDay}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[var(--background-secondary)] border border-[var(--border-subtle)] p-4 rounded-lg">
                      <p className="text-sm font-semibold mb-1 text-[var(--text-primary)]">Mitra's Recommendation</p>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        "{insights.stressReport.recommendation}"
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      ) : (
        <div className="flex justify-center py-20"><p>Failed to load insights.</p></div>
      )}
    </motion.div>
  );
}
