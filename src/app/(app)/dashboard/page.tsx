"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Flame, Clock, Sparkles, Check, CheckCircle2, Circle, LayoutDashboard, CheckSquare, MessageSquareHeart, Activity, Users, BookOpen, Headset, NotebookPen, Search } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserTasks, toggleTaskCompletion } from "@/actions/task";
import { recordMood } from "@/actions/mood";
import { getWellnessAnalytics } from "@/actions/analytics";
import { StressLevel } from "@/generated/prisma/client";

const MOODS = [
  { emoji: '😭', score: 1, stress: "VERY_HIGH" },
  { emoji: '😕', score: 2, stress: "HIGH" },
  { emoji: '😐', score: 3, stress: "MODERATE" },
  { emoji: '🙂', score: 4, stress: "LOW" },
  { emoji: '🤩', score: 5, stress: "LOW" }
] as const;

const QUICK_ACTIONS = [
  { name: "Plan My Day",    href: "/planner",   icon: CheckSquare, color: "bg-blue-50 text-blue-600" },
  { name: "Write in Diary", href: "/notes",     icon: NotebookPen, color: "bg-purple-50 text-purple-600" },
  { name: "Check My Mood",  href: "/analytics", icon: Activity,    color: "bg-orange-50 text-orange-600" },
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
  
  const [moodRecorded, setMoodRecorded] = useState(false);
  const [isRecordingMood, setIsRecordingMood] = useState(false);

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

  const fetchData = async (uid: string) => {
    const [tasksRes, analyticsRes] = await Promise.all([
      getUserTasks(uid),
      getWellnessAnalytics(uid)
    ]);
    
    if (tasksRes.success && tasksRes.tasks) setTasks(tasksRes.tasks);
    if (analyticsRes.success && analyticsRes.weeklyData) setWeeklyData(analyticsRes.weeklyData);
    
    setLoading(false);
  };

  const handleMoodClick = async (score: number, stress: StressLevel) => {
    if (!user || isRecordingMood || moodRecorded) return;
    setIsRecordingMood(true);
    
    const res = await recordMood(user.uid, score, stress, "Recorded via quick dashboard emoji");
    if (res.success) {
      setMoodRecorded(true);
    }
    setIsRecordingMood(false);
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    if (!user) return;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !currentStatus } : t)));
    await toggleTaskCompletion(user.uid, id, !currentStatus);
  };

  if (loading) return null;

  // Filter tasks for "Today" and "Upcoming"
  const now = new Date();
  const activeTasks = tasks.filter(t => !t.isCompleted).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  
  return (
    <div className="space-y-8 pb-12 w-full">
      {/* ─── Header ─── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight">
            Good afternoon, {user?.displayName?.split(' ')[0] || 'Student'}!
          </h2>
          <p className="text-[var(--text-secondary)] mt-1">Here is what's happening with your day.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button className="bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--background-secondary)]" variant="outline" asChild>
            <Link href="/mitra">
              <Sparkles className="w-4 h-4 mr-2 text-[var(--primary)]" />
              Chat with Mitra
            </Link>
          </Button>
          <Button className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]" asChild>
            <Link href="/planner">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Link>
          </Button>
        </div>
      </section>

      {/* ─── Dashboard Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Tasks & Mitra) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Planner Integration */}
          <Card className="border-[var(--border-subtle)] shadow-sm bg-[var(--surface)] relative overflow-hidden">
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
                  {activeTasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="p-4 flex items-start gap-3 hover:bg-[var(--background-secondary)] transition-colors group">
                      <button
                        onClick={() => toggleTask(task.id, task.isCompleted)}
                        className="flex-shrink-0 w-5 h-5 mt-0.5 text-[var(--border)] group-hover:text-[var(--primary)] transition-colors"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--text-primary)] text-sm">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[var(--text-secondary)]">
                            {task.deadline ? new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'No time set'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                          <span className="text-[10px] font-bold text-[var(--primary)]">{task.priority}</span>
                        </div>
                      </div>
                      {(task.priority === 'HIGH' || task.priority === 'CRITICAL') && (
                        <span className="px-2 py-1 rounded-md bg-[var(--danger-soft)] text-[var(--danger)] text-xs font-medium flex items-center gap-1 shrink-0">
                          <Flame className="w-3 h-3" />
                          Urgent
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mitra Promo Card */}
          <Card className="border-[var(--primary-soft)] bg-gradient-to-br from-[var(--surface-ai)] to-[var(--surface)] shadow-sm">
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

          {/* Quick Actions Grid */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 text-[var(--text-primary)]">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-[var(--primary-soft)] hover:shadow-sm transition-all text-center group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{action.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Mood & Insights) */}
        <div className="space-y-6">
          
          {/* Mood Check-in */}
          <Card className="border-none shadow-soft bg-[var(--primary)] text-[var(--primary-foreground)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
            
            <CardContent className="p-6 relative z-10">
              {moodRecorded ? (
                <div className="flex flex-col items-center justify-center text-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">Check-in Complete</h3>
                  <p className="text-white/80 text-sm">Your mood has been logged privately.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-display font-semibold text-lg mb-2">How are you feeling?</h3>
                  <p className="text-white/80 text-sm mb-6">Take a moment to check in with yourself today.</p>
                  
                  <div className={`flex justify-between ${isRecordingMood ? 'opacity-50 pointer-events-none' : ''}`}>
                    {MOODS.map((m, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleMoodClick(m.score, m.stress)}
                        className="text-2xl sm:text-3xl hover:scale-125 transition-transform hover:bg-white/20 p-2 rounded-full cursor-pointer"
                        title={m.stress}
                      >
                        {m.emoji}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Weekly Wellness Mini Chart */}
          <Card className="border-[var(--border-subtle)] shadow-sm bg-[var(--surface)]">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display font-semibold">Your Week</CardTitle>
              <Link href="/analytics" className="text-xs font-semibold text-[var(--primary)] hover:underline">Insights</Link>
            </CardHeader>
            <CardContent>
              {weeklyData.length > 0 ? (
                <>
                  <div className="h-32 flex items-end justify-between gap-1 sm:gap-2 mt-4">
                    {weeklyData.slice(-7).map((day, i) => {
                      const height = Math.max(10, (day.stress / 5) * 100);
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
                  <p className="text-xs text-[var(--text-secondary)] text-center mt-6">
                    Tracking your stress helps Mitra assist you better.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-[var(--text-secondary)]">No data yet</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">Check in daily to see trends.</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
