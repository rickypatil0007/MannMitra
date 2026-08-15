"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader, Badge } from "@/components/ui/shared";
import { ArrowLeft, Users, Shield, MessagesSquare, CheckCircle2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const dimensions = [
  "Exam Stress", "Academic Pressure", "Homesickness", "Loneliness", "Project Stress", "Career Uncertainty"
];

export default function MatchingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [matched, setMatched] = useState(false);

  const toggle = (d: string) => {
    setSelected(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setMatched(true);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <Link href="/community" className="inline-flex items-center gap-2 text-sm text-[#667085] hover:text-[#1F2937] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[#EFF8F1] flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-[#2E7D5B]" />
        </div>
        <h1 className="text-3xl font-display font-semibold text-[#1F2937] tracking-tight">Peer Matching</h1>
        <p className="text-[#667085] mt-2">Find someone who understands exactly what you're going through. Completely anonymous and secure.</p>
      </div>

      {!matched && !searching && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">What are you struggling with?</CardTitle>
            <CardDescription>Select the topics you'd like to talk about. We'll match you with a peer experiencing similar challenges.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {dimensions.map(d => (
                <button
                  key={d}
                  onClick={() => toggle(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    selected.includes(d)
                      ? "bg-[#2E7D5B] text-white border-[#2E7D5B]"
                      : "bg-[#F7FBF8] text-[#667085] border-[#E4EDE7] hover:border-[#4FA477]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="bg-[#FFF6ED] border border-[#FFD9AE] rounded-xl p-4 flex gap-3 items-start">
              <Shield className="w-5 h-5 text-[#D4875B] shrink-0 mt-0.5" />
              <div className="text-sm text-[#7A4A1E]">
                <p className="font-semibold mb-1">Privacy First</p>
                <p className="opacity-80 leading-relaxed">Your mental health data is never exposed. Matching is done securely, and your identity remains completely anonymous during the conversation.</p>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              disabled={selected.length === 0}
              onClick={handleSearch}
            >
              Find a Match
            </Button>
          </CardContent>
        </Card>
      )}

      {searching && (
        <Card className="border-transparent shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#E4EDE7] border-t-[#2E7D5B] rounded-full animate-spin" />
            <p className="text-[#667085] font-medium">Finding someone who understands...</p>
          </CardContent>
        </Card>
      )}

      {matched && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border-[#DDF2E3] shadow-[0_4px_24px_rgba(46,125,91,0.1)]">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#EFF8F1] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#2E7D5B]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1F2937]">Match Found</h3>
                <p className="text-[#667085] mt-2 leading-relaxed max-w-sm mx-auto">
                  We found a peer who is also dealing with <strong>{selected.join(" and ")}</strong>. They are ready to chat anonymously.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button className="w-full gap-2 bg-[#2E7D5B] hover:bg-[#1E5C41] text-white" asChild>
                  <Link href="/spaces/call">
                    <Video className="w-4 h-4" /> Join Secure Video/Audio Call
                  </Link>
                </Button>
                <Button variant="outline" className="w-full gap-2 text-[#2E7D5B] border-[#2E7D5B] hover:bg-[#EFF8F1]">
                  <MessagesSquare className="w-4 h-4" /> Start Anonymous Text Chat
                </Button>
                <Button variant="ghost" className="text-[#667085]" onClick={() => setMatched(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

    </motion.div>
  );
}
