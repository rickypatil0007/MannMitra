"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, MessageSquare, ArrowLeft, User, ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { triggerSOS } from "@/actions/support";

export default function SafetyPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSOS = async () => {
    if (!user || user.isAnonymous) {
      alert("Guest Mode: You do not have trusted contacts saved. Please use the direct call buttons below for immediate help.");
      return;
    }
    
    setTriggering(true);
    
    // Attempt to get location if possible, otherwise send without
    let locationStr = "Location unavailable";
    try {
      if (navigator.geolocation) {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        locationStr = `${pos.coords.latitude}, ${pos.coords.longitude}`;
      }
    } catch (e) {
      console.log("Could not get location", e);
    }

    const res = await triggerSOS(user.uid, locationStr);
    
    setTriggering(false);
    if (res.success) {
      setSosTriggered(true);
      // In a real app, this would trigger an SMS backend service via webhook
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--text-primary)] flex flex-col">
      {/* Back link */}
      <div className="p-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to app
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-lg mx-auto w-full -mt-8">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors ${sosTriggered ? 'bg-green-100' : 'bg-[var(--danger-soft)]'}`}>
          {sosTriggered ? (
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          ) : (
            <span className="text-3xl">🆘</span>
          )}
        </div>

        <h1 className="text-4xl font-display font-semibold tracking-tight mb-3 leading-tight text-[var(--text-primary)]">
          {sosTriggered ? "Help is on the way." : "You are not alone."}
        </h1>
        <p className="text-[var(--text-secondary)] text-lg mb-12 leading-relaxed">
          {sosTriggered 
            ? "Your trusted contacts have been notified. Please stay safe, and call emergency services if you are in immediate physical danger."
            : "Choose how you want help right now. It's okay to reach out."}
        </p>

        {/* Actions */}
        <div className="w-full space-y-3 mb-8">
          <a
            href="tel:112"
            className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-[var(--danger)] text-[var(--primary-foreground)] font-semibold text-lg hover:bg-[#D45A6A] transition-colors shadow-[0_4px_20px_rgba(233,106,122,0.2)]"
          >
            <span className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              Call Emergency Services
            </span>
            <span className="text-[var(--primary-foreground)]/70 text-base font-normal">112 / 911</span>
          </a>
          
          {!sosTriggered && (
            <button
              onClick={handleSOS}
              disabled={triggering}
              className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-[var(--danger-soft)] text-[var(--danger)] font-semibold text-lg hover:bg-[#FECACA] transition-colors border border-red-200"
            >
              <span className="flex items-center gap-3">
                {triggering ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldAlert className="w-6 h-6" />}
                Trigger Silent SOS
              </span>
              <span className="text-[var(--danger)]/70 text-base font-normal">Alert Contacts</span>
            </button>
          )}

          <a
            href="tel:9152987821"
            className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] font-semibold text-lg hover:bg-[var(--background-secondary)] transition-colors border border-[var(--border)]"
          >
            <span className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-[var(--primary)]" />
              iCall Crisis Helpline
            </span>
            <span className="text-[var(--text-muted)] text-base font-normal">iCall India</span>
          </a>

          <a
            href="sms:iCall"
            className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] font-semibold text-lg hover:bg-[var(--background-secondary)] transition-colors border border-[var(--border)]"
          >
            <span className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-[var(--primary)]" />
              Text a Crisis Line
            </span>
            <span className="text-[var(--text-muted)] text-base font-normal">iCall SMS</span>
          </a>

          <Link
            href="/support/contacts"
            className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-[var(--surface)] text-[var(--text-primary)] font-semibold text-lg hover:bg-[var(--background-secondary)] transition-colors border border-[var(--border)]"
          >
            <span className="flex items-center gap-3">
              <User className="w-6 h-6 text-[var(--primary)]" />
              Manage Trusted Contacts
            </span>
          </Link>
        </div>

        <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed mx-auto">
          Phone numbers shown are general crisis helplines. Your institution may have additional resources available in the Support tab.
        </p>
      </div>
    </div>
  );
}
