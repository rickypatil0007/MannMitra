"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

const navigation = [
  { name: "Dashboard",  href: "/dashboard",   icon: LayoutDashboard },
  { name: "Planner",    href: "/planner",     icon: CheckSquare },
  { name: "Analytics",  href: "/analytics",   icon: Activity },
  { name: "Mitra",      href: "/mitra",       icon: MessageSquareHeart },
  { name: "Diary",      href: "/notes",       icon: NotebookPen },
  { name: "Community",  href: "/community",   icon: Users },
  { name: "Comfort",    href: "/comfort",     icon: BookOpen },
  { name: "Spaces",     href: "/spaces",      icon: LayoutDashboard },
  { name: "Support",    href: "/support",     icon: Headset },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-60 border-r border-[#E4EDE7] bg-white min-h-screen" aria-label="Main navigation">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center gap-2.5 border-b border-[#EEF3EF] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-[#2E7D5B] flex items-center justify-center text-white text-xs font-bold font-display flex-shrink-0" aria-hidden>
          M
        </div>
        <span className="font-display font-semibold text-base tracking-tight text-[#1F2937]">MannMitra</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2.5 pt-3 pb-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#EFF8F1] text-[#1F5D43]"
                  : "text-[#667085] hover:bg-[#F7FBF8] hover:text-[#1F2937]"
              )}
            >
              <item.icon
                className={cn("w-4 h-4 flex-shrink-0",
                  isActive ? "text-[#2E7D5B]" : "text-[#667085]"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* SOS — persistent per spec STU-20-01 */}
      <div className="px-2.5 pb-2.5">
        <Link
          href="/safety"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#C94A4A] bg-[#FFF2F2] hover:bg-[#FECACA]/30 transition-colors border border-[#FECACA]/50"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
          SOS · Urgent Help
        </Link>
      </div>

      {/* Footer */}
      <div className="px-2.5 pb-3 border-t border-[#EEF3EF] pt-2.5 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
            pathname === "/settings"
              ? "bg-[#EFF8F1] text-[#1F5D43]"
              : "text-[#667085] hover:bg-[#F7FBF8] hover:text-[#1F2937]"
          )}
        >
          <Settings className="w-4 h-4" strokeWidth={2} />
          Settings
        </Link>
        <Link
          href="/auth/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#667085] hover:bg-[#F7FBF8] hover:text-[#1F2937] transition-all duration-150"
        >
          <LogOut className="w-4 h-4" strokeWidth={2} />
          Log out
        </Link>
      </div>
    </aside>
  );
}
