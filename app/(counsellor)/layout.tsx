import { CounsellorSidebar } from "@/frontend/components/navigation/counsellor-sidebar";

export default function CounsellorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--background-secondary)]">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <CounsellorSidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-5 sm:p-6 lg:p-8 pb-24 md:pb-8 space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
