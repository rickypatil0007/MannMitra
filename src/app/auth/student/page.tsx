"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, UserPlus, Sparkles, Loader2 } from "lucide-react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { syncUser } from "@/actions/user";

export default function StudentAuthChoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const userCredential = await signInAnonymously(auth);
      await syncUser(userCredential.user.uid, null, "Guest User");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in as guest.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <Link href="/auth/login" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      
      <div>
        <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] tracking-tight">Student Portal</h2>
        <p className="text-[var(--text-secondary)] mt-1.5 text-sm">How would you like to access your sanctuary?</p>
      </div>

      <div className="space-y-4">
        <Button className="w-full h-12 justify-start gap-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] shadow-soft" asChild>
          <Link href="/auth/register">
            <UserPlus className="w-5 h-5" />
            Register New Account
          </Link>
        </Button>
        
        <Button className="w-full h-12 justify-start gap-3 bg-[var(--surface)] hover:bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border)]" variant="outline" asChild>
          <Link href="/auth/student/login">
            <User className="w-5 h-5 text-[var(--text-secondary)]" />
            Login to Existing Account
          </Link>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center pt-2">
          <span className="w-full border-t border-[var(--border-subtle)]" />
        </div>
        <div className="relative flex justify-center text-xs pt-2">
          <span className="bg-[var(--background-primary)] px-3 text-[var(--text-muted)] uppercase tracking-wider">Or</span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-[var(--danger-soft)] border border-[#FECACA] text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      <Button 
        onClick={handleGuestLogin}
        disabled={isLoading}
        className="w-full h-12 justify-start gap-3 bg-[var(--surface-secondary)] hover:bg-[var(--primary-soft)] text-[var(--primary-hover)] border-transparent" 
        variant="secondary"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-[var(--primary)]" />}
        {isLoading ? "Preparing Dashboard..." : "Continue as Guest"}
      </Button>
    </div>
  );
}
