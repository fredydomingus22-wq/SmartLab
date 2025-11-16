import { HeroBanner } from "@/components/dashboard/hero-banner";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { TrendChart } from "@/components/charts/trend-chart";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Beaker, ShieldCheck, Sparkles } from "lucide-react";

const kpiCards = [
  { label: "NC Abertas", value: 12, description: "4 críticas", icon: AlertTriangle },
  { label: "Lotes em Quarentena", value: 5, description: "2 aguardam QA", icon: ShieldCheck },
  { label: "PCC Monitorados", value: 18, description: "1 desvio", icon: Sparkles },
  { label: "Análises do turno", value: 34, description: "6 in progress", icon: Beaker },
];

const trendData = [
  { date: "08:00", co2: 5.8, brix: 11.9, ph: 3.2 },
  { date: "10:00", co2: 5.9, brix: 12.1, ph: 3.15 },
  { date: "12:00", co2: 6.1, brix: 11.8, ph: 3.22 },
  { date: "14:00", co2: 5.7, brix: 12.0, ph: 3.1 },
];

const labQueue = [
  { lot: "FP-2024-013", product: "Orange Sparkling", analyst: "A. Costa", status: "in_spec" },
  { lot: "INT-2024-08", product: "Base Citrus", analyst: "M. Ramos", status: "pending" },
  { lot: "RM-014", product: "Concentrado", analyst: "P. Silva", status: "out" },
];

const timelineData = [
  { time: "07:30", title: "Receção matéria-prima", meta: "Fornecedor CitrusPrime", status: "info" },
  { time: "09:10", title: "Analise FP", meta: "Brix fora de alvo", status: "warning" },
  { time: "11:45", title: "Validação biométrica", meta: "Liberação PCC 03", status: "ok" },
  { time: "14:20", title: "Auditoria interna", meta: "Linha PET 2", status: "info" },
];

const supplierScores = [
  { name: "CitrusPrime", approval: "98%", trend: "+3%" },
  { name: "Sweet Harvest", approval: "93%", trend: "-1%" },
  { name: "Atlantic CO2", approval: "100%", trend: "+0%" },
];

const foodSafety = [
  { label: "PRP", status: "On track", description: "Checklists 100%" },
  { label: "OPRP", status: "1 desvio", description: "Pasteurização" },
  { label: "PCC", status: "Biometria pendente", description: "Temperatura envase" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 text-white">
      <HeroBanner />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            description={kpi.description}
            icon={kpi.icon}
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Produto Final</p>
              <p className="text-2xl font-semibold">Tendência inline</p>
            </div>
            <Button variant="secondary" size="sm">
              Exportar dados
            </Button>
          </div>
          <div className="mt-6">
            <TrendChart
              data={trendData}
              xKey="date"
              series={[
                { name: "CO₂ (g/L)", dataKey: "co2", color: "#38bdf8" },
                { name: "Brix", dataKey: "brix", color: "#f97316" },
                { name: "pH", dataKey: "ph", color: "#a3e635" },
              ]}
            />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Janela especificação", value: "11.8 - 12.2" },
              { label: "Turno", value: "Noite A" },
              { label: "Linha", value: "PET 2" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">{item.label}</p>
                <p className="text-lg font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Fila do laboratório</p>
              <p className="text-2xl font-semibold">Status análises</p>
            </div>
            <Button size="sm">Novo teste</Button>
          </div>
          <div className="mt-6 space-y-4">
            {labQueue.map((item) => (
              <div key={item.lot} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{item.lot}</span>
                  <span className="uppercase tracking-[0.3em] text-white/40">{item.status}</span>
                </div>
                <p className="text-lg font-semibold">{item.product}</p>
                <p className="text-xs text-white/60">Analista {item.analyst}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <ActivityTimeline items={timelineData} />
        <GlassPanel>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Fornecedores</p>
          <p className="text-lg font-semibold">Qualidade & aprovação</p>
          <div className="mt-6 space-y-4">
            {supplierScores.map((supplier) => (
              <div key={supplier.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{supplier.name}</p>
                  <p className="text-xs text-white/60">Taxa de aprovação</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold">{supplier.approval}</p>
                  <p className="text-xs text-white/60">{supplier.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Food Safety</p>
          <p className="text-lg font-semibold">PRP / OPRP / PCC</p>
          <div className="mt-6 space-y-4">
            {foodSafety.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-white/60">{item.description}</p>
                <p className="mt-2 text-lg font-semibold">{item.status}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
