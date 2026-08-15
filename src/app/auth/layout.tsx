export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Pane — Branding */}
      <div className="hidden lg:flex flex-col flex-1 bg-[#1F5D43] relative overflow-hidden text-white items-center justify-center p-12">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative z-10 max-w-md text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2E7D5B] flex items-center justify-center text-white text-2xl font-bold font-display shadow-lg">
            M
          </div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-white">Mann Mitra</h1>
          <p className="text-white/75 text-lg font-sans leading-relaxed">
            A private digital sanctuary for students. Turn academic pressure into clarity, one day at a time.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {["Private", "Anonymous", "AI-powered", "Free"].map(tag => (
              <span key={tag} className="px-3 py-1.5 text-xs rounded-full bg-white/10 text-white/80 border border-white/15 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pane — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#2E7D5B] flex items-center justify-center text-white text-xl font-bold font-display mb-4">M</div>
            <h1 className="text-2xl font-display font-semibold tracking-tight text-[#1F2937]">Mann Mitra</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
