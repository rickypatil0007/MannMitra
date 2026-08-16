"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInAnonymously, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { syncUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, LogIn } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Ensure the user exists in Postgres on login as well
      await syncUser(userCredential.user.uid, email, userCredential.user.displayName || undefined);
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const userCredential = await signInAnonymously(auth);
      await syncUser(userCredential.user.uid, null, "Guest User");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in as guest. Make sure Anonymous Auth is enabled in Firebase.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const userCredential = await signInAnonymously(auth);
      await updateProfile(userCredential.user, { displayName: "Demo Student" });
      await syncUser(userCredential.user.uid, "student@demo.com", "Demo Student");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in as demo student.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <Link href="/auth/student" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      
      <div>
        <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] tracking-tight">Welcome Back</h2>
        <p className="text-[var(--text-secondary)] mt-1.5 text-sm">Log in to access your sanctuary.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Email</label>
          <Input 
            type="email" 
            placeholder="student@university.edu" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 bg-[var(--surface-secondary)] border-[var(--border)] focus:border-[var(--primary)]"
          />
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-primary)]">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-[var(--primary)] hover:underline">Forgot password?</Link>
          </div>
          <Input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 bg-[var(--surface-secondary)] border-[var(--border)] focus:border-[var(--primary)]"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[var(--danger-soft)] border border-[#FECACA] text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-11" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
        </Button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--surface)] px-2 text-[var(--text-secondary)]">Or continue with</span>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11" 
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            Demo Student
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full h-11" 
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            Guest User
          </Button>
        </div>
      </form>

      <p className="text-sm text-center text-[var(--text-secondary)]">
        Don't have an account?{" "}
        <Link href="/auth/register" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">
          Register here
        </Link>
      </p>
    </div>
  );
}
