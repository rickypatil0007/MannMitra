import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function StudentLoginPage() {
  return (
    <div className="space-y-6 relative">
      <Link href="/auth/student" className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div>
        <h2 className="text-2xl font-display font-semibold text-[#1F2937] tracking-tight">Student Login</h2>
        <p className="text-[#667085] mt-1.5 text-sm">Enter your TCET credentials to continue.</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="gsuid" className="text-sm font-medium text-[#1F2937]">GSUID (ID of TCET)</label>
          <Input id="gsuid" type="email" placeholder="e.g. student@tcetmumbai.in" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#1F2937]">Password</label>
            <Link href="#" className="text-xs text-[var(--green-primary)] hover:text-[var(--green-dark)] transition-colors font-medium">Forgot password?</Link>
          </div>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>

        <Button className="w-full h-12 bg-[var(--green-primary)] hover:bg-[var(--green-dark)] text-white" asChild>
          <Link href="/dashboard">Log in</Link>
        </Button>
      </div>
    </div>
  );
}
