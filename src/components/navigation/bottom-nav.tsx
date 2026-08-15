"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MessageSquare, BrainCircuit, Calendar, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: MessageSquare, label: "Chat", href: "/companion" },
  { icon: BrainCircuit, label: "Chaos", href: "/chaos" },
  { icon: Calendar, label: "Book", href: "/counselors" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <>
      {/* Floating SOS Button for Mobile */}
      <Link 
        href="/safety"
        className="md:hidden fixed bottom-24 right-4 z-50 w-12 h-12 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Safety Center SOS"
      >
        <ShieldAlert className="w-6 h-6" />
      </Link>

      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 glass rounded-3xl p-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300",
                isActive ? "bg-primary/10" : "bg-transparent"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
