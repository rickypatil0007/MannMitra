"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { HinglishQuotes } from "@/components/ui/hinglish-quotes";
import { motion, Variants } from "framer-motion";
import { ArrowDown, Brain, Shield, Sparkles, CheckCircle } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">

      {/* ─── Sticky Nav ─── */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--surface)]/78 backdrop-blur-[20px] border-b border-[rgba(80,110,100,0.10)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-display font-semibold text-lg tracking-tight flex items-center gap-2.5 text-[var(--text-primary)]">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold">M</div>
            Mann Mitra
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors hidden sm:block">
              Log in
            </Link>
            <Button size="sm" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-24 px-6 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Saraathi-style Peach/Orange glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-[var(--primary)]/10 rounded-full blur-[150px] mix-blend-multiply opacity-80 pointer-events-none animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[700px] h-[700px] bg-[#F97316]/5 rounded-full blur-[150px] mix-blend-multiply opacity-60 pointer-events-none animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-[900px] h-[900px] bg-[#FFEDD5]/40 rounded-full blur-[150px] mix-blend-multiply opacity-70 pointer-events-none animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-soft)] border border-[var(--primary)]/20 text-sm font-medium text-[var(--primary-hover)] mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Your Safe Space
            </motion.div>

            <motion.h1 
              variants={fadeInUp} 
              className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-[var(--text-primary)] tracking-tighter mb-6 leading-[1.05]"
            >
              Life is hard.<br className="hidden sm:block" /> You don't have to carry it <span className="text-[var(--primary)]">alone.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-[var(--text-secondary)] max-w-lg mb-10 leading-relaxed font-sans">
              A free, anonymous space for Indian students to talk, heal, and support each other.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
              <Magnetic>
                <Button size="lg" className="h-14 px-10 text-base rounded-full w-full sm:w-auto shadow-soft" asChild>
                  <Link href="/auth/register">Start your journey</Link>
                </Button>
              </Magnetic>
              <Button size="lg" variant="ghost" className="h-14 px-10 text-base rounded-full w-full sm:w-auto" asChild>
                <Link href="/auth/login">Log in as Guest</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="w-full flex justify-center lg:justify-end"
          >
            <HinglishQuotes />
          </motion.div>
        </div>
      </section>

      {/* ─── Feature: Privacy ─── */}
      <section id="features" className="py-28 bg-[var(--background-secondary)]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--primary-soft)] mb-6">
                <Shield className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-semibold text-[var(--primary-hover)] tracking-tight mb-5">
                Absolute Privacy.<br />No compromises.
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
                Your conversations, planners, and journals are encrypted and private. We don't sell data, we don't track you, and you can always remain completely anonymous.
              </p>
              <ul className="space-y-3">
                {["No data is ever sold", "Anonymous usage supported", "You control your data", "Campus-grade security"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[var(--text-secondary)]">
                    <CheckCircle className="w-5 h-5 text-[var(--primary)] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <Reveal delay={0.2} width="100%">
              {/* Decorative product mockup */}
              <SpotlightCard variant="default" className="aspect-[4/3] p-8 flex flex-col justify-between group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Privacy Mode: Active</span>
                  <span className="ml-auto px-2.5 py-1 text-xs rounded-full bg-[var(--primary-soft)] text-[var(--primary-hover)] font-medium">Secure</span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-[var(--surface-secondary)] rounded-full w-full group-hover:bg-[var(--primary-soft)] transition-colors duration-500"></div>
                  <div className="h-3 bg-[var(--surface-secondary)] rounded-full w-4/5"></div>
                  <div className="h-3 bg-[var(--primary-soft)] rounded-full w-3/4"></div>
                  <div className="h-3 bg-[var(--surface-secondary)] rounded-full w-full"></div>
                  <div className="h-3 bg-[var(--surface-secondary)] rounded-full w-2/3 group-hover:bg-[var(--primary-soft)] transition-colors duration-700"></div>
                </div>
                <div className="mt-8 flex items-center justify-between text-sm text-[var(--text-muted)]">
                  <span>End-to-end encrypted</span>
                  <span className="text-[var(--primary-hover)] font-medium">✓ Protected</span>
                </div>
              </SpotlightCard>
            </Reveal>
          </motion.div>
        </div>
      </section>

      {/* ─── Feature: Mitra AI ─── */}
      <section className="py-28 bg-[var(--surface-ai)] relative overflow-hidden">
        {/* Subtle AI radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[var(--surface-ai)] rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <Reveal delay={0.2} width="100%" className="order-2 lg:order-1">
              {/* Mitra Chat Mockup */}
              <SpotlightCard variant="default" className="p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
                  <motion.div 
                    animate={{ opacity: [0.8, 1, 0.8], scale: [0.98, 1.02, 0.98] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-9 h-9 rounded-full bg-[var(--surface-ai)] border border-[var(--border-subtle)] flex items-center justify-center shadow-soft"
                  >
                    <Brain className="w-5 h-5 text-[var(--accent-ai)]" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Mitra</p>
                    <p className="text-xs text-[var(--text-muted)]">Always here for you</p>
                  </div>
                </div>
                <div className="bg-[var(--surface-ai)] border border-[var(--border-subtle)] px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm text-[var(--text-primary)] leading-relaxed">
                  It sounds like midterms are piling up. Let's break down that essay first — what topic are you covering?
                </div>
                <div className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-sm leading-relaxed shadow-soft">
                  I just don't know where to start. It feels overwhelming.
                </div>
                <div className="bg-[var(--surface-ai)] border border-[var(--border-subtle)] px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm text-[var(--text-primary)] leading-relaxed">
                  That's completely understandable. Let's make it smaller. What's the one thing you DO know about this topic?
                </div>
              </SpotlightCard>
            </Reveal>

            <motion.div variants={fadeInUp} className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--accent-ai-soft)] mb-6">
                <Brain className="w-6 h-6 text-[var(--accent-ai)]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-semibold text-[var(--primary-hover)] tracking-tight mb-5">
                Meet Mitra.<br />Always here.
              </h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                An empathetic AI companion trained to listen, validate your feelings, and help organize your thoughts. Mitra doesn't diagnose — it holds space for you when you need it most.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Footer ─── */}
      <section className="py-28 bg-[var(--primary)] text-[var(--primary-foreground)] text-center px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto"
        >
          <motion.h2 variants={fadeInUp} className="text-5xl md:text-6xl font-display font-semibold tracking-tight mb-6">
            Ready to find your focus?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-[var(--primary-foreground)]/70 mb-10">
            Join thousands of students who use MannMitra to take care of their mind.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic>
              <Button size="lg" className="h-14 px-10 text-base rounded-full bg-[var(--primary-soft)] text-[var(--primary-hover)] hover:bg-[var(--surface)] w-full sm:w-auto font-semibold shadow-soft" asChild>
                <Link href="/auth/register">Join MannMitra — It's Free</Link>
              </Button>
            </Magnetic>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-base rounded-full text-[var(--primary-foreground)] hover:bg-[var(--surface)]/10 w-full sm:w-auto" asChild>
              <Link href="/auth/login">Log in as Guest</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="bg-[var(--surface-secondary)] py-16 mt-auto border-t border-[var(--border-subtle)] text-center text-sm text-[var(--text-muted)]">
        <p>© 2026 MannMitra. Private & Secure. Built with care for students.</p>
      </footer>

    </div>
  );
}
