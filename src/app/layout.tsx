import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { LegalGate } from "@/components/LegalGate";
import { ImageZoomProvider } from "@/components/ImageZoom";
import { MotionProvider } from "@/components/MotionProvider";

import { WalletProvider } from "@/context/WalletContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Security Playground - Learn Smart Contract Security",
  description: "Interactive browser-based platform for learning Ethereum smart contract security through hands-on exploitation and fixing of real vulnerabilities. Built with Next.js, TypeScript, and Monaco Editor.",
  keywords: ["Solidity", "Smart Contract", "Security", "Ethereum", "Blockchain", "Vulnerability", "Web3", "Next.js", "TypeScript", "Educational"],
  authors: [{ name: "Mir Mohmmad Luqman", url: "https://github.com/mirmohmmadluqman" }],
  icons: {
    icon: [
      { url: "/assets/favicon.ico" },
      { url: "/assets/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/assets/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/assets/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/assets/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/assets/android-chrome-512x512.png" },
    ],
  },
  openGraph: {
    title: "Security Playground - Smart Contract Security Training",
    description: "Learn Ethereum security by exploiting and fixing real smart contract vulnerabilities",
    url: "https://mirmohmmadluqman.github.io/security-pg",
    siteName: "Security Playground",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security Playground - Smart Contract Security",
    description: "Interactive platform for learning blockchain security vulnerabilities",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          themes={["dark", "light", "cyberpunk", "minimalist-light", "minimalist-dark", "glass", "neobrutalism", "enterprise"]}
        >
          <ImageZoomProvider>
            <WalletProvider>
              <MotionProvider>
                {children}
              </MotionProvider>
              <LegalGate />
              <Toaster />
            </WalletProvider>
          </ImageZoomProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
