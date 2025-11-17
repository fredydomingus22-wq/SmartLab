import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { I18nProvider } from "@/contexts/i18n-context";
import Sidebar, { MobileSidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "SMART LAB",
  description: "Industrial LIMS/QMS for beverage manufacturers",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-slate-950 font-sans antialiased text-slate-100"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <I18nProvider>
            <div className="flex min-h-screen bg-slate-950 text-slate-100">
              <aside className="fixed inset-y-0 z-40 hidden w-[260px] shrink-0 md:flex">
              <Sidebar />
            </aside>
            <div className="flex w-full flex-col md:pl-[260px]">
              <div className="flex items-center gap-3 border-b border-slate-900 px-4 py-3 md:hidden">
                <MobileSidebar />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">SmartLab</p>
                  <p className="text-lg font-semibold text-white">Operational Console</p>
                </div>
              </div>
              <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10">{children}</main>
            </div>
          </div>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
