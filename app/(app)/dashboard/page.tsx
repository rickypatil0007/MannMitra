"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/frontend/components/ui/animated";
import { emojiTap } from "@/frontend/lib/motion-presets";
import { Button } from "@/frontend/components/ui/button";
import { Plus, Flame, Clock, Sparkles, Check, CheckCircle2, Circle, CheckSquare, MessageSquareHeart, Activity, Users, BookOpen, Headset, NotebookPen, LayoutDashboard, MapPin, Navigation, Globe2, PlayCircle, StopCircle } from "lucide-react";
import Link from "next/link";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserTasks, toggleTaskCompletion } from "@/backend/actions/task";
import { recordMood } from "@/backend/actions/mood";
import { getWellnessAnalytics } from "@/backend/actions/analytics";
import { StressLevel } from "@/generated/prisma/client";
import { getDailyInsights, DailyInsightData } from "@/backend/actions/dailyInsights";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MOODS = [
  { emoji: '😭', score: 1, stress: "VERY_HIGH" },
  { emoji: '😟', score: 2, stress: "HIGH" },
  { emoji: '😐', score: 3, stress: "MODERATE" },
  { emoji: '🙂', score: 4, stress: "LOW" },
  { emoji: '🤩', score: 5, stress: "LOW" }
] as const;

const AI_RESPONSES: Record<number, {en: string, hi: string}> = {
  1: { en: "Take a deep breath. It's okay to step away and rest.", hi: "गहरी सांस लें। थोड़ी देर आराम करना बिल्कुल ठीक है।" },
  2: { en: "It seems a bit tough today, but you are not alone.", hi: "आज थोड़ा मुश्किल लग रहा है, लेकिन तुम अकेले नहीं हो।" },
  3: { en: "You're doing okay. Take things one step at a time.", hi: "चिंता मत करो, धीरे-धीरे आगे बढ़ो। तुम अच्छा कर रहे हो।" },
  4: { en: "You're doing well. Keep up the steady pace.", hi: "आप अच्छा कर रहे हैं। अपनी गति बनाए रखें।" },
  5: { en: "You're feeling very calm. Great state for deep work!", hi: "आप बहुत शांत महसूस कर रहे हैं। पढ़ाई के लिए यह बहुत अच्छा समय है!" }
};

const QUICK_ACTIONS = [
  { name: "Plan My Day",    href: "/planner",   icon: CheckSquare, color: "bg-blue-50 text-blue-600" },
  { name: "Write in Diary", href: "/notes",     icon: NotebookPen, color: "bg-purple-50 text-purple-600" },
  { name: "Join Community", href: "/community", icon: Users,       color: "bg-green-50 text-green-600" },
  { name: "Relax",          href: "/comfort",   icon: BookOpen,    color: "bg-teal-50 text-teal-600" },
  { name: "Find a Space",   href: "/spaces",    icon: LayoutDashboard, color: "bg-indigo-50 text-indigo-600" },
  { name: "Get Support",    href: "/support",   icon: Headset,     color: "bg-rose-50 text-rose-600" },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [useDemo, setUseDemo] = useState(true); // Default to demo mode for judges
  const [insights, setInsights] = useState<DailyInsightData | null>(null);
  
  const [moodRecorded, setMoodRecorded] = useState(false);
  const [isRecordingMood, setIsRecordingMood] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [lang, setLang] = useState<"english" | "hindi">("english");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const [spaces, setSpaces] = useState<any[]>([]);
  const [spaceFilter, setSpaceFilter] = useState("All");

  const fetchData = async (uid: string) => {
    const { getQuietSpaces } = await import("@/backend/actions/spaces");
    const [tasksRes, analyticsRes, spacesRes, insightsRes] = await Promise.all([
      getUserTasks(uid),
      getWellnessAnalytics(uid),
      getQuietSpaces(),
      getDailyInsights(uid, useDemo)
    ]);
    
    if (tasksRes.success && tasksRes.tasks) setTasks(tasksRes.tasks);
    if (analyticsRes.success && analyticsRes.weeklyData) setWeeklyData(analyticsRes.weeklyData);
    if (spacesRes.success && spacesRes.spaces) setSpaces(spacesRes.spaces);
    if (insightsRes.success && insightsRes.data) setInsights(insightsRes.data as DailyInsightData);
    
    setLoading(false);
  };

  const handleMoodClick = async (score: number, stress: StressLevel) => {
    if (!user || isRecordingMood || moodRecorded) return;
    setIsRecordingMood(true);
    setSelectedScore(score);
    
    if (!useDemo) {
      await recordMood(user.uid, score, stress, "Recorded via quick dashboard emoji");
    }
    setMoodRecorded(true);
    setIsRecordingMood(false);
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !currentStatus } : t)));
    if (!id.startsWith("demo-") && user) {
      await toggleTaskCompletion(user.uid, id, !currentStatus);
    }
  };

  if (loading) return null;

  const DEMO_TASKS = [
    { id: "demo-1", title: "Complete Data Structures assignment", priority: "HIGH", deadline: new Date(new Date().setHours(17, 0, 0, 0)), isCompleted: false },
    { id: "demo-2", title: "Review Engineering Mathematics notes", priority: "MEDIUM", deadline: new Date(new Date().setHours(20, 0, 0, 0)), isCompleted: false },
    { id: "demo-3", title: "Practice 20 aptitude questions", priority: "MEDIUM", deadline: new Date(new Date().setHours(14, 0, 0, 0)), isCompleted: true },
    { id: "demo-4", title: "Submit SIH presentation draft", priority: "HIGH", deadline: new Date(new Date().setHours(18, 0, 0, 0)), isCompleted: false },
    { id: "demo-5", title: "Take a 15-minute break", priority: "LOW", deadline: new Date(new Date().setHours(16, 0, 0, 0)), isCompleted: true }
  ];

  const tasksToDisplay = (useDemo && tasks.length === 0) ? DEMO_TASKS : tasks;
  const activeTasks = tasksToDisplay.filter(t => !t.isCompleted).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  
  return (
    <StaggerContainer className="space-y-8 pb-12 w-full">
      {/* ─── Header ─── */}
      <StaggerItem>
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight"
          >
            Good afternoon, {user?.displayName?.split(' ')[0] || 'Student'}!
          </motion.h2>
          <p className="text-[var(--text-secondary)] mt-1">Here is what&apos;s happening with your day.</p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <Button className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--background-secondary)] hidden sm:flex" variant="outline" asChild>
            <Link href="/mitra">
              <Sparkles className="w-4 h-4 mr-2 text-[var(--primary)]" />
              Chat with Mitra
            </Link>
          </Button>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]" asChild>
              <Link href="/planner">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
      </StaggerItem>

      {/* ─── Dashboard Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Tasks & Mitra) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Planner Integration */}
          <StaggerItem>
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Card className="border-[var(--border-subtle)] shadow-sm bg-[var(--surface)] relative overflow-hidden hover-lift">
            <CardHeader className="pb-3 border-b border-[var(--border-subtle)] flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
                Up Next
              </CardTitle>
              <Link href="/planner" className="text-sm font-medium text-[var(--primary)] hover:underline">
                Open Planner
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {activeTasks.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <CheckSquare className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
                  <p className="text-[var(--text-secondary)] font-medium">You have no upcoming tasks!</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Take a break or add a new task.</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)]">
                  <AnimatePresence>
                  {activeTasks.slice(0, 5).map((task, index) => {
                    const isToday = new Date(task.deadline).toDateString() === new Date().toDateString();
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: index * 0.05 }}
                        layout
                        className="p-4 flex items-start gap-3 hover:bg-[var(--background-secondary)] transition-colors group"
                      >
                        <motion.button
                          onClick={() => toggleTask(task.id, task.isCompleted)}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex-shrink-0 w-5 h-5 mt-0.5 text-[var(--border)] group-hover:text-[var(--primary)] transition-colors"
                        >
                          <Circle className="w-5 h-5" />
                        </motion.button>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)] text-sm">{task.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs ${isToday ? 'text-amber-600 font-semibold' : 'text-[var(--text-secondary)]'}`}>
                              {isToday ? 'Due Today' : 'Due Tomorrow'}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                            <span className={`text-[10px] font-bold ${task.priority === 'HIGH' ? 'text-red-500' : 'text-[var(--primary)]'}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                        {(task.priority === 'HIGH' || task.priority === 'CRITICAL') && (
                          <span className="px-2 py-1 rounded-md bg-[var(--danger-soft)] text-[var(--danger)] text-xs font-medium flex items-center gap-1 shrink-0">
                            <Flame className="w-3 h-3" />
                            Urgent
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>
          </StaggerItem>

          {/* Mitra Promo Card */}
          <StaggerItem>
          <motion.div
            whileHover={{ scale: 1.01, y: -3 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
          <Card className="border-[var(--primary-soft)] bg-gradient-to-br from-[var(--surface-ai)] to-[var(--surface)] shadow-sm animate-shimmer">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface)] border border-[var(--primary-soft)] shadow-sm flex items-center justify-center shrink-0 relative">
                <div className="absolute inset-0 bg-[var(--primary)]/10 rounded-2xl animate-pulse" />
                <MessageSquareHeart className="w-8 h-8 text-[var(--primary)] relative z-10" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Talk to Mitra</h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">
                  Need to talk, plan your week, or just get something off your mind? Mitra is here to listen.
                </p>
                <Button asChild className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white w-full sm:w-auto">
                  <Link href="/mitra">Open Mitra</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          </motion.div>
          </StaggerItem>

          {/* Quick Actions Grid */}
          <StaggerItem>
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-[var(--text-primary)]">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action, i) => (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                <Link
                  href={action.href}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-[var(--primary-soft)] hover:shadow-sm transition-all text-center group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{action.name}</span>
                </Link>
                </motion.div>
              ))}
            </div>
          </div>
          </StaggerItem>
          
          {/* Quiet Spaces Preview Section */}
          <StaggerItem>
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Quiet Spaces Available Now</h3>
              <Link href="/spaces" className="text-sm font-medium text-[var(--primary)] hover:underline flex items-center gap-1">
                View All <Navigation className="w-3.5 h-3.5" />
              </Link>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['All', 'Library', 'Classroom'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSpaceFilter(filter)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    spaceFilter === filter
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent"
                      : "bg-[var(--background-secondary)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary-soft)]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {spaces
                .filter(s => spaceFilter === 'All' ? true : s.features.includes(spaceFilter.toLowerCase()))
                .filter(s => s.isAvailable)
                .map((space, i) => (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -3 }}
                  >
                  <Card className="hover:shadow-soft hover:border-[var(--primary-soft)] transition-all duration-200 hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-1 text-xs text-[var(--primary)] font-medium bg-[var(--surface-secondary)] px-2 py-0.5 rounded-md w-fit mb-2">
                        <MapPin className="w-3 h-3" /> {space.location.split(',')[0]}
                      </div>
                      <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-2">{space.name}</h4>
                      
                      <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                        <span>Capacity: {space.capacity}</span>
                        {space.crowdPercentage !== undefined && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-[var(--text-primary)]">{space.crowdPercentage}% Full</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
              ))}
            </div>
          </div>
          </StaggerItem>
        </div>

        {/* Right Column (Mood & Insights) */}
        <div className="space-y-6">
          
          {/* Mood Check-in */}
          <StaggerItem>
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="border-none shadow-soft bg-[var(--primary)] text-[var(--primary-foreground)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
            
            <CardContent className="p-6 relative z-10">
              <AnimatePresence mode="wait">
              {moodRecorded && selectedScore ? (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center text-center py-2 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex items-center justify-center w-full mb-2"
                  >
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </motion.div>

                  <h3 className="font-display font-semibold text-lg">Check-in Complete</h3>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 p-3 rounded-lg border border-white/20 w-full"
                  >
                    <p className="text-white font-medium text-sm leading-relaxed">
                      &ldquo;{lang === "english" ? AI_RESPONSES[selectedScore].en : AI_RESPONSES[selectedScore].hi}&rdquo;
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="mood-select"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h3 className="font-display font-semibold text-lg mb-2">How are you feeling?</h3>
                  <p className="text-white/80 text-sm mb-6">Take a moment to check in with yourself today.</p>
                  
                  <div className={`flex justify-between ${isRecordingMood ? 'opacity-50 pointer-events-none' : ''}`}>
                    {MOODS.map((m, i) => (
                      <motion.button 
                        key={i} 
                        onClick={() => handleMoodClick(m.score, m.stress)}
                        {...emojiTap}
                        className="text-2xl sm:text-3xl hover:bg-white/20 p-2 rounded-full cursor-pointer"
                        title={m.stress}
                      >
                        {m.emoji}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </CardContent>
          </Card>
          </motion.div>
          </StaggerItem>

          {/* Weekly Wellness Mini Chart */}
          <StaggerItem>
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
          <Card className="border-[var(--border-subtle)] shadow-sm bg-[var(--surface)] hover-lift">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display font-semibold">Your Week</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                // If demo mode is active and we have no real data, use the story dataset
                const dataToUse = (useDemo && weeklyData.length === 0) ? [
                  { day: "Mon", stress: 4 },
                  { day: "Tue", stress: 5 },
                  { day: "Wed", stress: 6 },
                  { day: "Thu", stress: 4 },
                  { day: "Fri", stress: 3 },
                  { day: "Sat", stress: 2 },
                  { day: "Sun", stress: 3 }
                ] : weeklyData;
                
                if (dataToUse.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Activity className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-[var(--text-secondary)]">No data yet</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">Check in daily to see trends.</p>
                    </div>
                  );
                }

                return (
                  <>
                    {insights && insights.chartData && insights.chartData.length > 0 ? (
                      <div className="h-[220px] w-full mt-4">
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
                            <Bar yAxisId="right" name="Stress Level" dataKey="stressLevel" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-32 flex items-end justify-between gap-1 sm:gap-2 mt-4">
                        {dataToUse.slice(-7).map((day, i) => {
                          const maxScale = 6; 
                          const height = Math.max(10, (day.stress / maxScale) * 100);
                          return (
                            <div key={i} className="w-full flex flex-col items-center gap-2 group">
                              <div className="w-full bg-[var(--surface-secondary)] rounded-t-md h-full relative cursor-pointer hover:bg-[var(--primary-soft)] transition-colors overflow-hidden flex items-end">
                                <div 
                                  className="w-full bg-[var(--primary)] opacity-80 group-hover:opacity-100 transition-all rounded-t-md"
                                  style={{ height: `${height}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase">{day.day.substring(0, 3)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Insight Summary */}
                    {(insights && insights.detailedInsights) ? (
                      <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-[var(--primary)]" />
                          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Mitra's Insights</h4>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                          {insights.detailedInsights.wellness} {insights.detailedInsights.study}
                        </p>
                        <div className="bg-[var(--primary-soft)] p-3 rounded-lg border border-[var(--primary)]/30 mt-3">
                          <p className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">Suggested Action</p>
                          <p className="text-xs font-medium text-[var(--primary-hover)]">
                            {insights.detailedInsights.action}
                          </p>
                        </div>
                      </div>
                    ) : (useDemo && weeklyData.length === 0) ? (
                      <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-4 h-4 text-[var(--primary)]" />
                          <h4 className="text-sm font-semibold text-[var(--text-primary)]">Mitra's Insights</h4>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                          Your recent check-ins indicate moderate stress. You have maintained a 3-day study streak and completed 75% of your planned tasks this week.
                        </p>
                        <div className="bg-[var(--primary-soft)] p-3 rounded-lg border border-[var(--primary)]/30 mt-3">
                          <p className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wide mb-1">Suggested Action</p>
                          <p className="text-xs font-medium text-[var(--primary-hover)]">
                            Complete the SIH presentation draft first, then spend 15 minutes reviewing Engineering Mathematics notes before taking a short break.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[var(--text-secondary)] text-center mt-6">
                        Tracking your stress helps Mitra assist you better.
                      </p>
                    )}
                  </>
                );
              })()}
            </CardContent>
          </Card>
          </motion.div>
          </StaggerItem>

        </div>
      </div>
    </StaggerContainer>
  );
}
