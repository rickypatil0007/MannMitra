import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, GraduationCap } from "lucide-react";

export default function FacultyLoginPage() {
  return (
    <div className="space-y-6 relative">
      <Link href="/auth/login" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div>
        <div className="flex items-center gap-2.5 mb-2 text-[var(--green-primary)]">
          <GraduationCap className="w-6 h-6" />
          <span className="font-semibold text-sm tracking-wide uppercase">Staff Portal</span>
        </div>
        <h2 className="text-2xl font-display font-semibold text-[#1F2937] tracking-tight">Professor Login</h2>
        <p className="text-[#667085] mt-1.5 text-sm">Secure access for faculty members.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#1F2937]">Institutional Email</label>
          <Input id="email" type="email" placeholder="professor@tcet.edu" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#1F2937]">Password</label>
            <Link href="#" className="text-xs text-[var(--green-primary)] hover:text-[var(--green-dark)] transition-colors font-medium">Forgot password?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>

        <Button className="w-full h-12 bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white" asChild>
          <Link href="/faculty/dashboard">Secure Log in</Link>
        </Button>
      </div>

      {/* Demo Credentials */}
      <div className="bg-[#EFF8F1] border border-[#E4EDE7] rounded-xl p-4 mt-6 text-sm text-center">
        <p className="text-[#1F5D43] font-medium mb-1">Demo Credentials for Judges</p>
        <p className="text-[#2E7D5B] text-xs">Email: <strong>professor@tcet.edu</strong></p>
        <p className="text-[#2E7D5B] text-xs">Password: <strong>demo123</strong></p>
      </div>
    </div>
  );
}
