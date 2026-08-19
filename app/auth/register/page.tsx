"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile, signInAnonymously } from "firebase/auth";
import { auth } from "@/frontend/lib/firebase";
import { syncUser } from "@/backend/actions/user";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { ArrowLeft, Loader2, UserPlus, Shield, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

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
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Sync to Postgres via Server Action
      await syncUser(userCredential.user.uid, email, name);
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
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

  return (
    <div className="space-y-6 relative">
      <Link href="/auth/student" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      
      <div>
        <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] tracking-tight">Create Account</h2>
        <p className="text-[var(--text-secondary)] mt-1.5 text-sm">Join MannMitra to start your wellness journey.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Full Name</label>
          <Input 
            type="text" 
            placeholder="John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-12 bg-[var(--surface-secondary)] border-[var(--border)] focus:border-[var(--primary)]"
          />
        </div>

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
          <label className="text-sm font-medium text-[var(--text-primary)]">Password</label>
          <Input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-12 bg-[var(--surface-secondary)] border-[var(--border)] focus:border-[var(--primary)]"
          />
          <p className="text-xs text-[var(--text-muted)] pt-1">Must be at least 6 characters.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[var(--danger-soft)] border border-[#FECACA] text-sm text-[var(--danger)]">
            {error}
          </div>
        )}

        {/* Privacy, Consent & Data Protection Notice */}
        <div className="mt-6 mb-4 border border-[var(--border-subtle)] rounded-xl overflow-hidden bg-[var(--surface)]">
          <button
            type="button"
            onClick={() => setShowPrivacyDetails(!showPrivacyDetails)}
            className="w-full flex items-center justify-between p-4 bg-[var(--surface-secondary)] hover:bg-[var(--background-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            aria-expanded={showPrivacyDetails}
            aria-controls="privacy-details"
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
            <div id="privacy-details" className="p-4 space-y-4 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)]">
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

        {/* Consent Checkbox */}
        <div className="flex items-start gap-3 mb-6">
          <div className="flex items-center h-5">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] bg-[var(--surface-secondary)] cursor-pointer"
              required
              aria-required="true"
            />
          </div>
          <label htmlFor="consent-checkbox" className="text-sm text-[var(--text-secondary)] leading-tight cursor-pointer">
            I have read the Privacy & Data Protection Notice and consent to the collection and use of my information for providing MannMitra services.
          </label>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isLoading || !email || !password || !name || !hasConsent}>
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[var(--border)]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--surface)] px-2 text-[var(--text-secondary)]">Or continue with</span>
          </div>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full h-11" 
          onClick={handleGuestLogin}
          disabled={isLoading}
        >
          Sign in as Guest
        </Button>
      </form>

      <p className="text-sm text-center text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link href="/auth/student/login" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );
}
