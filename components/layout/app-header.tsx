import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, ScanFace, Search } from "lucide-react";

export function AppHeader() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(now);

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.05] p-4 text-white shadow-[0_25px_80px_rgba(4,7,18,0.55)] backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">{formatted}</p>
        <p className="text-2xl font-semibold">SmartLab OS</p>
        <p className="text-sm text-white/70">Rastreio integral de qualidade e segurança</p>
      </div>
      <div className="flex flex-col gap-3 lg:w-[420px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <Input placeholder="Pesquisar lotes, NC, documentos..." className="pl-11" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="flex-1 justify-start gap-2">
            <ScanFace className="h-4 w-4" />
            Validar biometria
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notificações">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
