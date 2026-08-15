import type { Metadata } from "next";
import { Epilogue, Manrope } from "next/font/google";
import "./globals.css";

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
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/20">{children}</body>
    </html>
  );
}
