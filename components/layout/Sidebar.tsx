"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ClipboardList,
  Cog,
  Factory,
  FlaskConical,
  HardHat,
  Home,
  Package,
  PackageCheck,
  PackageOpen,
  Siren,
  Users,
  Warehouse,
} from "lucide-react";

const mainNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
];

const qualityNavLinks = [
    { href: "/production-lots", label: "Lotes de Produção", icon: Factory },
    { href: "/intermediate-lots", label: "Produtos Intermédios", icon: PackageOpen },
    { href: "/finished-lots", label: "Produtos Acabados", icon: PackageCheck },
    { href: "/lab-tests", label: "Análises de Laboratório", icon: FlaskConical },
];

const materialsNavLinks = [
    { href: "/raw-materials", label: "Matérias-primas", icon: Package },
    { href: "/suppliers", label: "Fornecedores", icon: Warehouse },
];

const ncsNavLinks = [
    { href: "/nc", label: "NC & 8D", icon: Siren },
    { href: "/food-safety", label: "Segurança Alimentar", icon: HardHat },
    { href: "/audits", label: "Auditorias", icon: ClipboardList },
];

const settingsNavLinks = [
    { href: "/users", label: "Utilizadores", icon: Users },
    { href: "/settings", label: "Configurações", icon: Cog },
]

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden h-full border-r bg-slate-900/50 lg:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <span className="text-lg">SmartLab</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium">
            <SidebarSection title="Principal" links={mainNavLinks} pathname={pathname} />
            <SidebarSection title="Qualidade & Produção" links={qualityNavLinks} pathname={pathname} />
            <SidebarSection title="Materiais & Fornecedores" links={materialsNavLinks} pathname={pathname} />
            <SidebarSection title="Conformidade" links={ncsNavLinks} pathname={pathname} />
            <SidebarSection title="Sistema" links={settingsNavLinks} pathname={pathname} />
          </nav>
        </div>
      </div>
    </div>
  );
}

function SidebarSection({ title, links, pathname }: { title: string; links: { href: string; label: string; icon: React.ElementType }[]; pathname: string; }) {
    return (
        <div className="py-2">
            <h2 className="mb-2 px-4 text-xs uppercase text-slate-400 tracking-wider">{title}</h2>
            {links.map(({ href, label, icon: Icon }) => (
                <Link
                    key={label}
                    href={href}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:text-slate-50 hover:bg-slate-800",
                        {
                            "bg-slate-700 text-slate-50": pathname === href,
                        }
                    )}
                >
                    <Icon className="h-4 w-4" />
                    {label}
                </Link>
            ))}
        </div>
    )
}
