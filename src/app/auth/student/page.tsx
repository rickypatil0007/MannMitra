import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, UserPlus, Sparkles } from "lucide-react";

export default function StudentAuthChoicePage() {
  return (
    <div className="space-y-6 relative">
      <Link href="/auth/login" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      
      <div>
        <h2 className="text-2xl font-display font-semibold text-[#1F2937] tracking-tight">Student Portal</h2>
        <p className="text-[#667085] mt-1.5 text-sm">How would you like to access your sanctuary?</p>
      </div>

      <div className="space-y-4">
        <Button className="w-full h-12 justify-start gap-3 bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white shadow-soft" asChild>
          <Link href="/auth/register">
            <UserPlus className="w-5 h-5" />
            Register New Account
          </Link>
        </Button>
        
        <Button className="w-full h-12 justify-start gap-3 bg-white hover:bg-[var(--background-soft)] text-[var(--text-primary)] border border-[var(--border)]" variant="outline" asChild>
          <Link href="/auth/student/login">
            <User className="w-5 h-5 text-[var(--text-secondary)]" />
            Login to Existing Account
          </Link>
        </Button>
      </div>

      {/* Divider */}
      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center pt-2">
          <span className="w-full border-t border-[#EEF3EF]" />
        </div>
        <div className="relative flex justify-center text-xs pt-2">
          <span className="bg-white px-3 text-[#98A2B3] uppercase tracking-wider">Or</span>
        </div>
      </div>

      <Button className="w-full h-12 justify-start gap-3 bg-[var(--background-green)] hover:bg-[var(--green-light)] text-[var(--green-dark)] border-transparent" variant="secondary" asChild>
        <Link href="/dashboard">
          <Sparkles className="w-5 h-5 text-[var(--green-primary)]" />
          Continue as Guest
        </Link>
      </Button>
    </div>
  );
}
