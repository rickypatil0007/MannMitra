"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/shared";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-[var(--danger-soft)] flex items-center justify-center mb-2">
        <AlertCircle className="w-8 h-8 text-[var(--danger)]" />
      </div>
      <PageHeader 
        title="Something went wrong" 
        description="We've encountered an unexpected error. Please try again or contact support if the issue persists."
      />
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
