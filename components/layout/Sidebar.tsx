"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  ClipboardPlus,
  Factory,
  FilePlus,
  FileSearch,
  FileText,
  FlaskConical,
  GraduationCap,
  Handshake,
  LayoutDashboard,
  LogIn,
  Menu,
  PackageCheck,
  PackagePlus,
  Route,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldPlus,
  SlidersHorizontal,
  SquarePen,
  SquarePlus,
  Tags,
  TestTube2,
  Thermometer,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export const sidebarNavItems: NavSection[] = [
  {
    label: "Visão Geral",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Produção",
    items: [
      { title: "Lotes de Produção", href: "/production-lots", icon: Factory },
      { title: "Registar Novo Lote", href: "/production-lots/create", icon: SquarePlus },
      { title: "Produtos Intermédios", href: "/intermediate-lots", icon: Boxes },
      { title: "Registar Produto Intermédio", href: "/intermediate-lots/create", icon: SquarePlus },
      { title: "Produtos Acabados", href: "/finished-lots", icon: PackageCheck },
      { title: "Registar Análise de PA", href: "/finished-lots/create", icon: PackagePlus },
    ],
  },
  {
    label: "Produtos & Parâmetros",
    items: [
      { title: "Produtos", href: "/products", icon: Tags },
      { title: "Registar Produto", href: "/products/create", icon: SquarePlus },
      { title: "Parâmetros & Especificações", href: "/product-specs", icon: SlidersHorizontal },
      { title: "Registar Especificação", href: "/product-specs/create", icon: SquarePen },
    ],
  },
  {
    label: "Materiais & Fornecedores",
    items: [
      { title: "Matérias-primas", href: "/raw-materials", icon: FlaskConical },
      { title: "Registar Matéria-prima", href: "/raw-materials/create", icon: SquarePlus },
      { title: "Lotes de Matéria-prima", href: "/raw-material-lots", icon: TestTube2 },
      { title: "Registar Lote de MP", href: "/raw-material-lots/create", icon: SquarePlus },
      { title: "Fornecedores", href: "/suppliers", icon: Handshake },
      { title: "Registar Fornecedor", href: "/suppliers/create", icon: SquarePlus },
    ],
  },
  {
    label: "Qualidade & NC",
    items: [
      { title: "Análises de Laboratório", href: "/lab-tests", icon: FlaskConical },
      { title: "Registar Análise", href: "/lab-tests/create", icon: SquarePlus },
      { title: "Não Conformidades", href: "/nc", icon: AlertTriangle },
      { title: "Registar NC", href: "/nc/create", icon: ClipboardPlus },
      { title: "Relatórios 8D", href: "/nc/8d", icon: Workflow },
      { title: "Auditorias", href: "/audits", icon: FileSearch },
      { title: "Registar Auditoria", href: "/audits/create", icon: ClipboardList },
    ],
  },
  {
    label: "Segurança Alimentar",
    items: [
      { title: "Segurança Alimentar", href: "/food-safety", icon: ShieldCheck },
      { title: "PRP", href: "/food-safety/prp", icon: Shield },
      { title: "OPRP", href: "/food-safety/oprp", icon: ShieldPlus },
      { title: "PCC", href: "/food-safety/pcc", icon: Thermometer },
    ],
  },
  {
    label: "Documentos & Treinamentos",
    items: [
      { title: "Rastreabilidade", href: "/traceability", icon: Route },
      { title: "Documentos", href: "/documents", icon: FileText },
      { title: "Registar Documento", href: "/documents/create", icon: FilePlus },
      { title: "Treinamentos", href: "/trainings", icon: GraduationCap },
      { title: "Registar Treinamento", href: "/trainings/create", icon: SquarePlus },
    ],
  },
  {
    label: "Autenticação",
    items: [
      { title: "Login", href: "/auth/sign-in", icon: LogIn },
      { title: "Acesso Negado", href: "/auth/forbidden", icon: ShieldAlert },
    ],
  },
];

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/";
  }

  if (href.endsWith("/create")) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full w-[260px] flex-col border-r border-slate-900 bg-slate-950/95 px-4 py-6 text-slate-200",
        className
      )}
    >
      <div className="px-2">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">SmartLab</p>
        <p className="text-lg font-semibold text-white">Quality Command</p>
      </div>
      <div className="mt-8 flex-1 space-y-6 overflow-y-auto pr-1">
        {sidebarNavItems.map((section) => (
          <div key={section.label}>
            <p className="px-2 text-xs uppercase tracking-[0.3em] text-slate-500">
              {section.label}
            </p>
            <div className="mt-3 space-y-1">
              {section.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-2 text-sm text-slate-400 transition",
                      "hover:bg-slate-800/50",
                      active &&
                        "border-emerald-500 bg-slate-800 font-semibold text-white shadow-inner"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 text-slate-500 transition",
                        active ? "text-emerald-400" : "group-hover:text-slate-100"
                      )}
                    />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-slate-900/70 bg-slate-950/70 p-4 text-xs text-slate-500">
        <p>Conectado ao núcleo SmartLab.</p>
        <p className="text-[11px] text-slate-600">Todas as ações são auditáveis.</p>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-slate-100 hover:text-white"
          aria-label="Abrir navegação"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] border-r border-slate-900 px-0 py-0">
        <Sidebar onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
