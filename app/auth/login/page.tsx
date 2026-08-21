"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/frontend/components/ui/button";

import { GraduationCap, ShieldAlert, User, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-display font-medium text-[var(--text-primary)] tracking-tight">
          Mann Mitra
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm font-light">Select your portal</p>
      </div>

      <div className="space-y-4">
        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            className="w-full h-[56px] justify-start gap-4 bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-sm transition-all rounded-xl px-6"
            asChild
          >
            <Link href="/auth/student">
              <User className="w-5 h-5 text-[var(--moonlit-cyan)]" />
              <span className="font-medium text-base">Student Portal</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            className="w-full h-[56px] justify-start gap-4 bg-transparent hover:bg-white/5 text-[var(--text-primary)] border border-white/5 transition-all rounded-xl px-6"
            variant="ghost"
            asChild
          >
            <Link href="/auth/faculty">
              <GraduationCap className="w-5 h-5 text-[var(--text-secondary)]" />
              <span className="font-medium text-base text-[var(--text-secondary)]">Faculty Portal</span>
            </Link>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            className="w-full h-[56px] justify-start gap-4 bg-transparent hover:bg-[var(--state-crisis)]/10 text-[var(--text-primary)] border border-transparent hover:border-[var(--state-crisis)]/20 transition-all rounded-xl px-6"
            variant="ghost"
            asChild
          >
            <Link href="/auth/counsellor">
              <ShieldAlert className="w-5 h-5 text-[var(--state-crisis)]" />
              <span className="font-medium text-base text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Counsellor Portal</span>
            </Link>
          </Button>
        </motion.div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors opacity-60 hover:opacity-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sanctuary
        </Link>
      </div>
    </div>
  );
}
