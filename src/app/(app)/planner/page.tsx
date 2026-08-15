"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge, EmptyState, PageHeader } from "@/components/ui/shared";
import { Plus, CheckCircle2, Circle, Clock, Calendar, Trash2, X } from "lucide-react";

type Priority = "High" | "Medium" | "Low";
type Tab = "Today" | "Upcoming" | "All" | "Calendar";

interface Task {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  priority: Priority;
  done: boolean;
  due: "today" | "upcoming" | "all";
}

const priorityConfig: Record<Priority, { badge: string; dot: string }> = {
  High:   { badge: "danger",  dot: "bg-[#C94A4A]" },
  Medium: { badge: "warning", dot: "bg-[#D4A45B]" },
  Low:    { badge: "muted",   dot: "bg-[#98A2B3]" },
};

const initialTasks: Task[] = [
  { id: "1", title: "Review CS301 Lecture Notes", deadline: "Today, 10:00 AM", priority: "High",   done: false, due: "today" },
  { id: "2", title: "Start History Essay Draft",   deadline: "Today, 2:00 PM",  priority: "Medium", done: false, due: "today" },
  { id: "3", title: "Group Project Meeting",        deadline: "Tomorrow",        priority: "Low",    done: false, due: "upcoming" },
  { id: "4", title: "Read Psychology Chapter 6",    deadline: "Thursday",        priority: "Medium", done: false, due: "upcoming" },
  { id: "5", title: "Submit Lab Report",            deadline: "Oct 20",          priority: "High",   done: false, due: "all" },
];

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      deadline: newDeadline || undefined,
      priority: newPriority,
      done: false,
      due: "all",
    };
    setTasks((prev) => [...prev, task]);
    setNewTitle("");
    setNewDeadline("");
    setNewPriority("Medium");
    setShowForm(false);
  };

  const filtered = tasks.filter((t) => {
    if (activeTab === "Today") return t.due === "today";
    if (activeTab === "Upcoming") return t.due === "upcoming";
    return true;
  });

  const active = filtered.filter((t) => !t.done);
  const completed = filtered.filter((t) => t.done);

  const tabs: Tab[] = ["Today", "Upcoming", "All", "Calendar"];

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
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Task
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[#F7FBF8] rounded-xl border border-[#E4EDE7] w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === tab
                ? "bg-white text-[#1F2937] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                : "text-[#667085] hover:text-[#1F2937]"
            }`}
          >
            {tab}
            {tab === "Today" && active.filter(t => t.due === "today").length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full bg-[#2E7D5B] text-white font-bold">
                {active.filter(t => t.due === "today").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Add Task inline form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1F2937]">New Task</p>
                  <button onClick={() => setShowForm(false)} className="text-[#98A2B3] hover:text-[#667085]">
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
                    <label className="text-xs font-medium text-[#667085]">Deadline (optional)</label>
                    <Input
                      type="date"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#667085]">Priority</label>
                    <div className="flex gap-2">
                      {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewPriority(p)}
                          className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                            newPriority === p
                              ? "bg-[#2E7D5B] text-white border-[#2E7D5B]"
                              : "bg-white text-[#667085] border-[#E4EDE7] hover:border-[#4FA477]"
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
                  <Button size="sm" onClick={addTask} disabled={!newTitle.trim()}>Save Task</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === "Calendar" ? (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b border-[#EEF3EF] text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-3 text-xs font-semibold text-[#667085] border-r border-[#EEF3EF] last:border-r-0">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 h-[400px]">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="border-b border-r border-[#EEF3EF] p-2 hover:bg-[#F7FBF8] transition-colors flex flex-col items-center">
                  <span className={`text-sm font-medium ${i === 12 ? 'text-white bg-[#2E7D5B] w-6 h-6 rounded-full flex items-center justify-center' : 'text-[#1F2937]'}`}>
                    {(i % 31) + 1}
                  </span>
                  {i === 12 && (
                    <div className="mt-2 w-full space-y-1">
                      <div className="text-[9px] font-semibold bg-[#FFF2F2] text-[#C94A4A] px-1 py-0.5 rounded truncate">Midterm</div>
                      <div className="text-[9px] font-semibold bg-[#EFF8F1] text-[#2E7D5B] px-1 py-0.5 rounded truncate">Review</div>
                    </div>
                  )}
                  {i === 15 && (
                    <div className="mt-2 w-full space-y-1">
                      <div className="text-[9px] font-semibold bg-[#F7FBF8] text-[#667085] px-1 py-0.5 border border-[#E4EDE7] rounded truncate">History Essay</div>
                    </div>
                  )}
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
              <p className="text-xs font-semibold text-[#98A2B3] uppercase tracking-wider mb-3">
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

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: (id: string) => void; onDelete: (id: string) => void }) {
  const pConf = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: task.done ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={task.done ? "opacity-50" : "hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200"}>
        <CardContent className="p-4 flex items-center gap-3">
          <button
            onClick={() => onToggle(task.id)}
            className="flex-shrink-0 w-5 h-5 text-[#98A2B3] hover:text-[#2E7D5B] transition-colors"
            aria-label={task.done ? "Mark incomplete" : "Mark complete"}
          >
            {task.done
              ? <CheckCircle2 className="w-5 h-5 text-[#2E7D5B]" />
              : <Circle className="w-5 h-5" />
            }
          </button>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${task.done ? "line-through text-[#98A2B3]" : "text-[#1F2937]"}`}>
              {task.title}
            </p>
            {task.deadline && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-[#98A2B3]" />
                <span className="text-xs text-[#98A2B3]">{task.deadline}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${pConf.dot}`} title={task.priority} />
            <button
              onClick={() => onDelete(task.id)}
              className="text-[#E4EDE7] hover:text-[#C94A4A] transition-colors p-1 rounded-lg hover:bg-[#FFF2F2]"
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
