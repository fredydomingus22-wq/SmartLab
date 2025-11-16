import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { RightRail } from "@/components/layout/right-rail";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SMART LAB",
  description: "Industrial LIMS/QMS for beverage manufacturers",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background text-foreground", plusJakarta.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <div className="relative min-h-screen overflow-hidden bg-[#030712]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 top-[-180px] h-[420px] w-[420px] rounded-full bg-[#ff8c4d33] blur-[200px]" />
              <div className="absolute right-0 top-1/3 h-[320px] w-[320px] rounded-full bg-[#1d4ed833] blur-[200px]" />
              <div className="absolute inset-x-0 bottom-[-200px] mx-auto h-[360px] w-[720px] rounded-full bg-[#0ea5e933] blur-[220px]" />
            </div>
            <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-6 lg:px-8 lg:py-10">
              <Sidebar />
              <div className="flex min-h-full flex-1 flex-col gap-6">
                <AppHeader />
                <main className="flex-1 rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-white shadow-[0_25px_120px_rgba(4,7,18,0.65)] backdrop-blur-2xl lg:p-8">
                  {children}
                </main>
              </div>
              <RightRail />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
