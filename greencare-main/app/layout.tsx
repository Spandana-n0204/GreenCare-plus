import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Link from "next/link";
import { ArrowRight, Leaf, Users, FileText, Heart, Calendar, LineChart, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { HospitalProvider } from "@/contexts/HospitalContext";
import AuthHeaderButtons from "@/components/AuthHeaderButtons";
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenCare+ Hospital Management System",
  description: "Sustainable digital hospital management system aligned with SDG 3: Good Health and Well-being",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background antialiased")}>
      <HospitalProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-around">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <Link href="/" className="text-lg font-bold">GreenCare+</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/patients" className="text-sm font-medium hover:text-primary">
              Patients
            </Link>
            <Link href="/doctors" className="text-sm font-medium hover:text-primary">
              Doctors
            </Link>
            <Link href="/records" className="text-sm font-medium hover:text-primary">
              Records
            </Link>
            <Link href="/sustainability" className="text-sm font-medium hover:text-primary">
              Sustainability
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthHeaderButtons />
          </div>
        </div>
      </header>
      {children}
            <Toaster richColors position="top-right" />
        </ThemeProvider>
      </HospitalProvider>

      </body>
    </html>
  );
}