"use client";

import Link from "next/link";
import { Button } from "@/frontend/components/ui/button";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function GuestPrompt({ feature, description }: { feature: string; description: string }) {
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsGuest(!!user?.isAnonymous);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || !isGuest) return null;

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[var(--background-primary)]/40 backdrop-blur-md p-6 rounded-2xl min-h-[500px]">
      <div className="max-w-md w-full bg-[var(--surface)] border border-[var(--border)] shadow-xl rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-[var(--primary-soft)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Lock className="w-8 h-8 text-[var(--primary)]" />
        </div>
        <h3 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-3 tracking-tight">
          Unlock {feature}
        </h3>
        <p className="text-[var(--text-secondary)] mb-8 leading-relaxed text-sm">
          {description}
        </p>
        <div className="space-y-3">
          <Button className="w-full h-12 text-base font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] rounded-xl" asChild>
            <Link href="/auth/register">Create Free Account</Link>
          </Button>
          <Button variant="outline" className="w-full h-12 text-base font-semibold border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--background-secondary)] rounded-xl" asChild>
            <Link href="/auth/student/login">Log In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
