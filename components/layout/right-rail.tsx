import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Shield, Users } from "lucide-react";

const auditQueue = [
  { label: "FSSC 22000", status: "Preparar", date: "28 MAI" },
  { label: "PepsiCo", status: "Visita cliente", date: "03 JUN" },
];

const biometrics = [
  { name: "Ana Costa", role: "QA Supervisor", status: "Ativa" },
  { name: "Miguel Ramos", role: "Lab Tech", status: "Pendente" },
];

export function RightRail() {
  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-6 xl:flex">
      <GlassPanel className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Alertas</p>
          <p className="text-lg font-semibold">Qualidade</p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-red-500/10 px-3 py-2 text-red-100">
            <AlertTriangle className="h-4 w-4" />
            PCC 03 acima do limite crítico
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-emerald-500/10 px-3 py-2 text-emerald-100">
            <CheckCircle2 className="h-4 w-4" />
            OPRP 07 verificado há 12min
          </div>
        </div>
      </GlassPanel>
      <GlassPanel className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Auditorias</p>
            <p className="text-lg font-semibold">Proximas</p>
          </div>
          <Shield className="h-5 w-5 text-white/60" />
        </div>
        <div className="space-y-3">
          {auditQueue.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-white/70">{item.status}</p>
              <p className="mt-1 text-xs text-white/50">{item.date}</p>
            </div>
          ))}
        </div>
        <Button variant="secondary">Plano de auditoria</Button>
      </GlassPanel>
      <GlassPanel className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-white/60" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Passkeys</p>
            <p className="text-lg font-semibold">Autenticação</p>
          </div>
        </div>
        <div className="space-y-3">
          {biometrics.map((person) => (
            <div key={person.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div>
                <p className="font-semibold">{person.name}</p>
                <p className="text-xs text-white/60">{person.role}</p>
              </div>
              <span className="text-xs uppercase tracking-widest text-white/50">{person.status}</span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </aside>
  );
}
