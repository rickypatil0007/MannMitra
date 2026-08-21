"use client";

import Link from "next/link";
import { Button } from "@/frontend/components/ui/button";
import { Magnetic } from "@/frontend/components/ui/magnetic";
import { motion, useScroll, useTransform } from "framer-motion";
import { StaggerContainer } from "@/frontend/components/motion/StaggerContainer";
import { FadeIn } from "@/frontend/components/motion/FadeIn";
import { SlideUp } from "@/frontend/components/motion/SlideUp";
import { SplitText } from "@/frontend/components/motion/SplitText";
import { Sparkles, ShieldCheck, Brain, ArrowRight } from "lucide-react";
import { DailyMotivationCard } from "@/frontend/components/landing/DailyMotivationCard";
import { PrivacyMockUI } from "@/frontend/components/landing/PrivacyMockUI";
import { ChatMockUI } from "@/frontend/components/landing/ChatMockUI";

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  // Subtle parallax for the main content to sink slightly as you scroll down
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  // Parallax for feature blocks
  const yFeature1 = useTransform(scrollYProgress, [0.3, 0.6], ["10%", "0%"]);
  const yFeature2 = useTransform(scrollYProgress, [0.5, 0.8], ["10%", "0%"]);

  return (
    <div className="min-h-screen text-[var(--text-primary)] overflow-x-hidden bg-transparent relative isolate">

      {/* 🌙 Minimal Navigation */}
      <nav className="fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-8 md:px-12 h-24 flex items-center justify-between">
          <div className="font-display font-medium text-lg tracking-wide text-white opacity-90">
            MannMitra
          </div>
          <div className="flex items-center gap-8">
            <Link href="/auth/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* 🌙 Cinematic Editorial Hero (Two Column) */}
      <section className="relative min-h-screen pt-32 pb-24 px-8 md:px-12 flex items-center isolate">
        
        <motion.div
          className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          style={{ y: yContent }}
        >
          {/* Left Column: Text */}
          <StaggerContainer className="flex flex-col items-start text-left">
            
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-sm font-medium mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span>Your Safe Space</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-hero font-display font-normal text-white leading-[1.05] mb-6 drop-shadow-2xl">
                Life is hard.<br />
                You don't have to carry it <span className="text-[var(--primary)] font-medium">alone.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="text-body-lg text-white/70 max-w-[45ch] mb-10 leading-[1.6] font-light drop-shadow-md">
                A free, anonymous space for Indian students to talk, heal, and support each other.
              </p>
            </FadeIn>

            <FadeIn delay={0.6} className="flex flex-wrap items-center gap-6">
              <Magnetic>
                <Button size="lg" className="h-14 px-8 text-base font-medium rounded-full shadow-[0_4px_32px_rgba(249,115,22,0.3)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all hover:-translate-y-1" asChild>
                  <Link href="/auth/register">Start your journey</Link>
                </Button>
              </Magnetic>
              <Link href="/auth/guest" className="text-white/70 hover:text-white font-medium transition-colors">
                Log in as Guest
              </Link>
            </FadeIn>

          </StaggerContainer>

          {/* Right Column: Graphic */}
          <FadeIn delay={0.8} className="w-full relative z-10">
            <DailyMotivationCard />
          </FadeIn>
          
        </motion.div>
      </section>

      {/* 🌙 Scroll Spacer to allow environment viewing */}
      <div className="h-[50vh] lg:h-[100vh] relative z-0 pointer-events-none" />

      {/* 🌙 Features Sequence */}
      <section className="relative z-20 bg-gradient-to-b from-transparent to-[var(--sky-deep)] pt-32 lg:pt-64 pb-32 px-8 md:px-12">
        <div className="max-w-7xl mx-auto space-y-48">

          {/* Feature 1: Absolute Privacy */}
          <motion.div style={{ y: yFeature1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <StaggerContainer className="order-2 lg:order-1">
              <div className="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center mb-8 border border-[var(--primary)]/30">
                <ShieldCheck className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <h2 className="text-h2 font-display font-normal leading-[1.1] text-white mb-6">
                <SplitText text="Absolute privacy." />
                <span className="block text-[var(--primary)] mt-2">No compromises.</span>
              </h2>
              <SlideUp className="text-body-lg text-white/70 font-light leading-[1.6] max-w-[45ch] mb-8">
                Your thoughts and journals are encrypted. We don't sell data, we don't track you, and you can always remain completely anonymous. A truly safe space.
              </SlideUp>
              
              <div className="space-y-4">
                {[
                  "End-to-end encrypted journals",
                  "No tracking or analytics",
                  "Anonymous posting",
                  "Data stays yours forever"
                ].map((point, i) => (
                  <SlideUp key={i} delay={0.1 * i} className="flex items-center gap-3 text-white/80">
                    <div className="w-5 h-5 rounded-full bg-[var(--primary)]/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                    </div>
                    {point}
                  </SlideUp>
                ))}
              </div>
            </StaggerContainer>
            
            <FadeIn className="order-1 lg:order-2">
              <PrivacyMockUI />
            </FadeIn>
          </motion.div>

          {/* Feature 2: Meet Mitra */}
          <motion.div style={{ y: yFeature2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <ChatMockUI />
            </FadeIn>

            <StaggerContainer>
              <div className="w-12 h-12 rounded-full bg-[#A78BFA]/20 flex items-center justify-center mb-8 border border-[#A78BFA]/30">
                <Brain className="w-6 h-6 text-[#A78BFA]" />
              </div>
              <h2 className="text-h2 font-display font-normal leading-[1.1] text-white mb-6">
                <SplitText text="Meet Mitra." />
                <span className="block text-[#A78BFA] mt-2">Always here.</span>
              </h2>
              <SlideUp className="text-body-lg text-white/70 font-light leading-[1.6] max-w-[45ch]">
                An empathetic AI companion trained to listen, validate, and help you navigate academic stress and anxiety. Zero judgment, 24/7 support.
              </SlideUp>
            </StaggerContainer>
          </motion.div>

        </div>
      </section>

      {/* 🌙 Footer CTA */}
      <section className="py-32 bg-[var(--sky-deep)] text-center px-8 relative overflow-hidden z-20">
        <StaggerContainer className="max-w-3xl mx-auto relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 md:p-24 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-transparent opacity-50 rounded-[3rem]" />
          <h2 className="text-h2 font-display font-normal leading-[1.1] mb-8 text-white relative z-10">
            <SplitText text="Ready to take a deep breath?" />
          </h2>
          <SlideUp className="relative z-10 flex justify-center">
            <Magnetic>
              <Button size="lg" className="h-14 px-10 text-base font-medium rounded-full shadow-[0_4px_32px_rgba(249,115,22,0.4)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all hover:-translate-y-1 flex items-center gap-2" asChild>
                <Link href="/auth/register">
                  Join MannMitra — It's Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </Magnetic>
          </SlideUp>
        </StaggerContainer>
      </section>
    </div>
  );
}
