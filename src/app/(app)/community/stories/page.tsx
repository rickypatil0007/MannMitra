"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader, Badge } from "@/components/ui/shared";
import { ArrowLeft, ExternalLink, GraduationCap, Quote, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <Link href="/community" className="inline-flex items-center gap-2 text-sm text-[#667085] hover:text-[#1F2937] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>
      
      <PageHeader 
        title="Senior & Alumni Stories" 
        description="Real experiences. Because failure is not the end of the journey."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {stories.map((story) => (
            <Card key={story.id} className="hover:shadow-[0_2px_16px_rgba(30,80,60,0.07)] transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="muted">{story.category}</Badge>
                  <span className="text-xs text-[#98A2B3]">{story.reads} reads</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-[#1F2937] mb-2 group-hover:text-[#2E7D5B] transition-colors">{story.title}</h3>
                <p className="text-sm text-[#667085] leading-relaxed mb-4">{story.preview}</p>
                <div className="flex items-center justify-between border-t border-[#EEF3EF] pt-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#4FA477]" />
                    <span className="text-xs font-semibold text-[#1F2937]">{story.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#2E7D5B] hover:text-[#1F5D43]">
                    Read Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="bg-[#1F2937] text-white border-transparent">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold font-display">Share your journey</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Your setbacks and successes can help current students navigate their own challenges.
              </p>
              <Button className="w-full bg-white text-[#1F2937] hover:bg-white/90">
                Submit a Story
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#D4A45B]" /> Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Failure & Recovery', 'Internships', 'Mental Health', 'Career Pivots'].map(c => (
                <div key={c} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F7FBF8] cursor-pointer transition-colors">
                  <span className="text-sm text-[#475467] font-medium">{c}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#98A2B3]" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
