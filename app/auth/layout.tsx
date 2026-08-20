import { AuthBrandingPanel, AuthMobileLogo } from "@/frontend/components/auth/auth-branding";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background-primary)]">
      <AuthBrandingPanel />

      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 bg-[var(--background-primary)]">
        <div className="w-full max-w-sm space-y-8">
          <AuthMobileLogo />
          {children}
        </div>
      </div>
    </div>
  );
}
