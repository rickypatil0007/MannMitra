"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";
import { PageHeader, Badge } from "@/frontend/components/ui/shared";
import { ArrowLeft, ExternalLink, GraduationCap, Quote, Trophy } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import Link from "next/link";

const stories = [
  {
    id: "1",
    author: "Rahul M. · Class of 2022",
    title: "From Academic Probation to Product Manager",
    category: "Failure & Recovery",
    preview: "I failed two core subjects in my second year. I thought my career was over before it started. Here's how I rebuilt my study habits and eventually landed at a top tech company.",
    reads: "1.2k"
  },
  {
    id: "2",
    author: "Sneha P. · Class of 2023",
    title: "Navigating Imposter Syndrome During Internships",
    category: "Career & Growth",
    preview: "Walking into my first internship, I felt like the admissions office made a mistake. Everyone seemed smarter. I wish someone told me that feeling is completely normal.",
    reads: "850"
  },
  {
    id: "3",
    author: "Anonymous Alumni",
    title: "Taking a Gap Semester for Mental Health",
    category: "Mental Health",
    preview: "The hardest decision I made in college was stepping away for six months. It was also the best decision. Here is what happened.",
    reads: "2.1k"
  }
];

export default function SeniorStoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-4xl"
    >
      <Link href="/community" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>
      
      <PageHeader 
        title="Senior & Alumni Stories" 
        description="Real experiences. Because failure is not the end of the journey."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {stories.map((story) => (
            <div key={story.id} className="border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden hover:border-[var(--moonlit-cyan)]/30 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(121,175,194,0.1)] transition-all duration-200 cursor-pointer group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="muted" className="bg-[var(--moonlit-cyan)]/10 text-[var(--moonlit-cyan)] border-[var(--moonlit-cyan)]/20">{story.category}</Badge>
                  <span className="text-xs text-white/40 font-light">{story.reads} reads</span>
                </div>
                <h3 className="text-xl font-display font-medium text-white mb-2 group-hover:text-[var(--moonlit-cyan)] transition-colors">{story.title}</h3>
                <p className="text-sm text-white/70 font-light leading-relaxed mb-4">{story.preview}</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-white/40" />
                    <span className="text-xs font-medium text-white/80">{story.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[var(--moonlit-cyan)] hover:text-white hover:bg-[var(--moonlit-cyan)]/20">
                    Read Story
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="border border-[var(--moonlit-cyan)]/30 bg-[var(--moonlit-cyan)]/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(121,175,194,0.1)]">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--moonlit-cyan)]/20 border border-[var(--moonlit-cyan)]/30 flex items-center justify-center mx-auto">
                <Quote className="w-6 h-6 text-[var(--moonlit-cyan)]" />
              </div>
              <h3 className="text-lg font-medium font-display text-white">Share your journey</h3>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                Your setbacks and successes can help current students navigate their own challenges.
              </p>
              <Button className="w-full bg-[var(--moonlit-cyan)] hover:bg-[var(--moonlit-cyan)]/90 text-white shadow-lg">
                Submit a Story
              </Button>
            </div>
          </div>

          <div className="border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden">
            <div className="px-6 pt-6 pb-2">
              <h3 className="text-base font-medium text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[var(--accent-warm)]" /> Top Categories
              </h3>
            </div>
            <div className="p-4 space-y-1">
              {['Failure & Recovery', 'Internships', 'Mental Health', 'Career Pivots'].map(c => (
                <div key={c} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group">
                  <span className="text-sm text-white/70 group-hover:text-white font-light transition-colors">{c}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
