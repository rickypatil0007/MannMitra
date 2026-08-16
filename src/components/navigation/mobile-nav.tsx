"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  MessageSquareHeart,
  Activity,
  Headset,
  AlertTriangle,
} from "lucide-react";

const mobileNav = [
  { name: "Home",      href: "/dashboard", icon: LayoutDashboard },
  { name: "Planner",   href: "/planner",   icon: CheckSquare },
  { name: "Mitra",     href: "/mitra",     icon: MessageSquareHeart },
  { name: "Wellness",  href: "/mood",      icon: Activity },
  { name: "Support",   href: "/support",   icon: Headset },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav border-t-0 safe-area-bottom">
      {/* SOS strip */}
      <Link
        href="/safety"
        className="flex items-center justify-center gap-2 py-2 bg-[var(--danger-soft)] border-b border-[#FECACA]/40 text-[var(--danger)] text-xs font-semibold"
      >
        <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2.5} />
        SOS · Urgent Help
      </Link>
      <div className="flex items-center justify-around px-1 py-2">
        {mobileNav.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 min-w-[48px]"
            >
              <item.icon
                className={cn("w-5 h-5 transition-colors",
                  isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={cn("text-[10px] font-medium", isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
