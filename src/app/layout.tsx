import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clerk + Next.js",
  description: "A custom auth component using Clerk + Next.jse",
  keywords: [
    "Clerk",
    "Next.js",
    "Authentication",
    "Sign In",
    "Sign Up",
    "OAuth",
    "Passwordless",
    "2FA",
    "MFA",
    "User Management",
    "React",
    "TypeScript",
    "How to make custom sign in and sign up pages",
    "Custom Auth Component",
    "Clerk.dev",
    "NextAuth.js alternative",
    "Frontend Authentication",
    "Web Development",
    "Fullstack Development",
    "SaaS Authentication",
    "Secure Login",
    "User Onboarding",
    "Session Management",
    "Auth Flows",
    "Clerk Integration",
    "Next.js 13",
    "App Router",
    "Server Components",
    "Client Components",
    "Tailwind CSS",
    "UI Components",
    "Form Validation",
    "Error Handling",
    "Accessibility",
    "Responsive Design",
    "Best Practices",
    "Tutorial",
    "Guide",
    "Open Source",
    "GitHub",
    "Gumroad",
    "Free Resource",
  ],
  authors: [
    { name: "Bhavesh Singhal", url: "https://github.com/bhaveshsinghal95182" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClerkProvider>
            <Navbar />
            {children}
            <Analytics />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
