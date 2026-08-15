"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ShieldAlert,
} from "lucide-react";

const navigation = [
  { name: "Dashboard",   href: "/counsellor/dashboard", icon: LayoutDashboard },
  { name: "Caseload",    href: "/counsellor/caseload",  icon: Users },
  { name: "Messages",    href: "/counsellor/messages",  icon: MessageSquare },
];

export function CounsellorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-60 border-r border-[#E4EDE7] bg-white min-h-screen" aria-label="Counsellor navigation">
      {/* Logo */}
      <div className="px-5 h-14 flex items-center gap-2.5 border-b border-[#EEF3EF] shrink-0 bg-[#F7FBF8]">
        <div className="w-7 h-7 rounded-lg bg-[#2E7D5B] flex items-center justify-center text-white text-xs font-bold font-display flex-shrink-0" aria-hidden>
          C
        </div>
        <span className="font-display font-semibold text-base tracking-tight text-[#1F2937]">Care Portal</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-2.5 pt-4 pb-3 space-y-0.5 overflow-y-auto">
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

      {/* Alerts */}
      <div className="px-2.5 pb-2.5">
        <Link
          href="/counsellor/alerts"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#C94A4A] bg-[#FFF2F2] hover:bg-[#FECACA]/30 transition-colors border border-[#FECACA]/50"
        >
          <ShieldAlert className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
          Emergency Alerts
        </Link>
      </div>

      {/* Footer */}
      <div className="px-2.5 pb-3 border-t border-[#EEF3EF] pt-2.5 space-y-0.5">
        <Link
          href="/counsellor/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
            pathname === "/counsellor/settings"
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
