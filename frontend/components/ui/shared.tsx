"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/frontend/lib/utils";
import { fadeInUp } from "@/frontend/lib/motion-presets";

// ─── Skeleton ───────────────────────────────────────────────────────────────
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-[var(--background-secondary)]", className)}
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
    default: "bg-[var(--surface-secondary)] text-[var(--primary-hover)] border-[var(--primary-soft)]",
    green:   "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent",
    warning: "bg-[#FFF6ED] text-[#7A4A1E] border-[#FFD9AE]",
    danger:  "bg-[var(--danger-soft)] text-[#9F2F2F] border-[#FECACA]",
    muted:   "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border-[var(--border)]",
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
      {icon && <div className="mb-5 text-[var(--primary-soft)] opacity-60">{icon}</div>}
      <p className="text-base font-semibold text-[var(--text-primary)]">{title}</p>
      {description && <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-xs">{description}</p>}
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
      <div className="w-12 h-12 rounded-2xl bg-[var(--danger-soft)] flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-[var(--danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.054 0 1.916-.816 1.994-1.85l.738-10.5A2 2 0 0019.66 5H4.34a2 2 0 00-1.994 1.65L1.608 17.15C1.53 18.184 2.392 19 3.446 19z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="text-sm text-[var(--text-secondary)] mt-1.5">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}
    >
      <div>
        <h1 className="text-3xl font-display font-semibold text-[var(--text-primary)] tracking-tight">{title}</h1>
        {description && <p className="text-[var(--text-secondary)] mt-1 text-base">{description}</p>}
      </div>
      {action && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  )
}
