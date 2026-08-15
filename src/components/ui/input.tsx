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
          "flex h-12 w-full rounded-xl border bg-white px-4 py-2 text-sm text-[#1F2937]",
          // Border
          "border-[#D7E2DA]",
          // Placeholder
          "placeholder:text-[#98A2B3]",
          // Focus
          "focus-visible:outline-none focus-visible:border-[#2E7D5B] focus-visible:ring-2 focus-visible:ring-[rgba(46,125,91,0.18)]",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Error (via data attr)
          "data-[invalid=true]:border-[#C94A4A]",
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
