"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { motionTokens } from "@/frontend/lib/motion/tokens";
import { cn } from "@/frontend/lib/utils";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquareHeart,
  Users,
  BookOpen,
  Headset,
  Activity,
  NotebookPen,
  Settings,
  LogOut,
  AlertTriangle,
  LogIn
} from "lucide-react";

const authenticatedNavigation = [
  { name: "Dashboard",  href: "/dashboard",   icon: LayoutDashboard },
  { name: "Daily Insights", href: "/mood",    icon: Activity },
  { name: "Planner",    href: "/planner",     icon: CheckSquare },
  { name: "Analytics",  href: "/analytics",   icon: Activity },
  { name: "Mitra",      href: "/mitra",       icon: MessageSquareHeart },
  { name: "Companion",  href: "/companion",   icon: Users },
  { name: "Diary",      href: "/notes",       icon: NotebookPen },
  { name: "Community",  href: "/community",   icon: Users },
  { name: "Comfort",    href: "/comfort",     icon: BookOpen },
  { name: "Spaces",     href: "/spaces",      icon: LayoutDashboard },
  { name: "Support",    href: "/support",     icon: Headset },
];

const guestNavigation = [
  { name: "Dashboard",  href: "/dashboard",   icon: LayoutDashboard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isGuest = !user || user.isAnonymous;
  const navigation = loading ? guestNavigation : (isGuest ? guestNavigation : authenticatedNavigation);
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside className="flex flex-col w-60 border-r-0 glass-nav min-h-screen" aria-label="Main navigation">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 h-14 flex items-center gap-2.5 border-b border-[var(--border-subtle)] shrink-0"
      >
        <motion.div
          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold font-display flex-shrink-0"
          aria-hidden
        >
          M
        </motion.div>
        <span className="font-display font-semibold text-base tracking-tight text-[var(--text-primary)]">MannMitra</span>
      </motion.div>

      <nav className="flex-1 px-2.5 pt-3 pb-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <motion.div
              key={item.name}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : index * 0.03, duration: motionTokens.duration.normal }}
            >
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-[var(--primary-hover)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                {isActive && !shouldReduceMotion && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-[var(--surface-secondary)] rounded-xl"
                    transition={motionTokens.spring.gentle}
                  />
                )}
                {isActive && shouldReduceMotion && (
                  <div
                    className="absolute inset-0 bg-[var(--surface-secondary)] rounded-xl"
                  />
                )}
                <motion.span
                  className="relative z-10 flex items-center gap-3"
                  whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                  transition={motionTokens.spring.soft}
                >
                  <motion.span
                    animate={isActive && !shouldReduceMotion ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: motionTokens.duration.normal }}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4 flex-shrink-0",
                        isActive ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"
                      )}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.span>
                  {item.name}
                </motion.span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div className="px-2.5 pb-2.5">
        <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}>
          <Link
            href="/safety"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--danger)] bg-[var(--danger-soft)] hover:bg-[#FECACA]/30 transition-colors border border-[#FECACA]/50"
          >
            <motion.span
              animate={shouldReduceMotion ? {} : { scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
            </motion.span>
            SOS · Urgent Help
          </Link>
        </motion.div>
      </div>

      <div className="px-2.5 pb-3 border-t border-[var(--border-subtle)] pt-2.5 space-y-0.5">
        {!isGuest && (
          <Link
            href="/settings"
            className={cn(
              "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
              pathname === "/settings"
                ? "bg-[var(--surface-secondary)] text-[var(--primary-hover)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Settings className="w-4 h-4" strokeWidth={2} />
            Settings
          </Link>
        )}
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)] transition-all duration-150"
        >
          {isGuest ? (
            <>
              <LogIn className="w-4 h-4" strokeWidth={2} />
              Log in
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" strokeWidth={2} />
              Log out
            </>
          )}
        </Link>
      </div>
    </aside>
  );
}
