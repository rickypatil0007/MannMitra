"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Badge, EmptyState, PageHeader } from "@/frontend/components/ui/shared";
import { Plus, CheckCircle2, Circle, Clock, Calendar, Trash2, X, Loader2, PlayCircle, StopCircle, GraduationCap, Flame, Target } from "lucide-react";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserTasks, createTask, toggleTaskCompletion, deleteTask } from "@/backend/actions/task";
import { getPlannerAnalysis, PlannerAnalysisResult } from "@/backend/actions/plannerAnalysis";
import { TaskPriority } from "@/generated/prisma/client";
import { GuestPrompt } from "@/frontend/components/auth/guest-prompt";

type Tab = "Today" | "Upcoming" | "All" | "Calendar";

const priorityConfig: Record<string, { badge: string; dot: string }> = {
  HIGH:     { badge: "danger",  dot: "bg-[var(--danger)]" },
  CRITICAL: { badge: "danger",  dot: "bg-[var(--danger)]" },
  MEDIUM:   { badge: "warning", dot: "bg-[var(--warning)]" },
  LOW:      { badge: "muted",   dot: "bg-[var(--text-muted)]" },
};

export default function PlannerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<PlannerAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const useDemo = true; // Always on

  const DEMO_TASKS = [
    { id: "demo-1", title: "Complete Data Structures assignment", priority: "HIGH", deadline: new Date(new Date().setHours(17, 0, 0, 0)), isCompleted: false },
    { id: "demo-2", title: "Review Engineering Mathematics notes", priority: "MEDIUM", deadline: new Date(new Date().setHours(20, 0, 0, 0)), isCompleted: false },
    { id: "demo-3", title: "Practice 20 aptitude questions", priority: "MEDIUM", deadline: new Date(new Date().setHours(14, 0, 0, 0)), isCompleted: true },
    { id: "demo-4", title: "Submit SIH presentation draft", priority: "HIGH", deadline: new Date(new Date().setHours(18, 0, 0, 0)), isCompleted: false },
    { id: "demo-5", title: "Take a 15-minute break", priority: "LOW", deadline: new Date(new Date().setHours(16, 0, 0, 0)), isCompleted: true }
  ];

  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const [showForm, setShowForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("MEDIUM");

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

  const fetchData = async (uid: string, demoMode: boolean) => {
    setLoading(true);
    const [taskRes, analysisRes] = await Promise.all([
      getUserTasks(uid),
      getPlannerAnalysis(uid, demoMode)
    ]);
    
    if (taskRes.success && taskRes.tasks && taskRes.tasks.length > 0) {
      setTasks(taskRes.tasks);
    } else {
      setTasks(DEMO_TASKS);
    }
    if (analysisRes.success && analysisRes.data) setAnalysis(analysisRes.data);
    setLoading(false);
  };

  const refreshAnalysis = async () => {
    if (user) {
      const analysisRes = await getPlannerAnalysis(user.uid, useDemo);
      if (analysisRes.success && analysisRes.data) setAnalysis(analysisRes.data);
    }
  };

  const toggle = async (id: string, currentStatus: boolean) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !currentStatus } : t)));
    if (!id.startsWith("demo-") && user) {
      await toggleTaskCompletion(user.uid, id, !currentStatus);
      await refreshAnalysis(); // Update heatmap live
    }
  };

  const remove = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (!id.startsWith("demo-") && user) {
      await deleteTask(user.uid, id);
      await refreshAnalysis();
    }
  };

  const addTask = async () => {
    if (!newTitle.trim() || !user || user.isAnonymous) return;
    setActionLoading(true);
    
    const deadlineDate = newDeadline ? new Date(newDeadline) : new Date();

    const res = await createTask(user.uid, {
      title: newTitle.trim(),
      deadline: deadlineDate,
      priority: newPriority,
    });

    if (res.success && res.task) {
      setTasks((prev) => [...prev, res.task]);
      setNewTitle("");
      setNewDeadline("");
      setNewPriority("MEDIUM");
      setShowForm(false);
      await refreshAnalysis();
    }
    setActionLoading(false);
  };



  const getDueCategory = (deadline: Date) => {
    const today = new Date();
    const isToday = deadline.getDate() === today.getDate() && deadline.getMonth() === today.getMonth();
    return isToday ? "today" : "upcoming";
  };

  const filtered = tasks.filter((t) => {
    const dueCategory = getDueCategory(new Date(t.deadline));
    if (activeTab === "Today") return dueCategory === "today";
    if (activeTab === "Upcoming") return dueCategory === "upcoming";
    return true;
  });

  const active = filtered.filter((t) => !t.isCompleted);
  const completed = filtered.filter((t) => t.isCompleted);

  const tabs: Tab[] = ["Today", "Upcoming", "All", "Calendar"];

  // Heatmap intensity helper
  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-[var(--surface-secondary)] border-[var(--border-subtle)]";
    if (count === 1) return "bg-green-200 border-green-300 dark:bg-green-900/40 dark:border-green-800";
    if (count <= 3) return "bg-green-400 border-green-500 dark:bg-green-600 dark:border-green-500";
    return "bg-green-600 border-green-700 dark:bg-green-500 dark:border-green-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-4xl relative min-h-[60vh] pb-10"
    >
      <GuestPrompt feature="Planner" description="Create an account to securely save and track your academic tasks." />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Planner & Analytics"
          description="Organize your academic life and track your progress."
        />
        <div className="flex items-center gap-3 shrink-0">
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" /></div>
      ) : (
        <>
          {/* Top Dashboard Row */}
          {analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Activity Heatmap */}
              <Card className="lg:col-span-2 border-[var(--border-subtle)] bg-[var(--surface)]">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Study Completion Heatmap</CardTitle>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Last 60 days</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Target className="w-4 h-4 text-blue-500" /> {analysis.totalCompleted} Total</span>
                    <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" /> {analysis.currentStreak} Day Streak</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin">
                    <div className="flex flex-col flex-wrap h-[120px] gap-1 content-start">
                      {analysis.heatmap.map((day, idx) => (
                        <div 
                          key={idx} 
                          title={`${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}\n${day.count} tasks completed`}
                          className={`w-3.5 h-3.5 rounded-sm border ${getHeatmapColor(day.count)} hover:ring-2 ring-blue-400 transition-all cursor-help`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 text-xs text-[var(--text-muted)] mt-2">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-sm bg-[var(--surface-secondary)] border border-[var(--border-subtle)]"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900/40 border border-green-300 dark:border-green-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-600 border border-green-500"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500 border border-green-700 dark:border-green-400"></div>
                    <span>More</span>
                  </div>
                </CardContent>
              </Card>

              {/* Exam Workload Analysis */}
              <Card className="border-[var(--primary-soft)] bg-gradient-to-br from-[var(--background-secondary)] to-[var(--surface)]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
                    Exam Workload Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysis.examAnalysis ? (
                    <div className="space-y-4">
                      <div className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-lg p-3">
                        <p className="text-xs text-[var(--text-secondary)] font-medium mb-1">Upcoming Milestone</p>
                        <p className="font-semibold text-[var(--text-primary)]">{analysis.examAnalysis.examTitle}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex flex-col">
                            <span className="text-2xl font-display font-bold text-amber-500">{analysis.examAnalysis.daysRemaining}</span>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Days Left</span>
                          </div>
                          <div className="h-8 w-px bg-[var(--border-subtle)]"></div>
                          <div className="flex flex-col">
                            <span className="text-2xl font-display font-bold text-blue-500">{analysis.examAnalysis.remainingTasks}</span>
                            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">Tasks Due</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[var(--primary-soft)] text-[var(--primary-hover)] text-sm p-3 rounded-lg leading-relaxed">
                        <strong>Mitra Suggests:</strong> {analysis.examAnalysis.aiRecommendation}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-[var(--text-muted)]">
                      <CheckCircle2 className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">No upcoming exams detected.<br/>You're currently on track.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add Task inline form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-[var(--primary-soft)] border-2 mb-6">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">New Task</p>
                      <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      placeholder="Task title (required) - Add 'Exam' to trigger analysis"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addTask()}
                      autoFocus
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">Deadline</label>
                        <Input
                          type="datetime-local"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-[var(--text-secondary)]">Priority</label>
                        <div className="flex gap-2">
                          {(["HIGH", "MEDIUM", "LOW"] as TaskPriority[]).map((p) => (
                            <button
                              key={p}
                              onClick={() => setNewPriority(p)}
                              className={`flex-1 py-2 rounded-lg text-[10px] sm:text-xs font-semibold border transition-colors ${
                                newPriority === p
                                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                                  : "bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary-soft)]"
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                      <Button size="sm" onClick={addTask} disabled={!newTitle.trim() || actionLoading}>
                        {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Task"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Task List Section */}
          <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] w-fit mb-4">
            {tabs.map((tab) => {
              const tabActiveCount = tasks.filter(t => !t.isCompleted && getDueCategory(new Date(t.deadline)) === "today").length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    activeTab === tab
                      ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tab}
                  {tab === "Today" && tabActiveCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold">
                      {tabActiveCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {activeTab === "Calendar" ? (
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b border-[var(--border-subtle)] text-center">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="py-3 text-xs font-semibold text-[var(--text-secondary)] border-r border-[var(--border-subtle)] last:border-r-0">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 grid-rows-5 h-[400px]">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="border-b border-r border-[var(--border-subtle)] p-2 hover:bg-[var(--background-secondary)] transition-colors flex flex-col items-center">
                      <span className={`text-sm font-medium ${i === 12 ? 'text-[var(--primary-foreground)] bg-[var(--primary)] w-6 h-6 rounded-full flex items-center justify-center' : 'text-[var(--text-primary)]'}`}>
                        {(i % 31) + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Active tasks */}
              {active.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="w-10 h-10" />}
                  title={activeTab === "Today" ? "You have no tasks for today." : "No tasks here."}
                  description={activeTab === "Today" ? "Take a moment to rest or plan ahead." : "Add a new task to get started."}
                  action={<Button variant="secondary" onClick={() => setShowForm(true)}>Add a task</Button>}
                />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {active.map((t) => (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                        className="group flex items-start gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--background-primary)] transition-colors"
                      >
                        <button
                          onClick={() => toggle(t.id, t.isCompleted)}
                          className="mt-1 flex-shrink-0 text-[var(--border-subtle)] hover:text-[var(--primary)] transition-colors"
                        >
                          <Circle className="w-6 h-6" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] leading-tight">{t.title}</p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] font-medium text-[var(--text-muted)]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(t.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {new Date(t.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {priorityConfig[t.priority] && (
                              <Badge variant={priorityConfig[t.priority].badge as any} className="gap-1.5 h-5 text-[10px]">
                                <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[t.priority].dot}`} />
                                {t.priority}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => remove(t.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Completed tasks */}
              {completed.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Completed</h3>
                  <div className="space-y-2">
                    {completed.map((t) => (
                      <motion.div
                        key={t.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
                      >
                        <button
                          onClick={() => toggle(t.id, t.isCompleted)}
                          className="text-green-500 hover:text-green-600 transition-colors"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <p className="flex-1 text-sm text-[var(--text-muted)] line-through">{t.title}</p>
                        <button
                          onClick={() => remove(t.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-[var(--text-muted)] hover:text-red-500 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </motion.div>
  );
}
