import { FloatingHeader } from "@/frontend/components/navigation/floating-header"

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background">
      <FloatingHeader />
      
      {/* Abstract Background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl mix-blend-multiply" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full pt-32 pb-16">
        {children}
      </main>
    </div>
  )
}
