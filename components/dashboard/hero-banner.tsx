import { Button } from "@/components/ui/button";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1120] via-[#111c34] to-[#060912] p-8 text-white shadow-[0_30px_120px_rgba(2,6,23,0.8)]">
      <div className="pointer-events-none absolute right-8 top-1/2 hidden h-48 w-48 -translate-y-1/2 rounded-full bg-[#0ea5e966] blur-3xl lg:block" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-white/50">SmartLab</p>
          <h1 className="text-4xl font-semibold leading-tight">
            Cockpit industrial para QA/QC, Food Safety e LIMS
          </h1>
          <p className="text-base text-white/70">
            Monitoriza lotes, NC, PCC e parâmetros críticos em tempo real. Fluxos com biometria e rastreabilidade total desde a matéria-prima até o lote final.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
            <span className="rounded-full border border-white/20 px-4 py-2">FSSC 22000</span>
            <span className="rounded-full border border-white/20 px-4 py-2">HACCP</span>
            <span className="rounded-full border border-white/20 px-4 py-2">Pepsi</span>
          </div>
        </div>
        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-right">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Próximo Gate</p>
          <p className="text-3xl font-semibold">Liberação FP</p>
          <p className="text-sm text-white/60">Biometria obrigatória</p>
          <Button className="w-full justify-center">Entrar no fluxo</Button>
        </div>
      </div>
    </div>
  );
}
