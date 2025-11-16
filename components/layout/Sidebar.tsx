"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type SidebarNavItem = {
  label: string;
  href: string;
};

export const sidebarNavItems: readonly SidebarNavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Lotes", href: "/lotes" },
  { label: "Matéria-prima", href: "/materia-prima" },
  { label: "Laboratório", href: "/laboratorio" },
  { label: "NC & 8D", href: "/nc" },
  { label: "Food Safety", href: "/food-safety" },
  { label: "Treinamentos", href: "/treinamentos" },
  { label: "Traceability", href: "/traceability" },
  { label: "Formulários", href: "/formularios" },
  { label: "Produtos & Parâmetros", href: "/produtos-parametros" },
  { label: "Settings", href: "/settings" },
];

const currentYear = new Date().getFullYear();

type SidebarProps = {
  className?: string;
  items?: readonly SidebarNavItem[];
};

export function Sidebar({ className, items = sidebarNavItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 md:flex",
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="px-6 pb-4 pt-8">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SmartLab</p>
          <p className="text-lg font-semibold text-slate-100">Quality Command</p>
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-4 py-3 text-sm font-medium text-slate-400 transition",
                  "hover:bg-slate-900 hover:text-slate-100",
                  isActive &&
                    "bg-slate-900 text-slate-100 ring-1 ring-inset ring-sky-500/50"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-slate-800 px-6 py-6 text-xs text-slate-500">
          © {currentYear} SmartLab
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
