"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createUserWithEmailAndPassword, updateProfile, signInAnonymously } from "firebase/auth";
import { auth } from "@/frontend/lib/firebase";
import { syncUser } from "@/backend/actions/user";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { ArrowLeft, Loader2, Shield, ChevronDown, ExternalLink } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasConsent, setHasConsent] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await syncUser(userCredential.user.uid, email, name);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account.";
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
      const message = err instanceof Error ? err.message : "Failed to sign in as guest.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-8 text-center relative flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
          <Link
            href="/auth/student"
            className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors opacity-70 hover:opacity-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
        <h2 className="text-3xl font-display font-medium text-[var(--text-primary)] tracking-tight">
          Create Account
        </h2>
        <p className="text-[var(--text-secondary)] mt-2 text-sm font-light">
          Join MannMitra to start your wellness journey.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        {[
          { label: "Full Name", type: "text", placeholder: "John Doe", value: name, setter: setName },
          { label: "Email", type: "email", placeholder: "student@university.edu", value: email, setter: setEmail },
          { label: "Password", type: "password", placeholder: "••••••••", value: password, setter: setPassword },
        ].map((field, i) => (
          <motion.div
            key={field.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="space-y-1.5"
          >
            <label className="text-sm font-medium text-[var(--text-secondary)]">{field.label}</label>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              required
              minLength={field.type === "password" ? 6 : undefined}
              className="h-12 bg-white/5 border-white/10 focus:border-white/30 text-white placeholder:text-white/20 transition-all duration-200"
            />
            {field.type === "password" && (
              <p className="text-xs text-white/30 pt-1 font-light">Must be at least 6 characters.</p>
            )}
          </motion.div>
        ))}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-xl bg-[var(--state-crisis)]/20 border border-[var(--state-crisis)]/30 text-sm text-[var(--text-primary)]"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 mb-4 border border-white/10 rounded-xl overflow-hidden bg-white/5">
          <button
            type="button"
            onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
              <Shield className="w-4 h-4 text-[var(--moonlit-cyan)]" />
              Privacy, Consent & Data Protection
            </div>
            <motion.div animate={{ rotate: showPrivacyDetails ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
            </motion.div>
          </button>
          <AnimatePresence>
            {showPrivacyDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3 text-sm text-white/60 font-light border-t border-white/10">
                  <p className="leading-relaxed">
                    Your consent is requested before collecting information used to provide MannMitra services.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/privacy" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--moonlit-cyan)] hover:underline">
                      Privacy Policy <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link href="/consent" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--moonlit-cyan)] hover:underline">
                      Data & Consent Info <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={hasConsent}
            onChange={(e) => setHasConsent(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-white/20 text-[var(--moonlit-cyan)] focus:ring-[var(--moonlit-cyan)] bg-white/5 cursor-pointer"
            required
          />
          <label htmlFor="consent-checkbox" className="text-sm text-white/60 font-light leading-tight cursor-pointer">
            I consent to the collection and use of my information for providing MannMitra services.
          </label>
        </div>

        <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
          <Button type="submit" className="w-full h-12 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] hover:shadow-[0_0_32px_rgba(99,102,241,0.4)] border-none font-semibold transition-all duration-300" disabled={isLoading || !email || !password || !name || !hasConsent}>
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
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
          <Button type="button" variant="outline" className="w-full h-12 bg-transparent hover:bg-white/5 border-white/10 text-white font-medium" onClick={handleGuestLogin} disabled={isLoading}>
            Sign in as Guest
          </Button>
        </motion.div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--text-secondary)] font-light">
          Already have an account?{" "}
          <Link href="/auth/student/login" className="font-medium text-[var(--moonlit-cyan)] hover:text-white transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
