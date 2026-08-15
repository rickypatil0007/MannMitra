import Link from "next/link";
import { Phone, MessageSquare, ArrowLeft, User } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-white text-[#1F2937] flex flex-col">
      {/* Back link */}
      <div className="p-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#98A2B3] hover:text-[#1F2937] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to app
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-lg mx-auto w-full -mt-8">
        <div className="w-16 h-16 rounded-2xl bg-[#EFF8F1] flex items-center justify-center mb-8">
          <span className="text-3xl">🆘</span>
        </div>

        <h1 className="text-4xl font-display font-semibold tracking-tight mb-3 leading-tight text-[#1F2937]">
          You are not alone.
        </h1>
        <p className="text-[#667085] text-lg mb-12 leading-relaxed">
          Choose how you want help right now. It&apos;s okay to reach out.
        </p>

        {/* Actions */}
        <div className="w-full space-y-3 mb-8">
          <a
            href="tel:112"
            className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-[#2E7D5B] text-white font-semibold text-lg hover:bg-[#1F5D43] transition-colors shadow-[0_4px_20px_rgba(46,125,91,0.2)]"
          >
            <span className="flex items-center gap-3">
              <Phone className="w-6 h-6" />
              Call Emergency Services
            </span>
            <span className="text-white/70 text-base font-normal">112 / 911</span>
          </a>

          <a
            href="tel:9152987821"
            className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-white text-[#1F2937] font-semibold text-lg hover:bg-[#F7FBF8] transition-colors border border-[#E4EDE7]"
          >
            <span className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-[#2E7D5B]" />
              iCall Crisis Helpline
            </span>
            <span className="text-[#98A2B3] text-base font-normal">iCall India</span>
          </a>

          <a
            href="sms:iCall"
            className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-white text-[#1F2937] font-semibold text-lg hover:bg-[#F7FBF8] transition-colors border border-[#E4EDE7]"
          >
            <span className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-[#2E7D5B]" />
              Text a Crisis Line
            </span>
            <span className="text-[#98A2B3] text-base font-normal">iCall SMS</span>
          </a>

          <Link
            href="/support"
            className="flex items-center justify-between w-full px-6 py-5 rounded-2xl bg-white text-[#1F2937] font-semibold text-lg hover:bg-[#F7FBF8] transition-colors border border-[#E4EDE7]"
          >
            <span className="flex items-center gap-3">
              <User className="w-6 h-6 text-[#2E7D5B]" />
              Message a Trusted Contact
            </span>
          </Link>
        </div>

        <p className="text-sm text-[#98A2B3] max-w-xs leading-relaxed">
          Phone numbers shown are general crisis helplines. Your institution may have additional resources available in the Support tab.
        </p>
      </div>
    </div>
  );
}
