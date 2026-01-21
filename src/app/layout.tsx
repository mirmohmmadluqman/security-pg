import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

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
    icon: "/favicon.ico",
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
          themes={["light", "dark", "cyberpunk", "minimalist", "glass", "neobrutalism", "enterprise"]}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
