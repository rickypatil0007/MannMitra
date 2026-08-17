"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff, Video, VideoOff, Brain, Sparkles, Loader2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatContext } from "@/components/chat/chat-provider";
import { useRouter } from "next/navigation";

export default function MitraCallPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChatContext();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true); // AI Voice
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Speak AI Response
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && !isLoading && isSessionActive && isAudioEnabled) {
      if (synthRef.current) {
        // Cancel any ongoing speech
        synthRef.current.cancel();
        
        // Strip out tool invocation json or markdown syntax if needed
        const cleanContent = lastMessage.content.replace(/\*/g, "").replace(/\[.*?\]/g, "");
        if (cleanContent.trim()) {
          const utterance = new SpeechSynthesisUtterance(cleanContent);
          utterance.rate = 0.95; // Slightly slower, calmer voice
          utterance.pitch = 1.0;
          
          // Try to find a good female/calm voice if available
          const voices = synthRef.current.getVoices();
          const preferredVoice = voices.find(v => v.name.includes("Google UK English Female") || v.name.includes("Samantha") || v.name.includes("Female"));
          if (preferredVoice) utterance.voice = preferredVoice;

          synthRef.current.speak(utterance);
        }
      }
    }
  }, [messages, isLoading, isSessionActive, isAudioEnabled]);

  // Setup Web Speech API for listening
  useEffect(() => {
    if (typeof window !== "undefined" && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      let finalTranscript = "";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        // Automatically restart listening if session is active and mic is unmuted
        if (isSessionActive && isMicEnabled) {
          try { recognition.start(); } catch (e) {}
        }
      };
      
      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            
            // Send to AI
            if (finalTranscript.trim()) {
               append({ role: "user", content: finalTranscript.trim() });
               finalTranscript = ""; // Reset for next sentence
            }
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        // Update input field visually to show we are hearing them
        if (interimTranscript) {
          handleInputChange({ target: { value: interimTranscript } } as any);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isSessionActive, isMicEnabled, append, handleInputChange]);

  const startSession = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsSessionActive(true);
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error("Failed to access media devices", err);
      alert("Please allow camera and microphone access to start the visual session.");
    }
  };

  const endSession = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSessionActive(false);
    router.push("/mitra");
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMicEnabled;
      });
      setIsMicEnabled(!isMicEnabled);
      
      if (isMicEnabled && recognitionRef.current) {
        recognitionRef.current.stop();
      } else if (!isMicEnabled && recognitionRef.current && isSessionActive) {
        try { recognitionRef.current.start(); } catch(e) {}
      }
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-5rem)] flex flex-col relative overflow-hidden -mx-4 sm:mx-0 sm:rounded-2xl bg-black">
      
      {!isSessionActive ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-[var(--surface-ai)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-soft"
          >
            <Sparkles className="w-10 h-10 text-[var(--accent-ai)]" />
          </motion.div>
          <h2 className="text-2xl font-display font-bold text-white mb-2">Visual-Talking Mode</h2>
          <p className="text-gray-400 max-w-md mb-8 text-sm">
            Experience an immersive, hands-free conversation with Mitra. Allow camera and microphone access to begin. This session is entirely private.
          </p>
          <Button onClick={startSession} className="h-12 px-8 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-hover)] transition-all">
            Start Session
          </Button>
        </div>
      ) : (
        <>
          {/* Main Layout: AI Visualizer + User Camera */}
          <div className="flex-1 flex flex-col md:flex-row relative">
            
            {/* AI Visualizer (Left/Top) */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-black to-slate-950">
              
              {/* Dynamic glowing orb based on AI state */}
              <motion.div
                animate={
                  isLoading 
                    ? { scale: [1, 1.2, 1], rotate: 180, opacity: [0.5, 0.8, 0.5] } 
                    : { scale: [1, 1.05, 1], rotate: 0, opacity: 0.6 }
                }
                transition={{ duration: isLoading ? 2 : 4, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute w-64 h-64 md:w-96 md:h-96 rounded-full blur-[100px] ${isLoading ? 'bg-[var(--accent-ai)]' : 'bg-slate-700'}`}
              />
              
              <div className="z-10 flex flex-col items-center text-center">
                <Brain className={`w-16 h-16 mb-6 ${isLoading ? 'text-white animate-pulse' : 'text-gray-500'}`} />
                <p className="text-xl font-medium text-white/90 max-w-lg min-h-[60px] leading-relaxed">
                  {messages[messages.length - 1]?.role === "assistant" 
                    ? messages[messages.length - 1].content 
                    : (isLoading ? "Thinking..." : "I'm listening...")}
                </p>
              </div>

            </div>

            {/* User Camera PiP (Right/Bottom) */}
            <div className="h-1/3 md:h-full md:w-1/3 bg-black border-t md:border-t-0 md:border-l border-white/10 relative overflow-hidden flex items-center justify-center">
              {isVideoEnabled ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover scale-x-[-1]" // Mirrored
                />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <VideoOff className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">Camera Disabled</p>
                </div>
              )}
              
              {/* Live Captioning overlay */}
              <AnimatePresence>
                {input && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-white/90 text-sm text-center"
                  >
                    "{input}"
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Controls Dock */}
          <div className="h-20 shrink-0 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-4 px-6 z-20">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleMic}
              className={`h-12 w-12 rounded-full border-0 ${isMicEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
            >
              {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleVideo}
              className={`h-12 w-12 rounded-full border-0 ${isVideoEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`h-12 w-12 rounded-full border-0 ${isAudioEnabled ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}`}
              title="Toggle AI Voice"
            >
              {isAudioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>

            <Button 
              variant="destructive" 
              size="icon" 
              onClick={endSession}
              className="h-12 w-16 rounded-full ml-2 hover:bg-red-600 transition-colors"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}

    </div>
  );
}
