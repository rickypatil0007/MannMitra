import Link from "next/link"
import { Button } from "@/frontend/components/ui/button"

export function FloatingHeader() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-display font-bold text-xl tracking-tight text-primary">
            Mann Mitra
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="text-foreground/80 hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#privacy" className="text-foreground/80 hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link href="/counselors" className="text-foreground/80 hover:text-primary transition-colors">
            Counselors
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Log in
          </Link>
          <Button asChild size="sm" className="rounded-full">
            <Link href="/auth/register">Find Your Space</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
