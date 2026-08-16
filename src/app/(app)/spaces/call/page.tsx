"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function CallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomUrl = searchParams.get("room");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no room URL is provided, redirect back
    if (!roomUrl) {
      router.push("/community/matching");
    }
  }, [roomUrl, router]);

  if (!roomUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col font-display">
      {/* Top Bar overlaying the iframe slightly */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Leave
          </Button>
          <div>
            <h1 className="text-white text-lg font-semibold tracking-tight leading-none">Anonymous Peer Session</h1>
            <p className="text-gray-300 font-medium text-xs mt-1">End-to-end encrypted</p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          className="gap-2 bg-red-600/90 hover:bg-red-700 text-white pointer-events-auto border-none"
          onClick={() => {
            alert("SOS Alert Triggered. Disconnecting and notifying support team.");
            router.push("/safety");
          }}
        >
          <ShieldAlert className="w-4 h-4" /> SOS
        </Button>
      </div>

      {/* Daily.co Prebuilt iframe */}
      <div className="flex-1 w-full h-full relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] z-0">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
            <p className="text-gray-400">Connecting to secure room...</p>
          </div>
        )}
        <iframe
          src={roomUrl}
          allow="camera; microphone; fullscreen; speaker; display-capture"
          className="w-full h-full border-none z-10 relative"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}

export default function PeerCallPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)] mb-4" />
        <p className="text-gray-400">Loading secure environment...</p>
      </div>
    }>
      <CallContent />
    </Suspense>
  );
}
