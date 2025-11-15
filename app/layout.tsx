import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import SignOutButton from "@/components/ui/signout-button";

export const metadata: Metadata = {
  title: "SMART LAB",
  description: "Industrial LIMS/QMS for beverage manufacturers",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b bg-card/50 p-4">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="/" className="font-bold">SMART LAB</a>
                <nav className="flex gap-3">
                  <a href="/dashboard" className="text-sm">Dashboard</a>
                  <a href="/documents" className="text-sm">Documents</a>
                  <a href="/products" className="text-sm">Products</a>
                </nav>
              </div>
              <div>
                {session.user ? (
                  <div className="flex items-center gap-4">
                    <div className="text-sm">{session.user.email}</div>
                    <SignOutButton />
                  </div>
                ) : (
                  <a href="/auth/sign-in" className="text-sm">Sign in</a>
                )}
              </div>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
