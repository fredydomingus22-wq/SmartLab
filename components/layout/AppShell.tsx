"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import Sidebar, { MobileSidebar } from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar className="fixed inset-y-0 left-0 z-20 hidden md:flex" />

      <div className="flex w-full flex-1 flex-col md:pl-[260px]">
        <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur-sm md:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">SmartLab</p>
              <p className="text-lg font-semibold text-slate-100">Quality Command</p>
            </div>
            <MobileSidebar />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="sticky top-0 z-10 hidden h-16 items-center justify-end gap-4 border-b border-slate-800 bg-slate-950/80 px-10 backdrop-blur-sm md:flex">
          <span className="font-medium">Bem-vindo de volta, Domingos Cambongo</span>
          <button
            type="button"
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 px-4 py-6 md:px-10">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
