import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHRONOS // Legacy Code Archaeologist",
  description: "Enterprise-grade tool for analyzing, visualizing, and refactoring legacy codebases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
