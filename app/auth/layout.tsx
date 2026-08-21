import { AuthBrandingPanel, AuthMobileLogo } from "@/frontend/components/auth/auth-branding";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100vh] items-center justify-center p-4 sm:p-8">
      {/* Ultra-minimal translucent container */}
      <div className="w-full max-w-[440px] flex flex-col p-8 sm:p-10 rounded-[24px] border border-white/10 bg-[var(--bg-surface)] backdrop-blur-xl shadow-2xl relative z-10">
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="w-full space-y-8 relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
