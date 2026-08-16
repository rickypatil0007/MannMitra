import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base
          "flex h-12 w-full rounded-xl border bg-[var(--background-secondary)] px-4 py-2 text-sm text-[var(--text-primary)]",
          // Border
          "border-[var(--border)]",
          // Placeholder
          "placeholder:text-[var(--text-muted)]",
          // Focus Glow
          "focus-visible:outline-none focus-visible:border-[var(--primary)] focus-visible:ring-4 focus-visible:ring-[rgba(224,122,95,0.12)] transition-all duration-300",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Error (via data attr)
          "data-[invalid=true]:border-[var(--danger)]",
          "transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
