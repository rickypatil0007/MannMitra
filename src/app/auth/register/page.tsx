import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="space-y-6 relative">
      <Link href="/auth/student" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div>
        <h2 className="text-2xl font-display font-semibold text-[#1F2937] tracking-tight">Create your account</h2>
        <p className="text-[#667085] mt-1.5 text-sm">Start your journey to better wellbeing. It's free.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-[#1F2937]">Full Name</label>
          <Input id="name" type="text" placeholder="Alex Doe" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="gsuid" className="text-sm font-medium text-[#1F2937]">GSUID (ID of TCET)</label>
          <Input id="gsuid" type="email" placeholder="student@tcetmumbai.in" />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-[#1F2937]">Password</label>
          <Input id="password" type="password" placeholder="Create a strong password" />
        </div>

        <Button className="w-full h-12 bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white" asChild>
          <Link href="/onboarding">Create Account</Link>
        </Button>
      </div>

      <p className="text-xs text-center text-[#98A2B3] leading-relaxed px-2">
        By signing up, you agree to our{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-[var(--green-primary)] transition-colors">Terms of Service</Link>
        {" "}and{" "}
        <Link href="#" className="underline underline-offset-4 hover:text-[var(--green-primary)] transition-colors">Privacy Policy</Link>.
      </p>

      <p className="text-sm text-center text-[#667085]">
        Already have an account?{" "}
        <Link href="/auth/student/login" className="font-semibold text-[var(--green-primary)] hover:text-[var(--green-dark)] transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
}
