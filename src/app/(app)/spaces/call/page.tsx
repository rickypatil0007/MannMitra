"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff, Video, VideoOff, ShieldAlert, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PeerCallPage() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--text-primary)] flex flex-col font-display">
      {/* Top Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-start z-10 bg-gradient-to-b from-black/50 to-transparent">
        <div>
          <h1 className="text-[var(--primary-foreground)] text-xl font-semibold tracking-tight">Peer Session (Anonymous)</h1>
          <p className="text-gray-300 font-medium text-sm mt-1">
            {formatTime(callDuration)} • End-to-end encrypted
          </p>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          className="gap-2 bg-red-500/90 hover:bg-red-600 text-[var(--primary-foreground)] border border-red-400/50 backdrop-blur-md"
          onClick={() => {
            // In a real app, this would trigger an immediate SOS workflow
            alert("SOS Alert Triggered. Disconnecting and notifying support team.");
            router.back();
          }}
        >
          <ShieldAlert className="w-4 h-4" /> Emergency SOS
        </Button>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 w-full h-full relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-24 pb-32 max-w-6xl mx-auto">
        
        {/* Remote Peer Video */}
        <div className="relative w-full h-full bg-[#111827] rounded-3xl overflow-hidden border border-gray-700 shadow-2xl flex items-center justify-center">
          {/* Mock abstract gradient for anonymous peer */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-60" />
          
          <div className="relative flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-700">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium tracking-wide">Anonymous Peer</p>
          </div>
          
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <p className="text-[var(--primary-foreground)] text-sm font-medium">Peer (Camera Off)</p>
          </div>
        </div>

        {/* Local User Video */}
        <div className="relative w-full h-full bg-[#111827] rounded-3xl overflow-hidden border border-gray-700 shadow-2xl flex items-center justify-center">
          {isVideoOn ? (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
               <p className="text-gray-400 text-sm italic">Camera Feed Active</p>
            </div>
          ) : (
            <div className="relative flex flex-col items-center justify-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-4 border-gray-700">
                <User className="w-10 h-10 text-gray-500" />
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
            <p className="text-[var(--primary-foreground)] text-sm font-medium">You</p>
            {isMuted && <MicOff className="w-3.5 h-3.5 text-red-400" />}
          </div>
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 w-full p-8 flex justify-center items-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`w-14 h-14 rounded-full border border-gray-600 transition-all ${
            isVideoOn ? "bg-gray-700 text-[var(--primary-foreground)] hover:bg-gray-600" : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
          }`}
        >
          {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full border border-gray-600 transition-all ${
            !isMuted ? "bg-gray-700 text-[var(--primary-foreground)] hover:bg-gray-600" : "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
          }`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>

        <Button
          variant="destructive"
          size="icon"
          onClick={() => router.back()}
          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 ml-4"
        >
          <PhoneOff className="w-7 h-7" />
        </Button>
      </div>
    </div>
  );
}
