"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff, Video, VideoOff, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";

export default function MitraCallPage() {
  const router = useRouter();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [mitraSpeaking, setMitraSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { messages, append, isLoading } = useChat({
    api: "/api/chat",
    onFinish: async (message) => {
      // When AI finishes generating text, call TTS
      playTTS(message.content);
    }
  });

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        
        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          
          if (event.results[0].isFinal) {
            if (currentTranscript.trim() && !isLoading && !mitraSpeaking) {
              append({ role: 'user', content: currentTranscript });
              setTranscript("");
            }
          }
        };
      }
    }

    // Load voices early
    if (typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, [append, isLoading, mitraSpeaking]);

  // Handle manual mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      recognitionRef.current?.stop();
    } else if (!mitraSpeaking && !isLoading) {
      try { recognitionRef.current?.start(); } catch(e) {}
    }
  };

  useEffect(() => {
    // Start listening initially if not muted and not speaking
    if (!isMuted && !mitraSpeaking && !isLoading && recognitionRef.current && !isListening) {
      try { recognitionRef.current.start(); } catch(e) {}
    }
  }, [isMuted, mitraSpeaking, isLoading, isListening]);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      const greeting = "Hi, I'm Mitra. I'm listening.";
      append({ role: 'assistant', content: greeting });
      playTTS(greeting);
    }
  }, [messages.length, append]);

  const playTTS = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a good female voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Female') || v.name.includes('Google UK English Female')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    
    utterance.onstart = () => setMitraSpeaking(true);
    utterance.onend = () => {
      setMitraSpeaking(false);
      // Automatically resume listening if not muted
      if (!isMuted && recognitionRef.current) {
        try { recognitionRef.current.start(); } catch (e) {}
      }
    };
    
    window.speechSynthesis.speak(utterance);
  };

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
          {mitraSpeaking ? "Mitra is speaking..." : isLoading ? "Mitra is thinking..." : isMuted ? "Your microphone is muted" : isListening ? "Listening..." : "Waiting..."}
        </div>
        
        {/* Subtitle / Live Transcript Display */}
        {transcript && !mitraSpeaking && !isLoading && (
          <div className="absolute bottom-24 w-full px-8 text-center">
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/80 text-lg font-medium"
            >
              "{transcript}"
            </motion.p>
          </div>
        )}
        
        <audio ref={audioRef} className="hidden" />
      </div>

      {/* Manual text input hidden but active if they want to type */}
      <div className="w-full max-w-sm mb-4">
         <form 
           onSubmit={(e) => {
             e.preventDefault();
             if (transcript.trim() && !isLoading && !mitraSpeaking) {
               append({ role: 'user', content: transcript });
               setTranscript("");
             }
           }}
           className="flex gap-2"
         >
           <input 
             type="text" 
             value={transcript}
             onChange={(e) => setTranscript(e.target.value)}
             placeholder="Type to speak (mocking voice input)" 
             className="flex-1 bg-[#1E4531] border border-[#2a5c43] rounded-full px-4 text-sm text-[#A8D3B7] placeholder:text-[#A8D3B7]/50 focus:outline-none"
             disabled={isLoading || mitraSpeaking}
           />
           <Button type="submit" size="icon" variant="secondary" disabled={isLoading || mitraSpeaking || !transcript.trim()} className="rounded-full bg-[#1E5C41] text-[#A8D3B7] hover:bg-[#2a5c43]">
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
           </Button>
         </form>
      </div>

      {/* Call Controls */}
      <div className="flex items-center justify-center gap-6 mb-8 bg-[#122b1e] px-8 py-5 rounded-[2rem] border border-[#1e4531] relative z-10">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMute}
          className={`w-14 h-14 rounded-full border-none ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-[#1E4531] text-[#A8D3B7] hover:bg-[#2a5c43]'}`}
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
