"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Sidebar, { sidebarNavItems } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex w-full flex-1 flex-col">
        <div className="border-b border-slate-800 bg-slate-950 md:hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">SmartLab</p>
              <p className="text-lg font-semibold text-slate-100">Quality Control</p>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-2 pb-4">
            {sidebarNavItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-full border border-transparent px-3 py-1 text-xs font-medium text-slate-400",
                    "hover:border-slate-700 hover:text-slate-100",
                    isActive && "border-sky-500/60 bg-slate-900 text-slate-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-10">
          <header className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Operational Space</p>
              <h1 className="text-2xl font-semibold text-white">SmartLab Console</h1>
              <p className="text-sm text-slate-400">
                Monitor processos, qualidade e food safety em um só lugar.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-slate-800 px-3 py-1 text-xs uppercase tracking-wide text-slate-400">
                v0.1 Labs
              </span>
            </div>
          </header>
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
