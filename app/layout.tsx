import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProviderWrapper from "@/components/providers/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Chronos - Legacy Code Archaeologist",
  description: "AI-powered platform for understanding, modernizing, and refactoring legacy codebases with confidence.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased">
        <SessionProviderWrapper session={session}>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
