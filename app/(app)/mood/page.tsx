"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { PageHeader } from "@/frontend/components/ui/shared";
import { CheckCircle2, Loader2, PlayCircle, StopCircle, Globe2, Sparkles, TrendingUp, TrendingDown, CheckSquare, ListTodo, Activity } from "lucide-react";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getDailyInsights, DailyInsightData } from "@/backend/actions/dailyInsights";
import { recordMood } from "@/backend/actions/mood";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GuestPrompt } from "@/frontend/components/auth/guest-prompt";
import { RiskGraph } from "@/frontend/components/analytics/RiskGraph";

const emojis = [
  { val: 1, char: "😌", eng: "You're feeling very calm. Great state for deep work!", hi: "आप बहुत शांत महसूस कर रहे हैं। पढ़ाई के लिए यह बहुत अच्छा समय है!" },
  { val: 2, char: "🙂", eng: "You're doing well. Keep up the steady pace.", hi: "आप अच्छा कर रहे हैं। अपनी गति बनाए रखें।" },
  { val: 3, char: "😐", eng: "You're doing okay. Take things one step at a time.", hi: "चिंता मत करो, धीरे-धीरे आगे बढ़ो। तुम अच्छा कर रहे हो।" },
  { val: 4, char: "😟", eng: "It seems a bit tough today, but you are not alone.", hi: "आज थोड़ा मुश्किल लग रहा है, लेकिन तुम अकेले नहीं हो।" },
  { val: 5, char: "😣", eng: "Take a deep breath. It's okay to step away and rest.", hi: "गहरी सांस लें। थोड़ी देर आराम करना बिल्कुल ठीक है。" }
];

export default function DailyInsightsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [insights, setInsights] = useState<DailyInsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const useDemo = false;
  const [lang, setLang] = useState<"english" | "hindi">("english");
  const [savingEmoji, setSavingEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [riskRefreshTrigger, setRiskRefreshTrigger] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchData(currentUser.uid, useDemo);
        interval = setInterval(() => {
          fetchData(currentUser.uid, useDemo);
        }, 5000);
      } else {
        setLoading(false);
      }
    });
    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
    };
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
      
      // We give the backend a small delay to finish running the computeRisk async task 
      // before refreshing the frontend graph.
      setTimeout(async () => {
        await fetchData(user.uid, false);
        setRiskRefreshTrigger(prev => prev + 1);
        setSavingEmoji(false);
      }, 1000);
    } else {
      setTimeout(() => setSavingEmoji(false), 500);
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
            <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--moonlit-cyan)]" />
                <h3 className="font-medium text-white/90 text-sm">How are you feeling right now?</h3>
              </div>
              <div className="p-4 space-y-4">
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
                      className="bg-[var(--moonlit-cyan)]/10 text-[var(--moonlit-cyan)] p-3 rounded-lg text-sm text-center leading-relaxed border border-[var(--moonlit-cyan)]/20"
                    >
                      {lang === "english" ? emojis.find(e => e.val === selectedEmoji)?.eng : emojis.find(e => e.val === selectedEmoji)?.hi}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Dynamic Risk Insights Graph */}
            <div className="mt-8 border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden p-5">
              <RiskGraph refreshTrigger={riskRefreshTrigger} />
            </div>

            {/* Daily Summary */}
            <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="pb-3 border-b border-white/10 p-5">
                <h3 className="text-lg font-display font-medium text-white/90">Today's Summary</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                      <CheckSquare className="w-4 h-4 text-blue-300" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-light">Completed</p>
                      <p className="text-lg font-medium text-white/90">{insights.summary.tasksCompleted} Tasks</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                      <ListTodo className="w-4 h-4 text-orange-300" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-light">Remaining</p>
                      <p className="text-lg font-medium text-white/90">{insights.summary.tasksRemaining} Tasks</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${insights.summary.stressIndicator >= 4 ? 'bg-red-500/20 border-red-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
                      <Activity className={`w-4 h-4 ${insights.summary.stressIndicator >= 4 ? 'text-red-300' : 'text-emerald-300'}`} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 font-light">Stress Indicator</p>
                      <p className="text-lg font-medium text-white/90">{insights.summary.stressIndicator >= 4 ? "High" : insights.summary.stressIndicator === 3 ? "Moderate" : "Low"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Charts & Report */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Weekly Bar Graph */}
            <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="pb-3 border-b border-white/10 p-5">
                <h3 className="text-lg font-display font-medium text-white/90">Weekly Activity & Stress</h3>
                <p className="text-sm font-light text-white/60 mt-1">Your reported stress versus tasks completed over the last 7 days.</p>
              </div>
              <div className="p-5">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insights.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }} />
                      <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--moonlit-cyan)' }} domain={[0, 5]} ticks={[1,3,5]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(10,25,50,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: '#fff' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', opacity: 0.8 }} />
                      <Bar yAxisId="left" name="Tasks Completed" dataKey="tasksCompleted" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar yAxisId="right" name="Stress Level (1-5)" dataKey="stressLevel" fill="var(--moonlit-cyan)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Stress Report generated text */}
            <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="pb-3 border-b border-white/10 p-5">
                <h3 className="text-lg font-display font-medium text-white/90 flex items-center gap-2">
                  Generated Stress Report
                </h3>
              </div>
              <div className="p-5">
                {insights.detailedInsights ? (
                  <div className="space-y-4">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-1">Today's Summary</p>
                      <p className="text-sm font-light text-white/90">{insights.detailedInsights.today}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-1">Wellness Insight</p>
                      <p className="text-sm font-light text-white/90">{insights.detailedInsights.wellness}</p>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-1">Study Insight</p>
                      <p className="text-sm font-light text-white/90">{insights.detailedInsights.study}</p>
                    </div>
                    <div className="bg-[var(--moonlit-cyan)]/10 p-3 rounded-lg border border-[var(--moonlit-cyan)]/30">
                      <p className="text-xs font-medium text-[var(--moonlit-cyan)] uppercase tracking-wide mb-1">Suggested Action</p>
                      <p className="text-sm font-light text-[var(--moonlit-cyan)] opacity-90">{insights.detailedInsights.action}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-white/50">Current Indicator</p>
                        <p className="font-medium text-white/90">{insights.stressReport.currentIndicator}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-white/50">Weekly Trend</p>
                        <p className="font-medium flex items-center gap-1 text-white/90">
                          {insights.stressReport.weeklyTrend}
                          {insights.stressReport.weeklyTrend === "Improving" && <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
                          {insights.stressReport.weeklyTrend === "Increasing" && <TrendingUp className="w-3.5 h-3.5 text-amber-400" />}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-white/50">Highest Stress Day</p>
                        <p className="font-medium text-amber-400">{insights.stressReport.highestDay}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-white/50">Lowest Stress Day</p>
                        <p className="font-medium text-emerald-400">{insights.stressReport.lowestDay}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-1 text-white/90">Mitra's Recommendation</p>
                      <p className="text-sm text-white/70 font-light leading-relaxed">
                        "{insights.stressReport.recommendation}"
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex justify-center py-20"><p>Failed to load insights.</p></div>
      )}
    </motion.div>
  );
}
