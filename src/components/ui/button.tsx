import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

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
      "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(114,200,181,0.16)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer"

    const variants: Record<string, string> = {
      // Primary
      primary:
        "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] shadow-soft",
      // Secondary
      secondary:
        "bg-[var(--surface-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--primary-soft)]",
      // Ghost
      ghost:
        "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--background-secondary)]",
      // Outline
      outline:
        "border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]",
      // Danger / Destructive
      danger:
        "bg-[var(--danger)] text-[var(--primary-foreground)] hover:bg-[#D45A6A] shadow-soft",
      destructive:
        "bg-[var(--danger)] text-[var(--primary-foreground)] hover:bg-[#D45A6A] shadow-soft",
    }

    const sizes = {
      default: "h-11 px-6 py-2 text-sm",
      sm: "h-9 px-4 text-xs",
      lg: "h-13 px-8 text-base",
      icon: "h-10 w-10",
    }

    if (asChild) {
      return (
        <Slot
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
