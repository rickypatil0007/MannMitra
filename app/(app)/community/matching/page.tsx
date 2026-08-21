"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";
import { Shield, MessagesSquare, CheckCircle2, Video, ArrowLeft, Users } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { findPeerMatch } from "@/backend/actions/matching";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

const dimensions = [
  "Exam Stress", "Academic Pressure", "Homesickness", "Loneliness", "Project Stress", "Career Uncertainty"
];

export default function MatchingPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const toggle = (d: string) => {
    setSelected(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const handleSearch = async () => {
    if (!user) return alert("Please log in first");
    
    setSearching(true);
    const res = await findPeerMatch(user.uid, selected);
    setSearching(false);
    
    if (res.success && res.match) {
      setMatched(true);
      setRoomId(res.match.roomId);
    } else {
      alert("Failed to find a match. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" as const }}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <Link href="/community" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-[var(--moonlit-cyan)]/20 border border-[var(--moonlit-cyan)]/30 shadow-[0_0_30px_rgba(121,175,194,0.15)] flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-[var(--moonlit-cyan)]" />
        </div>
        <h1 className="text-3xl font-display font-medium text-white tracking-tight">Peer Matching</h1>
        <p className="text-white/60 font-light mt-2">Find someone who understands exactly what you're going through. Completely anonymous and secure.</p>
      </div>

      {!matched && !searching && (
        <div className="border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-lg font-medium text-white tracking-tight">What are you struggling with?</h3>
            <p className="text-sm text-white/60 font-light mt-1">Select the topics you'd like to talk about. We'll match you with a peer experiencing similar challenges.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              {dimensions.map(d => (
                <button
                  key={d}
                  onClick={() => toggle(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    selected.includes(d)
                      ? "bg-[var(--moonlit-cyan)]/20 text-white border-[var(--moonlit-cyan)]/50 shadow-[0_0_15px_rgba(121,175,194,0.2)]"
                      : "bg-white/5 text-white/70 border-white/10 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="bg-[var(--accent-warm)]/10 border border-[var(--accent-warm)]/20 rounded-xl p-4 flex gap-3 items-start">
              <Shield className="w-5 h-5 text-[var(--accent-warm)] shrink-0 mt-0.5" />
              <div className="text-sm text-[var(--accent-warm)]/90">
                <p className="font-medium mb-1">Privacy First</p>
                <p className="opacity-80 font-light leading-relaxed">Your mental health data is never exposed. Matching is done securely, and your identity remains completely anonymous during the conversation.</p>
              </div>
            </div>

            <Button 
              className="w-full bg-[var(--moonlit-cyan)]/80 hover:bg-[var(--moonlit-cyan)] text-white shadow-lg" 
              size="lg" 
              disabled={selected.length === 0}
              onClick={handleSearch}
            >
              Find a Match
            </Button>
          </div>
        </div>
      )}

      {searching && (
        <div className="border-transparent shadow-none bg-transparent">
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-[var(--moonlit-cyan)] rounded-full animate-spin shadow-[0_0_15px_rgba(121,175,194,0.3)]" />
            <p className="text-white/70 font-light">Finding someone who understands...</p>
          </div>
        </div>
      )}

      {matched && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="border border-[var(--moonlit-cyan)]/30 bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(121,175,194,0.15)]">
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-[var(--moonlit-cyan)]/20 border border-[var(--moonlit-cyan)]/30 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(121,175,194,0.2)]">
                <CheckCircle2 className="w-8 h-8 text-[var(--moonlit-cyan)]" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-white">Match Found</h3>
                <p className="text-white/70 font-light mt-2 leading-relaxed max-w-sm mx-auto">
                  We found a peer who is also dealing with <strong className="text-white">{(selected.length > 0 ? selected : ["similar challenges"]).join(" and ")}</strong>. They are ready to chat anonymously.
                </p>
              </div>
              <div className="flex flex-col gap-3 pt-4">
                <Button className="w-full gap-2 bg-[var(--moonlit-cyan)] hover:bg-[var(--moonlit-cyan)]/90 text-white shadow-lg" asChild>
                  <Link href={`/spaces/call?room=${roomId ? encodeURIComponent(roomId) : ""}`}>
                    <Video className="w-4 h-4" /> Join Secure Video/Audio Call
                  </Link>
                </Button>
                <Button variant="outline" className="w-full gap-2 text-white bg-white/5 border-white/20 hover:bg-white/10">
                  <MessagesSquare className="w-4 h-4" /> Start Anonymous Text Chat
                </Button>
                <Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/5" onClick={() => setMatched(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
