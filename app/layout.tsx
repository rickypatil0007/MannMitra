import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

import { PremiumCursor } from "@/frontend/components/motion/premium-cursor";
import { ScrollProgress } from "@/frontend/components/ui/scroll-progress";
import { AnimatedScenery } from "@/frontend/components/environment/AnimatedScenery";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  title: "Mann Mitra",
  description: "A private digital sanctuary for students. Turn academic chaos into clarity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="antialiased min-h-screen bg-[var(--background-primary)] selection:bg-[var(--primary-soft)] selection:text-[var(--primary-hover)] relative overflow-x-hidden">
        <AnimatedScenery />
        <ScrollProgress />
        <PremiumCursor />
        {children}
      </body>
    </html>
  );
}
