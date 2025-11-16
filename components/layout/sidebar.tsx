"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  Beaker,
  LineChart,
  ShieldCheck,
  Layers,
  ClipboardCheck,
  BookOpenCheck,
  FileBarChart,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/production-lots", label: "Lotes Pai", icon: Layers },
  { href: "/intermediate-lots", label: "Intermédios", icon: Box },
  { href: "/finished-lots", label: "Produtos Finais", icon: LineChart },
  { href: "/lab-tests", label: "Laboratório", icon: Beaker },
  { href: "/traceability", label: "Rastreabilidade", icon: ShieldCheck },
  { href: "/products", label: "Produtos", icon: ClipboardCheck },
  { href: "/parameters", label: "Parâmetros", icon: FileBarChart },
  { href: "/trainings", label: "Treinamentos", icon: BookOpenCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-white shadow-[0_25px_90px_rgba(5,8,20,0.65)] backdrop-blur-2xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">SmartLab</p>
          <p className="mt-2 text-2xl font-semibold">Command</p>
          <p className="text-sm text-white/70">LIMS + QMS cockpit</p>
        </div>
        <nav className="space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname?.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-white/15 text-white shadow-[0_10px_35px_rgba(255,255,255,0.08)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Shift</p>
          <p className="text-lg font-semibold">Night A</p>
          <p className="text-xs text-white/60">QA Lead: Ana</p>
        </div>
      </div>
    </aside>
  );
}
