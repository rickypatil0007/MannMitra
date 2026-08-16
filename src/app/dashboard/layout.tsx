"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Brain, LayoutDashboard, CalendarCheck, BarChart3, LogOut, Settings } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth/student/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--background-secondary)]">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background-secondary)] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-[var(--border-subtle)]">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)]">
              <Brain className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-lg text-[var(--text-primary)] tracking-tight">MannMitra</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] font-medium text-sm transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link href="/dashboard/planner" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] font-medium text-sm transition-colors">
            <CalendarCheck className="w-4 h-4" />
            Planner
          </Link>
          <Link href="/dashboard/insights" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] font-medium text-sm transition-colors">
            <BarChart3 className="w-4 h-4" />
            Insights & Mood
          </Link>
        </nav>
        
        <div className="p-4 border-t border-[var(--border-subtle)] space-y-1">
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] font-medium text-sm transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] font-medium text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 bg-[var(--surface)] border-b border-[var(--border)] shrink-0">
          <h1 className="text-xl font-display font-semibold text-[var(--text-primary)]">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center font-bold text-sm uppercase">
              {user?.displayName ? user.displayName.charAt(0) : "U"}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
