import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldAlert, User, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="space-y-6 relative">
      <Link href="/" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
      
      <div>
        <h2 className="text-2xl font-display font-semibold text-[#1F2937] tracking-tight">Welcome to MannMitra</h2>
        <p className="text-[#667085] mt-1.5 text-sm">Select your portal to continue.</p>
      </div>

      <div className="space-y-4">
        <Button className="w-full h-12 justify-start gap-3 bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white" asChild>
          <Link href="/auth/student">
            <User className="w-5 h-5" />
            Student Login
          </Link>
        </Button>
        
        <Button className="w-full h-12 justify-start gap-3 bg-white hover:bg-[var(--background-soft)] text-[var(--text-primary)] border border-[var(--border)]" variant="outline" asChild>
          <Link href="/auth/faculty">
            <GraduationCap className="w-5 h-5 text-[var(--green-primary)]" />
            Professor / Faculty Login
          </Link>
        </Button>
        
        <Button className="w-full h-12 justify-start gap-3 bg-white hover:bg-[#FFF2F2] hover:border-[#FECACA] text-[var(--text-primary)] border border-[var(--border)] transition-colors" variant="outline" asChild>
          <Link href="/auth/counsellor">
            <ShieldAlert className="w-5 h-5 text-[#C94A4A]" />
            Counsellor Portal Login
          </Link>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center pt-2">
          <span className="w-full border-t border-[#EEF3EF]" />
        </div>
        <div className="relative flex justify-center text-xs pt-2">
          <span className="bg-white px-3 text-[#98A2B3] uppercase tracking-wider">Help</span>
        </div>
      </div>

      <p className="text-sm text-center text-[#667085]">
        Need help accessing your account?{" "}
        <Link href="/support" className="font-semibold text-[var(--green-primary)] hover:text-[var(--green-dark)] transition-colors">
          Contact IT Support
        </Link>
      </p>
    </div>
  );
}
