"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, EmptyState, PageHeader } from "@/components/ui/shared";
import { Plus, CheckCircle2, Circle, Clock, Calendar, Trash2, X, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserTasks, createTask, toggleTaskCompletion, deleteTask } from "@/actions/task";
import { TaskPriority } from "@/generated/prisma/client";

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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState<TaskPriority>("MEDIUM");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchTasks(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchTasks = async (uid: string) => {
    const res = await getUserTasks(uid);
    if (res.success && res.tasks) setTasks(res.tasks);
  };

  const toggle = async (id: string, currentStatus: boolean) => {
    if (!user) return;
    // Optimistic UI
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !currentStatus } : t)));
    await toggleTaskCompletion(user.uid, id, !currentStatus);
  };

  const remove = async (id: string) => {
    if (!user) return;
    // Optimistic UI
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await deleteTask(user.uid, id);
  };

  const addTask = async () => {
    if (!newTitle.trim() || !user) return;
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
    }
    setActionLoading(false);
  };

  // Helper to categorize tasks
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

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-3xl"
    >
      <PageHeader
        title="Planner"
        description="Organize your academic life with clarity."
        action={
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)]">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)] w-fit">
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

      {/* Add Task inline form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-[var(--primary-soft)] border-2">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">New Task</p>
                  <button onClick={() => setShowForm(false)} className="text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Input
                  placeholder="Task title (required)"
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
            <div className="space-y-2">
              {active.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggle} onDelete={remove} />
              ))}
            </div>
          )}

          {/* Completed section */}
          {completed.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                Completed · {completed.length}
              </p>
              <div className="space-y-2">
                {completed.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggle} onDelete={remove} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

function TaskRow({ task, onToggle, onDelete }: { task: any; onToggle: (id: string, curr: boolean) => void; onDelete: (id: string) => void }) {
  const pConf = priorityConfig[task.priority] || priorityConfig["MEDIUM"];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: task.isCompleted ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={task.isCompleted ? "opacity-50" : "hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200"}>
        <CardContent className="p-4 flex items-center gap-3">
          <button
            onClick={() => onToggle(task.id, task.isCompleted)}
            className="flex-shrink-0 w-5 h-5 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            aria-label={task.isCompleted ? "Mark incomplete" : "Mark complete"}
          >
            {task.isCompleted
              ? <CheckCircle2 className="w-5 h-5 text-[var(--primary)]" />
              : <Circle className="w-5 h-5" />
            }
          </button>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${task.isCompleted ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
              {task.title}
            </p>
            {task.deadline && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">{new Date(task.deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pConf.dot}`} title={task.priority} />
            <button
              onClick={() => onDelete(task.id)}
              className="text-[var(--border)] hover:text-[var(--danger)] transition-colors p-1 rounded-lg hover:bg-[var(--danger-soft)]"
              aria-label="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
