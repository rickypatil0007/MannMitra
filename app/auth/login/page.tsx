import Link from "next/link";
import { Button } from "@/frontend/components/ui/button";
import { GraduationCap, ShieldAlert, User, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="space-y-6 relative glass-card p-6 sm:p-8 rounded-3xl">
      <Link href="/" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div>
        <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] tracking-tight">Welcome to MannMitra</h2>
        <p className="text-[var(--text-secondary)] mt-1.5 text-sm">Select your portal to continue.</p>
      </div>

      <div className="space-y-4">
        <Button className="w-full h-12 justify-start gap-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-foreground)]" asChild>
          <Link href="/auth/student">
            <User className="w-5 h-5" />
            Student Login
          </Link>
        </Button>
        
        <Button className="w-full h-12 justify-start gap-3 bg-[var(--surface)] hover:bg-[var(--background-secondary)] text-[var(--text-primary)] border border-[var(--border)]" variant="outline" asChild>
          <Link href="/auth/faculty">
            <GraduationCap className="w-5 h-5 text-[var(--primary)]" />
            Professor / Faculty Login
          </Link>
        </Button>
        
        <Button className="w-full h-12 justify-start gap-3 bg-[var(--surface)] hover:bg-[var(--danger-soft)] hover:border-[#FECACA] text-[var(--text-primary)] border border-[var(--border)] transition-colors" variant="outline" asChild>
          <Link href="/auth/counsellor">
            <ShieldAlert className="w-5 h-5 text-[var(--danger)]" />
            Counsellor Portal Login
          </Link>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center pt-2">
          <span className="w-full border-t border-[var(--border-subtle)]" />
        </div>
        <div className="relative flex justify-center text-xs pt-2">
          <span className="bg-[var(--background-primary)] px-3 text-[var(--text-muted)] uppercase tracking-wider">Help</span>
        </div>
      </div>

      <p className="text-sm text-center text-[var(--text-secondary)]">
        Need help accessing your account?{" "}
        <Link href="/support" className="font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors">
          Contact IT Support
        </Link>
      </p>
    </div>
  );
}
