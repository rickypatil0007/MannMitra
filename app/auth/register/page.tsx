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
import { AuthFormWrapper, AuthSection } from "@/frontend/components/ui/animated";
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
          Create Account
        </h2>
        <p className="text-[var(--text-secondary)] mt-1.5 text-sm">
          Join MannMitra to start your wellness journey.
        </p>
      </AuthSection>

      <AuthSection>
        <form onSubmit={handleRegister} className="space-y-4">
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
              <label className="text-sm font-medium text-[var(--text-primary)]">{field.label}</label>
              <Input
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                required
                minLength={field.type === "password" ? 6 : undefined}
                className="h-12 bg-[var(--surface-secondary)] border-[var(--border)] focus:border-[var(--primary)] transition-all duration-200"
              />
              {field.type === "password" && (
                <p className="text-xs text-[var(--text-muted)] pt-1">Must be at least 6 characters.</p>
              )}
            </motion.div>
          ))}

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 rounded-xl bg-[var(--danger-soft)] border border-[#FECACA] text-sm text-[var(--danger)]"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 mb-4 border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--surface)]">
            <button
              type="button"
              onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
              className="w-full flex items-center justify-between p-4 bg-[var(--surface-secondary)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <Shield className="w-4 h-4 text-[var(--primary)]" />
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
                  <div className="p-4 space-y-3 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
                    <p className="leading-relaxed">
                      Your consent is requested before collecting information used to provide MannMitra services.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link href="/privacy" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline">
                        Privacy Policy <ExternalLink className="w-3 h-3" />
                      </Link>
                      <Link href="/consent" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline">
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
              className="w-4 h-4 mt-0.5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] bg-[var(--surface-secondary)] cursor-pointer"
              required
            />
            <label htmlFor="consent-checkbox" className="text-sm text-[var(--text-secondary)] leading-tight cursor-pointer">
              I consent to the collection and use of my information for providing MannMitra services.
            </label>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full h-11" disabled={isLoading || !email || !password || !name || !hasConsent}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
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
            <Button type="button" variant="outline" className="w-full h-11" onClick={handleGuestLogin} disabled={isLoading}>
              Sign in as Guest
            </Button>
          </motion.div>
        </form>
      </AuthSection>

      <AuthSection>
        <p className="text-sm text-center text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link href="/auth/student/login" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">
            Sign In
          </Link>
        </p>
      </AuthSection>
    </AuthFormWrapper>
  );
}
