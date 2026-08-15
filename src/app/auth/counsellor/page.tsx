import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function CounsellorLoginPage() {
  return (
    <div className="space-y-6 relative">
      <Link href="/auth/login" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div>
        <div className="flex items-center gap-2.5 mb-2 text-[#C94A4A]">
          <ShieldAlert className="w-6 h-6" />
          <span className="font-semibold text-sm tracking-wide uppercase">Care Portal</span>
        </div>
        <h2 className="text-2xl font-display font-semibold text-[#1F2937] tracking-tight">Counsellor Login</h2>
        <p className="text-[#667085] mt-1.5 text-sm">Strictly confidential access for health staff.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-[#1F2937]">Staff Email</label>
          <Input id="email" type="email" placeholder="counsellor@tcet.edu" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#1F2937]">Password</label>
            <Link href="#" className="text-xs text-[#C94A4A] hover:text-[#A13A3A] transition-colors font-medium">Forgot password?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>

        <Button className="w-full h-12 bg-[#C94A4A] hover:bg-[#A13A3A] text-white" asChild>
          <Link href="/counsellor/dashboard">Secure Log in</Link>
        </Button>
      </div>

      {/* Demo Credentials */}
      <div className="bg-[#FFF2F2] border border-[#FECACA] rounded-xl p-4 mt-6 text-sm text-center">
        <p className="text-[#A13A3A] font-medium mb-1">Demo Credentials for Judges</p>
        <p className="text-[#C94A4A] text-xs">Email: <strong>counsellor@tcet.edu</strong></p>
        <p className="text-[#C94A4A] text-xs">Password: <strong>demo123</strong></p>
      </div>
    </div>
  );
}
