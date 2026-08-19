"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { ArrowLeft, User, UserPlus, Sparkles, Loader2, Shield, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "@/frontend/lib/firebase";
import { syncUser } from "@/backend/actions/user";

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

      {/* Privacy, Consent & Data Protection Notice for Guest */}
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
          {showPrivacyDetails ? (
            <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
          )}
        </button>
        
        {showPrivacyDetails && (
          <div id="privacy-details-guest" className="p-4 space-y-4 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
            <div className="space-y-2">
              <p className="leading-relaxed">
                <strong className="text-[var(--text-primary)]">Data Collection & DPDP Act Notice:</strong> Your consent is requested before collecting information used to provide MannMitra services. You may withdraw consent where applicable. MannMitra is designed to provide clear notice about how personal information is used and to apply reasonable safeguards to protect it.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[var(--text-primary)]">Security Practices:</strong> MannMitra is designed to apply reasonable security practices to protect personal and sensitive information and to limit access to authorized systems and services.
              </p>
              <p className="leading-relaxed">
                <strong className="text-[var(--text-primary)]">Managing Consent:</strong> You can manage or withdraw your consent at any time from your account settings, subject to legal and operational requirements.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/privacy" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline focus:outline-none focus:ring-1 focus:ring-[var(--primary)] rounded">
                Privacy Policy <ExternalLink className="w-3 h-3" />
              </Link>
              <Link href="/consent" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline focus:outline-none focus:ring-1 focus:ring-[var(--primary)] rounded">
                Data & Consent Info <ExternalLink className="w-3 h-3" />
              </Link>
              <Link href="/support" className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline focus:outline-none focus:ring-1 focus:ring-[var(--primary)] rounded">
                Privacy Support <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}
      </div>

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

      <Button 
        onClick={handleGuestLogin}
        disabled={isLoading || !hasConsent}
        className="w-full h-12 justify-start gap-3 bg-[var(--surface-secondary)] hover:bg-[var(--primary-soft)] text-[var(--primary-hover)] border-transparent" 
        variant="secondary"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-[var(--primary)]" />}
        {isLoading ? "Preparing Dashboard..." : "Continue as Guest"}
      </Button>
    </div>
  );
}
