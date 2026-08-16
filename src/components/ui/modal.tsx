"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-[24px] bg-[var(--surface)] p-6 shadow-2xl overflow-hidden",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 bg-muted/50 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>
        
        {(title || description) && (
          <div className="mb-6 pr-8">
            {title && <h2 className="text-2xl font-display font-semibold tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        )}
        
        {children}
      </div>
    </div>
  )
}
