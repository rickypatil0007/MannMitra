"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/frontend/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { GuestPrompt } from "./guest-prompt";

const PUBLIC_ROUTES = [
  "/dashboard",
  "/safety",
  "/auth/login",
  "/auth/register",
  "/auth/student/login",
  "/auth/student",
  "/auth/counsellor",
  "/auth/faculty",
  "/onboarding"
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsGuest(!user || user.isAnonymous);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname?.startsWith(`${route}/`));

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  // If they are a guest and trying to access a private route, show the GuestPrompt full screen
  // instead of rendering the children, preventing unauthorized API calls and data fetching.
  if (isGuest && !isPublicRoute) {
    // Determine feature name based on pathname
    const featureName = pathname?.split('/')[1] || "this feature";
    const titleCaseFeature = featureName.charAt(0).toUpperCase() + featureName.slice(1);
    
    return (
      <div className="relative min-h-[60vh]">
        <GuestPrompt feature={titleCaseFeature} description={`Create an account to securely access ${titleCaseFeature}.`} />
      </div>
    );
  }

  return <>{children}</>;
}
