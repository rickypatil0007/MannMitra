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
import { AuthFormWrapper, AuthSection } from "@/frontend/components/ui/animated";
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
    <AuthFormWrapper>
      <AuthSection>
        <Link
          href="/auth/student"
          className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </AuthSection>

      <AuthSection>
        <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] tracking-tight">
          Welcome Back
        </h2>
        <p className="text-[var(--text-secondary)] mt-1.5 text-sm">Log in to access your sanctuary.</p>
      </AuthSection>

      <AuthSection>
        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div
            className="space-y-1.5"
            animate={{ scale: focusedField === "email" ? 1.01 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <label className="text-sm font-medium text-[var(--text-primary)]">Email</label>
            <Input
              type="email"
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              required
              className="h-12 bg-[var(--surface-secondary)] border-[var(--border)] focus:border-[var(--primary)] transition-all duration-200"
            />
          </motion.div>

          <motion.div
            className="space-y-1.5"
            animate={{ scale: focusedField === "password" ? 1.01 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">Password</label>
              <Link href="/auth/forgot-password" className="text-xs text-[var(--primary)] hover:underline">
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
              className="h-12 bg-[var(--surface-secondary)] border-[var(--border)] focus:border-[var(--primary)] transition-all duration-200"
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="p-3 rounded-xl bg-[var(--danger-soft)] border border-[#FECACA] text-sm text-[var(--danger)]"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </Button>
          </motion.div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--surface)] px-2 text-[var(--text-secondary)]">Or continue with</span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 mt-4"
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              Sign in as Guest
            </Button>
          </motion.div>
        </form>
      </AuthSection>

      <AuthSection>
        <p className="text-sm text-center text-[var(--text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            Register here
          </Link>
        </p>
      </AuthSection>

      <AuthSection>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl text-center hover-lift"
        >
          <p className="text-xs text-[var(--text-secondary)] mb-1 uppercase font-semibold tracking-wider">
            Demo Credentials
          </p>
          <p className="text-sm font-medium text-[var(--text-primary)]">student@demo.com</p>
          <p className="text-sm font-medium text-[var(--text-primary)]">demopassword123</p>
        </motion.div>
      </AuthSection>
    </AuthFormWrapper>
  );
}
