"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff, Video, VideoOff, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MitraCallPage() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [mitraSpeaking, setMitraSpeaking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate Mitra speaking intermittently
  useEffect(() => {
    const interval = setInterval(() => {
      setMitraSpeaking((prev) => !prev);
    }, 4000); // Toggles every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A1912] flex flex-col items-center justify-between py-12 px-4 font-display">
      {/* Header Info */}
      <div className="text-center space-y-2 mt-8">
        <h1 className="text-[var(--primary-foreground)] text-3xl font-semibold tracking-tight">Mitra AI</h1>
        <p className="text-[#8BBF9F] font-medium tracking-widest uppercase text-sm">
          {formatTime(callDuration)}
        </p>
      </div>

      {/* Center Avatar / Orb */}
      <div className="flex-1 flex items-center justify-center w-full relative">
        <div className="relative flex items-center justify-center">
          {/* Pulsating background rings when Mitra is speaking */}
          <AnimatePresence>
            {mitraSpeaking && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-48 h-48 rounded-full bg-[var(--primary)] blur-xl"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute w-40 h-40 rounded-full bg-[var(--primary-soft)] blur-md"
                />
              </>
            )}
          </AnimatePresence>

          {/* Main Orb */}
          <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#1E5C41] to-[#0F3624] border border-[var(--primary)] flex items-center justify-center shadow-2xl z-10 overflow-hidden">
             {/* Dynamic inner glow */}
             <motion.div 
                className="absolute inset-0 bg-[var(--surface)]/10"
                animate={{ opacity: mitraSpeaking ? [0.2, 0.5, 0.2] : 0.1 }}
                transition={{ duration: 1, repeat: Infinity }}
             />
             <Brain className="w-12 h-12 text-[#A8D3B7] relative z-10" />
          </div>
        </div>

        {/* User Status indicator */}
        <div className="absolute bottom-10 text-center w-full text-[#8BBF9F] text-sm animate-pulse">
          {mitraSpeaking ? "Mitra is speaking..." : isMuted ? "Your microphone is muted" : "Listening..."}
        </div>
      </div>

      {/* Call Controls */}
      <div className="flex items-center gap-6 mb-8 bg-[#122b1e] px-8 py-5 rounded-[2rem] border border-[#1e4531]">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`w-14 h-14 rounded-full border-none transition-all ${
            isVideoOn ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[#1E5C41]" : "bg-[#1E4531] text-[#A8D3B7] hover:bg-[#2a5c43]"
          }`}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full border-none transition-all ${
            isMuted ? "bg-[var(--surface)] text-black hover:bg-gray-200" : "bg-[#1E4531] text-[#A8D3B7] hover:bg-[#2a5c43]"
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={() => router.back()}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
        >
          <PhoneOff className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}
