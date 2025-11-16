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

const ROLE_LINKS: Record<string, Array<{ label: string; href: string }>> = {
  admin_root: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Products", href: "/products" },
    { label: "Production Lots", href: "/production-lots" },
    { label: "Raw Materials", href: "/raw-materials" },
    { label: "Suppliers", href: "/suppliers" },
    { label: "Lab Tests", href: "/lab-tests" },
    { label: "Non-Conformities", href: "/nc" },
    { label: "Audits", href: "/audits" },
    { label: "Trainings", href: "/trainings" },
    { label: "Documents", href: "/documents" },
  ],
  plant_manager: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Production Lots", href: "/production-lots" },
    { label: "Raw Materials", href: "/raw-materials" },
    { label: "Lab Tests", href: "/lab-tests" },
    { label: "Non-Conformities", href: "/nc" },
    { label: "Documents", href: "/documents" },
  ],
  qa_supervisor: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Production Lots", href: "/production-lots" },
    { label: "Raw Materials", href: "/raw-materials" },
    { label: "Lab Tests", href: "/lab-tests" },
    { label: "Non-Conformities", href: "/nc" },
    { label: "Audits", href: "/audits" },
    { label: "Documents", href: "/documents" },
  ],
  lab_tech: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Lab Tests", href: "/lab-tests" },
    { label: "Documents", href: "/documents" },
  ],
  auditor_readonly: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Non-Conformities", href: "/nc" },
    { label: "Audits", href: "/audits" },
    { label: "Documents", href: "/documents" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  const userRole = session.user?.role || "auditor_readonly";
  const navLinks = ROLE_LINKS[userRole] || ROLE_LINKS.auditor_readonly;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b bg-card/50 p-4">
            <div className="mx-auto flex max-w-full items-center justify-between gap-4">
              <div className="flex items-center gap-8">
                <a href="/" className="font-bold text-lg">SMART LAB</a>
                <nav className="flex gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded px-3 py-2 text-sm hover:bg-accent"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
              <div>
                {session.user ? (
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      {session.user.email} <span className="text-xs text-muted-foreground">({userRole})</span>
                    </div>
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
