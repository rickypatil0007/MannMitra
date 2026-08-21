"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from "@/frontend/lib/firebase";
import { syncUser } from "@/backend/actions/user";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncUser(userCredential.user.uid, email, userCredential.user.displayName || undefined);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to log in.";
      setError(message);
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
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to sign in as guest. Make sure Anonymous Auth is enabled in Firebase.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("guest") === "true") {
        handleGuestLogin();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-8 text-center relative flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors opacity-70 hover:opacity-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
        <h2 className="text-3xl font-display font-medium text-[var(--text-primary)] tracking-tight">
          Welcome Back
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm font-light">Log in to access your sanctuary.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <motion.div
          className="space-y-1.5"
          animate={{ scale: focusedField === "email" ? 1.01 : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <label className="text-sm font-medium text-[var(--text-secondary)]">Email</label>
          <Input
            type="email"
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            required
            className="h-12 bg-white/5 border-white/10 focus:border-white/30 text-white placeholder:text-white/20 transition-colors duration-200"
          />
        </motion.div>

        <motion.div
          className="space-y-1.5"
          animate={{ scale: focusedField === "password" ? 1.01 : 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
            <Link href="/auth/forgot-password" className="text-xs text-[var(--moonlit-cyan)] hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            required
            className="h-12 bg-white/5 border-white/10 focus:border-white/30 text-white placeholder:text-white/20 transition-colors duration-200"
          />
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="p-3 rounded-xl bg-[var(--state-crisis)]/20 border border-[var(--state-crisis)]/30 text-sm text-[var(--text-primary)]"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button type="submit" className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-white shadow-[0_0_24px_rgba(16,185,129,0.25)] hover:shadow-[0_0_32px_rgba(16,185,129,0.4)] border-none font-semibold transition-all duration-300" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </Button>
        </motion.div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-[var(--bg-surface)] px-3 text-[var(--text-secondary)]">Or continue with</span>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 bg-transparent hover:bg-white/5 border-white/10 text-white font-medium"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            Sign in as Guest
          </Button>
        </motion.div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--text-secondary)] font-light">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-[var(--moonlit-cyan)] hover:text-white transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl text-center"
      >
        <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase font-semibold tracking-wider">
          Demo Credentials
        </p>
        <p className="text-sm font-light text-white/70">student@demo.com</p>
        <p className="text-sm font-light text-white/70">demopassword123</p>
      </motion.div>
    </div>
  );
}
