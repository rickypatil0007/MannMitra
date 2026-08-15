import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Skeleton ───────────────────────────────────────────────────────────────
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-[#EEF3EF]", className)}
      {...props}
    />
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
type BadgeVariant = "default" | "green" | "warning" | "danger" | "muted"
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}
export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-[#EFF8F1] text-[#1F5D43] border-[#DDF2E3]",
    green:   "bg-[#2E7D5B] text-white border-transparent",
    warning: "bg-[#FFF6ED] text-[#7A4A1E] border-[#FFD9AE]",
    danger:  "bg-[#FFF2F2] text-[#9F2F2F] border-[#FECACA]",
    muted:   "bg-[#F7FBF8] text-[#667085] border-[#E4EDE7]",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {icon && <div className="mb-5 text-[#4FA477] opacity-60">{icon}</div>}
      <p className="text-base font-semibold text-[#1F2937]">{title}</p>
      {description && <p className="text-sm text-[#667085] mt-1.5 max-w-xs">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// ─── ErrorState ───────────────────────────────────────────────────────────────
interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}
export function ErrorState({ title = "Something went wrong", description = "Please try again.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#FFF2F2] flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-[#C94A4A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.916-.816 1.994-1.85l.738-10.5A2 2 0 0019.66 5H4.34a2 2 0 00-1.994 1.65L1.608 17.15C1.53 18.184 2.392 19 3.446 19z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-[#1F2937]">{title}</p>
      <p className="text-sm text-[#667085] mt-1.5">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-semibold text-[#2E7D5B] hover:text-[#1F5D43] transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  )
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
      <div>
        <h1 className="text-3xl font-display font-semibold text-[#1F2937] tracking-tight">{title}</h1>
        {description && <p className="text-[#667085] mt-1 text-base">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
