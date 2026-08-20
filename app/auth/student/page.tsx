"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/frontend/lib/firebase";
import { syncUser } from "@/backend/actions/user";
import { Button } from "@/frontend/components/ui/button";
import { AuthFormWrapper, AuthSection } from "@/frontend/components/ui/animated";
import { ArrowLeft, User, UserPlus, Sparkles, Loader2, Shield, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export default function StudentAuthChoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasConsent, setHasConsent] = useState(false);
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

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
          href="/auth/login"
          className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </AuthSection>

      <AuthSection>
        <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] tracking-tight">
          Student Portal
        </h2>
        <p className="text-[var(--text-secondary)] mt-1.5 text-sm">
          How would you like to access your sanctuary?
        </p>
      </AuthSection>

      <AuthSection className="space-y-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full h-12 justify-start gap-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)] shadow-soft"
            asChild
          >
            <Link href="/auth/register">
              <UserPlus className="w-5 h-5" />
              Register New Account
            </Link>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full h-12 justify-start gap-3 bg-[var(--surface)] hover:bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border)]"
            variant="outline"
            asChild
          >
            <Link href="/auth/student/login">
              <User className="w-5 h-5 text-[var(--text-secondary)]" />
              Login to Existing Account
            </Link>
          </Button>
        </motion.div>
      </AuthSection>

      <AuthSection>
        <div className="relative pt-2">
          <div className="absolute inset-0 flex items-center pt-2">
            <span className="w-full border-t border-[var(--border-subtle)]" />
          </div>
          <div className="relative flex justify-center text-xs pt-2">
            <span className="bg-[var(--background-primary)] px-3 text-[var(--text-muted)] uppercase tracking-wider">
              Or
            </span>
          </div>
        </div>
      </AuthSection>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-xl bg-[var(--danger-soft)] border border-[#FECACA] text-sm text-[var(--danger)]"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AuthSection>
        <div className="mt-4 border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--surface)]">
          <button
            type="button"
            onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
            className="w-full flex items-center justify-between p-4 bg-[var(--surface-secondary)] hover:bg-[var(--background-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-expanded={showPrivacyDetails}
            aria-controls="privacy-details-guest"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Shield className="w-4 h-4 text-[var(--primary)]" />
              Privacy, Consent & Data Protection
            </div>
            <motion.div animate={{ rotate: showPrivacyDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
            </motion.div>
          </button>

          <AnimatePresence>
            {showPrivacyDetails && (
              <motion.div
                id="privacy-details-guest"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-4 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
                  <div className="space-y-2">
                    <p className="leading-relaxed">
                      <strong className="text-[var(--text-primary)]">Data Collection & DPDP Act Notice:</strong>{" "}
                      Your consent is requested before collecting information used to provide MannMitra services.
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-[var(--text-primary)]">Security Practices:</strong> MannMitra applies
                      reasonable security practices to protect your information.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
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
      </AuthSection>

      <AuthSection>
        <div className="flex items-start gap-3 mb-2">
          <div className="flex items-center h-5">
            <input
              id="consent-checkbox-guest"
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] bg-[var(--surface-secondary)] cursor-pointer"
              required
              aria-required="true"
            />
          </div>
          <label htmlFor="consent-checkbox-guest" className="text-sm text-[var(--text-secondary)] leading-tight cursor-pointer">
            I have read the Privacy Notice and consent to the collection of my information for guest access.
          </label>
        </div>
      </AuthSection>

      <AuthSection>
        <motion.div whileHover={{ scale: hasConsent ? 1.02 : 1 }} whileTap={{ scale: hasConsent ? 0.98 : 1 }}>
          <Button
            onClick={handleGuestLogin}
            disabled={isLoading || !hasConsent}
            className="w-full h-12 justify-start gap-3 bg-[var(--surface-secondary)] hover:bg-[var(--primary-soft)] text-[var(--primary-hover)] border-transparent"
            variant="secondary"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
            )}
            {isLoading ? "Preparing Dashboard..." : "Continue as Guest"}
          </Button>
        </motion.div>
      </AuthSection>
    </AuthFormWrapper>
  );
}
