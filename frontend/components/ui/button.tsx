"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/frontend/lib/utils"
import { ScalePress } from "@/frontend/components/motion/ScalePress"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading, asChild = false, children, ...props }, ref) => {

    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(143,185,168,0.16)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer gap-2"

    const variants: Record<string, string> = {
      primary: "bg-[rgba(110,211,199,0.15)] text-[var(--accent-pink)] border border-[rgba(110,211,199,0.2)] hover:bg-[rgba(110,211,199,0.25)] hover:-translate-y-[2px] transition-all duration-300 shadow-[0_0_15px_rgba(110,211,199,0.1)]",
      secondary: "bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.1)] hover:-translate-y-[1px] transition-all duration-300",
      ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]",
      outline: "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]",
      danger: "bg-[var(--danger)] text-[var(--primary-foreground)] hover:bg-[#D45A6A] shadow-soft",
      destructive: "bg-[var(--danger)] text-[var(--primary-foreground)] hover:bg-[#D45A6A] shadow-soft",
    }

    const sizes = {
      default: "h-12 px-6 text-sm", // 48px height
      sm: "h-10 px-4 text-xs",      // 40px height
      lg: "h-14 px-8 text-base",    // 56px height
      icon: "h-12 w-12",
    }

    if (asChild) {
      return (
        <Slot
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          ref={ref as any}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <ScalePress
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...(props as any)}
      >
        {isLoading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </ScalePress>
    )
  }
)
Button.displayName = "Button"

export { Button }
