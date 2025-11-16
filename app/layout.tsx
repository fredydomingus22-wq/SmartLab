import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ui/theme-provider";
import type { ReactNode } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/production-lots", label: "Lotes Pai" },
  { href: "/intermediate-lots", label: "Intermédios" },
  { href: "/finished-lots", label: "Produtos Finais" },
  { href: "/traceability", label: "Rastreabilidade" },
  { href: "/lab-tests", label: "Laboratório" },
  { href: "/products", label: "Produtos" },
  { href: "/parameters", label: "Parâmetros" },
  { href: "/product-specs", label: "Specs" },
  { href: "/nc", label: "NC" },
  { href: "/audits", label: "Auditorias" },
  { href: "/documents", label: "Documentos" },
  { href: "/trainings", label: "Treinamentos" },
  { href: "/food-safety/prp", label: "PRP" },
  { href: "/food-safety/oprp", label: "OPRP" },
  { href: "/food-safety/pcc", label: "PCC" },
];

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
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <aside className="hidden w-64 border-r bg-muted/30 p-6 md:block">
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">SMART LAB</p>
                  <p className="text-base font-bold">LIMS/QMS</p>
                </div>
                <nav className="space-y-2">
                  {NAV_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
