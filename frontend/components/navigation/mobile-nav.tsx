"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/frontend/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquareHeart,
  Activity,
  Headset,
  AlertTriangle,
  Menu,
  NotebookPen,
  BookOpen,
  Settings,
  Users
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { staggerContainer, staggerItem } from "@/frontend/lib/motion-presets";

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const mainNav = [
    { name: "Home",      href: "/dashboard", icon: LayoutDashboard },
    { name: "Planner",   href: "/planner",   icon: CheckSquare },
    { name: "Mitra",     href: "/mitra",     icon: MessageSquareHeart },
    { name: "Community", href: "/community", icon: Users },
  ];

  const moreNav = [
    { name: "Diary",      href: "/notes",      icon: NotebookPen },
    { name: "Analytics",  href: "/analytics",  icon: Activity },
    { name: "Comfort",    href: "/comfort",    icon: BookOpen },
    { name: "Spaces",     href: "/spaces",     icon: LayoutDashboard },
    { name: "Support",    href: "/support",    icon: Headset },
    { name: "Settings",   href: "/settings",   icon: Settings },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] glass-nav border-t-0 safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-2 bg-[var(--surface)]">
          {mainNav.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5 min-w-[48px]"
              >
                {isActive && !moreOpen && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-1 w-8 h-1 rounded-full bg-[var(--primary)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  animate={isActive && !moreOpen ? { scale: [1, 1.2, 1], y: [0, -2, 0] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive && !moreOpen ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                    )}
                    strokeWidth={isActive && !moreOpen ? 2.5 : 2}
                  />
                </motion.div>
                <span
                  className={cn(
                    "text-[10px] font-medium",
                    isActive && !moreOpen ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="relative flex flex-col items-center gap-1 px-3 py-1.5 min-w-[48px]"
          >
            {moreOpen && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute -top-1 w-8 h-1 rounded-full bg-[var(--primary)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <motion.div animate={moreOpen ? { rotate: 90 } : { rotate: 0 }} transition={{ duration: 0.2 }}>
              <Menu
                className={cn(
                  "w-5 h-5 transition-colors",
                  moreOpen ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                )}
                strokeWidth={moreOpen ? 2.5 : 2}
              />
            </motion.div>
            <span
              className={cn(
                "text-[10px] font-medium",
                moreOpen ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              )}
            >
              More
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-[55] bg-[var(--surface)] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-24 safe-area-bottom overflow-hidden"
            >
              <div className="w-12 h-1.5 bg-[var(--border)] rounded-full mx-auto my-3" />

              <div className="px-6 py-4">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4"
                >
                  Explore MannMitra
                </motion.h3>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-2 gap-3 mb-6"
                >
                  {moreNav.map((item) => (
                    <motion.div key={item.name} variants={staggerItem}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--background-secondary)] hover:bg-[var(--border-subtle)] transition-colors hover-lift"
                      >
                        <item.icon className="w-5 h-5 text-[var(--text-secondary)]" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/safety"
                    className="flex items-center justify-between p-4 rounded-2xl bg-[var(--danger-soft)] border border-[#FECACA]/40 text-[var(--danger)]"
                  >
                    <span className="flex items-center gap-3 font-semibold">
                      <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
                      SOS · Urgent Help
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
