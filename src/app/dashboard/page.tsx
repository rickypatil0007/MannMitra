"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Flame, Clock, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserTasks } from "@/actions/task";
import { recordMood } from "@/actions/mood";
import { StressLevel } from "@/generated/prisma/client";

const MOODS = [
  { emoji: '😭', score: 1, stress: "VERY_HIGH" },
  { emoji: '😕', score: 2, stress: "HIGH" },
  { emoji: '😐', score: 3, stress: "MODERATE" },
  { emoji: '🙂', score: 4, stress: "LOW" },
  { emoji: '🤩', score: 5, stress: "LOW" }
] as const;

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [moodRecorded, setMoodRecorded] = useState(false);
  const [isRecordingMood, setIsRecordingMood] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const res = await getUserTasks(currentUser.uid);
        if (res.success && res.tasks) {
          setTasks(res.tasks);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleMoodClick = async (score: number, stress: StressLevel) => {
    if (!user || isRecordingMood || moodRecorded) return;
    setIsRecordingMood(true);
    
    const res = await recordMood(user.uid, score, stress, "Recorded via quick dashboard emoji");
    if (res.success) {
      setMoodRecorded(true);
    }
    setIsRecordingMood(false);
  };

  if (loading) return null; // handled by layout

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight">Good afternoon, {user?.displayName?.split(' ')[0] || 'Student'}!</h2>
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
            <Link href="/dashboard/planner">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Link>
          </Button>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Tasks & Planner */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-none shadow-soft relative overflow-hidden bg-gradient-to-br from-[var(--surface)] to-[var(--background-secondary)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--primary)]" />
                Up Next
              </h3>
              <Link href="/dashboard/planner" className="text-sm text-[var(--primary)] hover:underline font-medium">View all</Link>
            </div>
            
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-[var(--text-secondary)]">
                  <p>You have no upcoming tasks!</p>
                </div>
              ) : tasks.filter(t => !t.isCompleted).map((task, i) => (
                <Link href="/dashboard/planner" key={task.id || i} className="block">
                  <div className="group p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] hover:border-[var(--primary-soft)] hover:shadow-sm transition-all flex items-start justify-between cursor-pointer">
                    <div className="flex gap-3 items-start">
                      <div className="mt-0.5 w-5 h-5 rounded-md border-2 border-[var(--border)] group-hover:border-[var(--primary)] transition-colors flex items-center justify-center shrink-0" />
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[var(--text-secondary)]">
                            {task.deadline ? new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'No time set'}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
                          <span className="text-xs font-medium text-[var(--primary)]">{task.priority || 'NORMAL'}</span>
                        </div>
                      </div>
                    </div>
                    {(task.priority === 'HIGH' || task.priority === 'CRITICAL') && (
                      <span className="px-2 py-1 rounded-md bg-[var(--danger-soft)] text-[var(--danger)] text-xs font-medium flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        Urgent
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Mood & Insights */}
        <div className="space-y-6">
          <Card className="p-6 border-none shadow-soft bg-[var(--primary)] text-[var(--primary-foreground)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
            
            {moodRecorded ? (
              <div className="relative z-10 flex flex-col items-center justify-center text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg">Mood Saved Securely!</h3>
                <p className="text-white/80 text-sm">Your check-in is encrypted and safe.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display font-semibold text-lg mb-2 relative z-10">How are you feeling?</h3>
                <p className="text-white/80 text-sm mb-6 relative z-10">Take a moment to check in with yourself.</p>
                
                <div className={`flex justify-between relative z-10 ${isRecordingMood ? 'opacity-50 pointer-events-none' : ''}`}>
                  {MOODS.map((m, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleMoodClick(m.score, m.stress)}
                      className="text-2xl hover:scale-125 transition-transform hover:bg-white/20 p-2 rounded-full cursor-pointer"
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card className="p-6 border-none shadow-soft">
            <h3 className="font-display font-semibold text-lg mb-4">Weekly Wellness</h3>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
              {/* Fake chart bars */}
              {[40, 70, 45, 90, 65, 80, 50].map((height, i) => (
                <div key={i} className="w-full bg-[var(--surface-secondary)] rounded-t-sm relative group cursor-pointer hover:bg-[var(--primary-soft)] transition-colors">
                  <div 
                    className="absolute bottom-0 w-full bg-[var(--primary)] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs text-[var(--text-muted)] font-medium px-2">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
