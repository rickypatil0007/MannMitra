"use client"

import * as React from "react"
import { cn } from "@/frontend/lib/utils"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { SmoothPresence } from "@/frontend/components/motion/SmoothPresence"
import { modalVariants } from "@/frontend/lib/motion/variants"
import { motionTokens } from "@/frontend/lib/motion/tokens"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  return (
    <SmoothPresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTokens.duration.fast }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div 
            role="dialog"
            aria-modal="true"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative z-50 w-full max-w-lg rounded-[24px] bg-[var(--surface)] p-6 shadow-2xl overflow-hidden border border-[var(--border-subtle)]",
              className
            )}
          >
            <button 
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 bg-[var(--surface-secondary)] hover:bg-[var(--primary-soft)] transition-colors text-[var(--text-secondary)] hover:text-[var(--primary)]"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </button>
            
            {(title || description) && (
              <div className="mb-6 pr-8">
                {title && <h2 className="text-2xl font-display font-semibold tracking-tight text-[var(--text-primary)]">{title}</h2>}
                {description && <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>}
              </div>
            )}
            
            {children}
          </motion.div>
        </div>
      )}
    </SmoothPresence>
  )
}
