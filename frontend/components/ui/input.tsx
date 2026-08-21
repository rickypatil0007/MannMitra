import * as React from "react"
import { cn } from "@/frontend/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base
          "flex h-12 w-full rounded-2xl border bg-[var(--background-secondary)] px-5 py-2 text-sm text-[var(--text-primary)] shadow-sm",
          // Border
          "border-[rgba(255,255,255,0.08)]",
          // Placeholder
          "placeholder:text-[var(--text-muted)]",
          // Focus Glow
          "focus-visible:outline-none focus-visible:border-[var(--primary)] focus-visible:ring-4 focus-visible:ring-[rgba(143,185,168,0.12)] focus-visible:bg-[rgba(255,255,255,0.04)]",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Error (via data attr)
          "data-[invalid=true]:border-[var(--danger)]",
          "transition-all duration-300 ease-[var(--ease-soft)]",
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
