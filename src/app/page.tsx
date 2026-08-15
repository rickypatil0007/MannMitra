"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-white text-[#1F2937]">

      {/* ─── Sticky Nav ─── */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-[20px] border-b border-[#EEF3EF]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-display font-semibold text-lg tracking-tight flex items-center gap-2.5 text-[#1F2937]">
            <div className="w-7 h-7 rounded-lg bg-[#2E7D5B] flex items-center justify-center text-white text-xs font-bold">M</div>
            Mann Mitra
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-[#667085] hover:text-[#1F2937] transition-colors hidden sm:block">
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
        {/* Subtle green glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#EFF8F1] rounded-full blur-[120px] opacity-60 pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EFF8F1] border border-[#DDF2E3] text-sm font-medium text-[#2E7D5B] mb-8">
            <Sparkles className="w-4 h-4" />
            Private. Safe. Built for students.
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-6xl md:text-7xl font-display font-semibold tracking-tight leading-[1.08] text-[#1F2937] mb-6">
            AI-powered support<br />
            <span className="text-[#2E7D5B]">for student wellbeing.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-[#667085] max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            MannMitra helps you understand stress, organize responsibilities, reflect securely, and access real human support — without the friction.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-base rounded-full w-full sm:w-auto" asChild>
              <Link href="/auth/register">Start your journey</Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-base rounded-full w-full sm:w-auto" asChild>
              <Link href="/auth/login">Log in as Guest</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-16">
            <a href="#features" className="inline-flex flex-col items-center gap-2 text-sm text-[#98A2B3] hover:text-[#667085] transition-colors">
              <span>Explore features</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Feature: Privacy ─── */}
      <section id="features" className="py-28 bg-[#F7FBF8]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#DDF2E3] mb-6">
                <Shield className="w-6 h-6 text-[#2E7D5B]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-semibold text-[#1F5D43] tracking-tight mb-5">
                Absolute Privacy.<br />No compromises.
              </h2>
              <p className="text-lg text-[#667085] leading-relaxed mb-8">
                Your conversations, planners, and journals are encrypted and private. We don't sell data, we don't track you, and you can always remain completely anonymous.
              </p>
              <ul className="space-y-3">
                {["No data is ever sold", "Anonymous usage supported", "You control your data", "Campus-grade security"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[#475467]">
                    <CheckCircle className="w-5 h-5 text-[#2E7D5B] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp}>
              {/* Decorative product mockup */}
              <div className="aspect-[4/3] bg-white rounded-3xl border border-[#E4EDE7] shadow-[0_2px_32px_rgba(30,80,60,0.07)] p-8 flex flex-col justify-between">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#EFF8F1] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#2E7D5B]" />
                  </div>
                  <span className="text-sm font-semibold text-[#1F2937]">Privacy Mode: Active</span>
                  <span className="ml-auto px-2.5 py-1 text-xs rounded-full bg-[#DDF2E3] text-[#1F5D43] font-medium">Secure</span>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-[#EFF8F1] rounded-full w-full"></div>
                  <div className="h-3 bg-[#EFF8F1] rounded-full w-4/5"></div>
                  <div className="h-3 bg-[#DDF2E3] rounded-full w-3/4"></div>
                  <div className="h-3 bg-[#EFF8F1] rounded-full w-full"></div>
                  <div className="h-3 bg-[#EFF8F1] rounded-full w-2/3"></div>
                </div>
                <div className="mt-8 flex items-center justify-between text-sm text-[#98A2B3]">
                  <span>End-to-end encrypted</span>
                  <span className="text-[#4FA477] font-medium">✓ Protected</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Feature: Mitra AI ─── */}
      <section className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center"
          >
            <motion.div variants={fadeInUp} className="order-2 lg:order-1">
              {/* Mitra Chat Mockup */}
              <div className="bg-white rounded-3xl border border-[#E4EDE7] shadow-[0_2px_32px_rgba(30,80,60,0.07)] p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-[#EEF3EF]">
                  <div className="w-9 h-9 rounded-full bg-[#DDF2E3] flex items-center justify-center">
                    <Brain className="w-5 h-5 text-[#2E7D5B]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1F2937]">Mitra</p>
                    <p className="text-xs text-[#98A2B3]">Always here for you</p>
                  </div>
                </div>
                <div className="bg-[#EFF8F1] px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm text-[#1F2937] leading-relaxed">
                  It sounds like midterms are piling up. Let's break down that essay first — what topic are you covering?
                </div>
                <div className="bg-[#2E7D5B] text-white px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] ml-auto text-sm leading-relaxed">
                  I just don't know where to start. It feels overwhelming.
                </div>
                <div className="bg-[#EFF8F1] px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] text-sm text-[#1F2937] leading-relaxed">
                  That's completely understandable. Let's make it smaller. What's the one thing you DO know about this topic?
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#DDF2E3] mb-6">
                <Brain className="w-6 h-6 text-[#2E7D5B]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-semibold text-[#1F5D43] tracking-tight mb-5">
                Meet Mitra.<br />Always here.
              </h2>
              <p className="text-lg text-[#667085] leading-relaxed">
                An empathetic AI companion trained to listen, validate your feelings, and help organize your thoughts. Mitra doesn't diagnose — it holds space for you when you need it most.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Footer ─── */}
      <section className="py-28 bg-[#1F5D43] text-white text-center px-6">
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
          <motion.p variants={fadeInUp} className="text-lg text-white/70 mb-10">
            Join thousands of students who use MannMitra to take care of their mind.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-10 text-base rounded-full bg-[#DDF2E3] text-[#1F5D43] hover:bg-white w-full sm:w-auto font-semibold" asChild>
              <Link href="/auth/register">Join MannMitra — It's Free</Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-base rounded-full text-white hover:bg-white/10 w-full sm:w-auto" asChild>
              <Link href="/auth/login">Log in as Guest</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 bg-white border-t border-[#EEF3EF] text-center text-sm text-[#98A2B3]">
        <p>© 2026 MannMitra. Private & Secure. Built with care for students.</p>
      </footer>

    </div>
  );
}
