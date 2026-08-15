import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", isLoading, asChild = false, children, ...props }, ref) => {

    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D5B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer"

    const variants: Record<string, string> = {
      // Primary: Deep green bg, white text
      primary:
        "bg-[#2E7D5B] text-white hover:bg-[#1F5D43] shadow-sm",
      // Secondary: Light green bg, deep green text
      secondary:
        "bg-[#DDF2E3] text-[#1F5D43] hover:bg-[#CBE8D4]",
      // Ghost: transparent, green text
      ghost:
        "bg-transparent text-[#2E7D5B] hover:bg-[#EFF8F1]",
      // Outline: white bg, green border
      outline:
        "border border-[#E4EDE7] bg-white text-[#1F2937] hover:bg-[#F7FBF8]",
      // Danger: restrained red
      danger:
        "bg-[#C94A4A] text-white hover:bg-[#b03b3b] shadow-sm",
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
