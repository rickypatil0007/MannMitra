"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Link href="/auth/register" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Registration
      </Link>
      
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-8 h-8 text-[var(--primary)]" />
        <h1 className="text-3xl font-display font-semibold text-[var(--text-primary)]">Privacy & Data Protection Notice</h1>
      </div>
      
      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed bg-[var(--surface)] p-8 rounded-2xl border border-[var(--border-subtle)] shadow-sm">
        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Data Collection & DPDP Act, 2023 Notice</h2>
          <p>
            Your consent is requested before collecting information used to provide MannMitra services. You may withdraw consent where applicable. MannMitra is designed to provide clear notice about how personal information is used and to apply reasonable safeguards to protect it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Security Practices (IT Act 43A + SPDI Rules)</h2>
          <p>
            MannMitra is designed to apply reasonable security practices to protect personal and sensitive information and to limit access to authorized systems and services.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-3">Withdrawal of Consent</h2>
          <p>
            You can manage or withdraw your consent at any time from your account settings, subject to legal and operational requirements.
          </p>
        </section>
      </div>
    </div>
  );
}
