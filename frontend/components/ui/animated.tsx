"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/frontend/lib/utils";
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleIn,
  popIn,
} from "@/frontend/lib/motion-presets";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function StaggerContainer({ children, className, delay = 0 }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        ...staggerContainer,
        visible: {
          ...staggerContainer.visible,
          transition: {
            ...(staggerContainer.visible as { transition: object }).transition,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

export function FadeInUp({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleIn}
      transition={{ delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface)] shadow-card transition-shadow hover:shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AuthFormWrapper({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6 relative"
    >
      {children}
    </motion.div>
  );
}

export function AuthSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedPresenceScale({
  show,
  children,
  className,
}: {
  show: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="content"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={popIn}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FloatingOrbs({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FFEDD5]/20 rounded-full blur-[80px] animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[60px] animate-blob animation-delay-4000" />
    </div>
  );
}

export function PulseRing({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-3 w-3", className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-40" />
      <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--primary)]" />
    </span>
  );
}
