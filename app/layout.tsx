import type { Metadata } from "next";
import { Epilogue, Manrope } from "next/font/google";
import "./globals.css";

import { CursorGlow } from "@/frontend/components/ui/cursor-glow";
import { ScrollProgress } from "@/frontend/components/ui/scroll-progress";
import { DreamscapeBackground } from "@/frontend/components/dreamscape/dreamscape-background";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
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
    <html lang="en" className={`${epilogue.variable} ${manrope.variable} h-full antialiased`}>
      <body className="antialiased min-h-screen bg-[var(--background-primary)] selection:bg-[var(--primary-soft)] selection:text-[var(--primary-hover)] relative">
        <DreamscapeBackground />
        <ScrollProgress />
        <CursorGlow />
        {children}

      </body>
    </html>
  );
}
