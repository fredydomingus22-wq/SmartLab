"use client";

import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SidePanel } from "@/components/ui/side-panel";
import { Button } from "@/components/ui/button";

interface KpiCard {
  title: string;
  value: string;
  helper: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
}

type ProcessMetricKey = "co2" | "brix" | "ph";

interface ProcessPoint {
  label: string;
  co2: number;
  brix: number;
  ph: number;
}

interface ProcessSeries {
  key: ProcessMetricKey;
  name: string;
  color: string;
  unit: string;
}

interface CapabilityItem {
  label: string;
  cpk: number;
  oosRate: number;
}

interface LotRow {
  lotCode: string;
  product: string;
  stage: string;
  plant: string;
  shift: string;
  releaseEta: string;
  compliance: number;
  risk: "low" | "medium" | "high";
  alerts: number;
}

interface LabTest {
  parameter: string;
  result: string;
  target: string;
  status: "success" | "warning" | "danger";
  analyst: string;
  timestamp: string;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "danger" | "neutral";
}

const kpiCards: KpiCard[] = [
  {
    title: "Lotes liberados (24h)",
    value: "48",
    helper: "+6% vs semana passada",
    delta: "+6%",
    trend: "up",
  },
  {
    title: "NCs críticas",
    value: "3",
    helper: "2 aguardando 8D",
    delta: "-1",
    trend: "down",
  },
  {
    title: "Precisão PCC",
    value: "98.4%",
    helper: "Últimas 72h",
    trend: "flat",
  },
  {
    title: "Lab turnaround",
    value: "42 min",
    helper: "Target 45 min",
    trend: "up",
  },
  {
    title: "Treinamentos ativos",
    value: "11",
    helper: "4 vencendo em 7 dias",
  },
  {
    title: "Materiais em quarentena",
    value: "5",
    helper: "Todos aguardam COA",
    delta: "+2",
    trend: "up",
  },
];

const processTrend: ProcessPoint[] = [
  { label: "06h", co2: 5.9, brix: 11.8, ph: 3.18 },
  { label: "08h", co2: 6.1, brix: 11.9, ph: 3.15 },
  { label: "10h", co2: 5.8, brix: 12.0, ph: 3.21 },
  { label: "12h", co2: 6.2, brix: 11.7, ph: 3.14 },
  { label: "14h", co2: 6.05, brix: 11.9, ph: 3.12 },
  { label: "16h", co2: 5.85, brix: 11.8, ph: 3.19 },
  { label: "18h", co2: 6.15, brix: 12.1, ph: 3.17 },
];

const processSeries: ProcessSeries[] = [
  { key: "co2", name: "CO₂ (g/L)", color: "#38bdf8", unit: "g/L" },
  { key: "brix", name: "Brix", color: "#fbbf24", unit: "°Bx" },
  { key: "ph", name: "pH", color: "#34d399", unit: "pH" },
];

const capabilityBreakdown: CapabilityItem[] = [
  { label: "Linha PET 2", cpk: 1.58, oosRate: 0.8 },
  { label: "Linha Lata", cpk: 1.44, oosRate: 1.6 },
  { label: "Siropeira A", cpk: 1.32, oosRate: 2.0 },
  { label: "Envase Vidro", cpk: 1.19, oosRate: 3.4 },
];

const releasePerformance = [
  { label: "Seg", released: 18, blocked: 1 },
  { label: "Ter", released: 17, blocked: 2 },
  { label: "Qua", released: 20, blocked: 0 },
  { label: "Qui", released: 19, blocked: 1 },
  { label: "Sex", released: 22, blocked: 2 },
];

const recentLots: LotRow[] = [
  {
    lotCode: "PL-240915-01",
    product: "Cola Zero 350ml",
    stage: "Finished",
    plant: "Linha PET 2",
    shift: "Noite",
    releaseEta: "3h",
    compliance: 99.6,
    risk: "low",
    alerts: 0,
  },
  {
    lotCode: "PL-240915-04",
    product: "Guaraná Tradicional",
    stage: "Finished",
    plant: "Linha Lata",
    shift: "Tarde",
    releaseEta: "1h",
    compliance: 98.2,
    risk: "medium",
    alerts: 1,
  },
  {
    lotCode: "PL-240915-07",
    product: "Tangerina Light",
    stage: "Intermediate",
    plant: "Siropeira B",
    shift: "Manhã",
    releaseEta: "45m",
    compliance: 97.1,
    risk: "medium",
    alerts: 2,
  },
  {
    lotCode: "PL-240915-11",
    product: "Chá Pêssego",
    stage: "Finished",
    plant: "Envase Vidro",
    shift: "Tarde",
    releaseEta: "5h",
    compliance: 95.4,
    risk: "high",
    alerts: 3,
  },
  {
    lotCode: "PL-240915-15",
    product: "Água com gás",
    stage: "Finished",
    plant: "Linha Lata",
    shift: "Noite",
    releaseEta: "Liberado",
    compliance: 99.9,
    risk: "low",
    alerts: 0,
  },
];

const lotLabTests: Record<string, LabTest[]> = {
  "PL-240915-01": [
    { parameter: "Brix", result: "11.92 °Bx", target: "11.9 ±0.2", status: "success", analyst: "L. Pereira", timestamp: "07:10" },
    { parameter: "pH", result: "3.16", target: "3.15 ±0.05", status: "success", analyst: "L. Pereira", timestamp: "07:12" },
    { parameter: "CO₂", result: "6.05 g/L", target: "6.1 ±0.2", status: "warning", analyst: "F. Santos", timestamp: "07:18" },
    { parameter: "Cor", result: "13.2", target: "13 ±1", status: "success", analyst: "F. Santos", timestamp: "07:23" },
    { parameter: "Açúcar Red.", result: "1.8 g/L", target: "≤2.0", status: "success", analyst: "V. Costa", timestamp: "07:31" },
    { parameter: "Acidez", result: "0.38 %", target: "0.35 ±0.05", status: "success", analyst: "V. Costa", timestamp: "07:35" },
    { parameter: "Micro (30°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "S. Rocha", timestamp: "07:44" },
    { parameter: "Sensory", result: "Aprovado", target: "Aprovado", status: "success", analyst: "Comitê", timestamp: "08:00" },
  ],
  "PL-240915-04": [
    { parameter: "Brix", result: "10.94 °Bx", target: "11.0 ±0.3", status: "warning", analyst: "R. Lima", timestamp: "09:05" },
    { parameter: "pH", result: "3.32", target: "3.25 ±0.05", status: "warning", analyst: "R. Lima", timestamp: "09:07" },
    { parameter: "CO₂", result: "5.82 g/L", target: "5.9 ±0.2", status: "warning", analyst: "E. Braga", timestamp: "09:10" },
    { parameter: "Cor", result: "16.8", target: "17 ±1", status: "success", analyst: "E. Braga", timestamp: "09:16" },
    { parameter: "Acidez", result: "0.41 %", target: "0.38 ±0.05", status: "success", analyst: "E. Braga", timestamp: "09:20" },
    { parameter: "Micro (30°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "M. Silva", timestamp: "09:45" },
    { parameter: "Micro (45°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "M. Silva", timestamp: "10:05" },
    { parameter: "Sensory", result: "Observação", target: "Aprovado", status: "warning", analyst: "Painel", timestamp: "10:30" },
  ],
  "PL-240915-07": [
    { parameter: "Sólidos", result: "34.2 %", target: "34 ±1", status: "success", analyst: "D. Barros", timestamp: "11:02" },
    { parameter: "pH", result: "3.08", target: "3.1 ±0.05", status: "warning", analyst: "D. Barros", timestamp: "11:06" },
    { parameter: "Brix", result: "63.5 °Bx", target: "63 ±0.5", status: "success", analyst: "D. Barros", timestamp: "11:10" },
    { parameter: "Viscosidade", result: "118 cP", target: "120 ±10", status: "success", analyst: "C. Nunes", timestamp: "11:14" },
    { parameter: "Cor", result: "34.0", target: "34 ±2", status: "success", analyst: "C. Nunes", timestamp: "11:19" },
    { parameter: "Acidez", result: "0.27 %", target: "0.25 ±0.03", status: "warning", analyst: "C. Nunes", timestamp: "11:24" },
    { parameter: "Micro (30°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "T. Prado", timestamp: "11:40" },
    { parameter: "Micro (45°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "T. Prado", timestamp: "11:55" },
  ],
  "PL-240915-11": [
    { parameter: "Brix", result: "8.8 °Bx", target: "9.2 ±0.3", status: "danger", analyst: "H. Souza", timestamp: "13:12" },
    { parameter: "pH", result: "3.45", target: "3.30 ±0.05", status: "danger", analyst: "H. Souza", timestamp: "13:14" },
    { parameter: "CO₂", result: "4.95 g/L", target: "5.4 ±0.3", status: "danger", analyst: "H. Souza", timestamp: "13:16" },
    { parameter: "Cor", result: "21.1", target: "20 ±2", status: "warning", analyst: "P. Melo", timestamp: "13:22" },
    { parameter: "Acidez", result: "0.33 %", target: "0.30 ±0.03", status: "warning", analyst: "P. Melo", timestamp: "13:28" },
    { parameter: "Micro (30°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "M. Costa", timestamp: "13:50" },
    { parameter: "Micro (45°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "M. Costa", timestamp: "14:10" },
    { parameter: "Sensory", result: "Reprovado", target: "Aprovado", status: "danger", analyst: "Painel", timestamp: "14:40" },
  ],
  "PL-240915-15": [
    { parameter: "Condutividade", result: "247 µS/cm", target: "240 ±10", status: "success", analyst: "G. Vieira", timestamp: "06:15" },
    { parameter: "CO₂", result: "6.45 g/L", target: "6.4 ±0.2", status: "success", analyst: "G. Vieira", timestamp: "06:17" },
    { parameter: "pH", result: "6.82", target: "6.8 ±0.1", status: "success", analyst: "G. Vieira", timestamp: "06:19" },
    { parameter: "Cloretos", result: "8.1 mg/L", target: "≤10", status: "success", analyst: "M. Ramos", timestamp: "06:28" },
    { parameter: "Sódio", result: "9.4 mg/L", target: "≤12", status: "success", analyst: "M. Ramos", timestamp: "06:32" },
    { parameter: "Micro (30°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "C. Silva", timestamp: "06:55" },
    { parameter: "Micro (45°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "C. Silva", timestamp: "07:10" },
    { parameter: "Sensory", result: "Aprovado", target: "Aprovado", status: "success", analyst: "Painel", timestamp: "07:40" },
  ],
};

const activityFeed: ActivityItem[] = [
  {
    id: "act-01",
    title: "PCC 12 – Carbo Cooler",
    description: "Desvio corrigido e validado por Supervisor",
    timestamp: "08:24",
    status: "success",
  },
  {
    id: "act-02",
    title: "NC-4587",
    description: "Amostras coletadas e aguardando resultado microbiológico",
    timestamp: "08:10",
    status: "warning",
  },
  {
    id: "act-03",
    title: "Treinamento HACCP",
    description: "12 técnicos concluíram módulo PRP",
    timestamp: "07:55",
    status: "neutral",
  },
  {
    id: "act-04",
    title: "Audit trail",
    description: "Revisão semanal concluída pelo QA Manager",
    timestamp: "07:32",
    status: "success",
  },
  {
    id: "act-05",
    title: "Matéria-prima – Lote Açúcar 4412",
    description: "Liberado após COA anexado",
    timestamp: "07:12",
    status: "success",
  },
];

const riskVariantMap: Record<LotRow["risk"], "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

function MultiSeriesLineChart({
  data,
  series,
}: {
  data: ProcessPoint[];
  series: ProcessSeries[];
}) {
  const width = 640;
  const height = 260;
  const padding = 32;
  const numericValues = data.flatMap((point) =>
    series.map((serie) => point[serie.key] as number)
  );
  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);
  const safeRange = max - min === 0 ? 1 : max - min;
  const innerHeight = height - padding * 2;

  const buildPath = (serie: ProcessSeries) =>
    data
      .map((point, index) => {
        const value = point[serie.key] as number;
        const x = padding +
          (data.length > 1 ? (index / (data.length - 1)) * (width - padding * 2) : 0);
        const y = height - padding - ((value - min) / safeRange) * innerHeight;
        return `${index === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-64 w-full text-slate-500">
      {[0, 1, 2, 3].map((line) => {
        const y = padding + (line / 3) * innerHeight;
        return (
          <line
            key={line}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth={1}
          />
        );
      })}
      {series.map((serie) => (
        <g key={serie.key}>
          <path
            d={buildPath(serie)}
            fill="none"
            stroke={serie.color}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {data.map((point, index) => {
            const value = point[serie.key] as number;
            const x = padding +
              (data.length > 1 ? (index / (data.length - 1)) * (width - padding * 2) : 0);
            const y = height - padding - ((value - min) / safeRange) * innerHeight;
            return (
              <circle key={`${serie.key}-${point.label}`} cx={x} cy={y} r={3} fill={serie.color} />
            );
          })}
        </g>
      ))}
      {data.map((point, index) => {
        const x = padding +
          (data.length > 1 ? (index / (data.length - 1)) * (width - padding * 2) : 0);
        return (
          <text key={point.label} x={x} y={height - 4} textAnchor="middle" className="text-[11px] fill-slate-400">
            {point.label}
          </text>
        );
      })}
    </svg>
  );
}

function CapabilityChart({ data }: { data: CapabilityItem[] }) {
  const max = Math.max(...data.map((item) => item.cpk));
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>{item.label}</span>
            <span>Cpk {item.cpk.toFixed(2)}</span>
          </div>
          <div className="relative h-3 w-full rounded-full bg-slate-900">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500/70"
              style={{ width: `${(item.cpk / max) * 100}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-slate-500">OOS {item.oosRate.toFixed(1)}%</div>
        </div>
      ))}
    </div>
  );
}

function ReleaseBarChart({
  data,
}: {
  data: { label: string; released: number; blocked: number }[];
}) {
  const max = Math.max(...data.map((point) => point.released + point.blocked));
  return (
    <div className="space-y-3">
      {data.map((point) => (
        <div key={point.label}>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>{point.label}</span>
            <span>{point.released + point.blocked} lotes</span>
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded-full border border-slate-800 bg-slate-950">
            <div
              className="bg-emerald-500/70"
              style={{ width: `${(point.released / max) * 100}%` }}
            />
            <div
              className="bg-red-500/60"
              style={{ width: `${(point.blocked / max) * 100}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>Liberados {point.released}</span>
            <span>Bloqueados {point.blocked}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [selectedLot, setSelectedLot] = useState<LotRow | null>(null);

  const activeLotTests = selectedLot ? lotLabTests[selectedLot.lotCode] ?? [] : [];
  const averageDailyReleases = (
    releasePerformance.reduce((acc, curr) => acc + curr.released, 0) /
    releasePerformance.length
  ).toFixed(1);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((kpi) => (
            <Card key={kpi.title} className="border-slate-900 bg-gradient-to-br from-slate-900/80 to-slate-950">
              <CardHeader className="space-y-1">
                <CardDescription className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {kpi.title}
                </CardDescription>
                <CardTitle className="text-3xl text-white">{kpi.value}</CardTitle>
                <p className="text-sm text-slate-400">{kpi.helper}</p>
              </CardHeader>
              {kpi.delta && (
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span
                      className={
                        kpi.trend === "down"
                          ? "text-red-400"
                          : kpi.trend === "up"
                          ? "text-emerald-400"
                          : "text-slate-400"
                      }
                    >
                      {kpi.delta}
                    </span>
                    <span>vs período anterior</span>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 border-slate-900">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle>Janela de Processo</CardTitle>
              <CardDescription>Monitoramento em tempo real de CO₂, Brix e pH</CardDescription>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-400">
              {processSeries.map((serie) => (
                <span key={serie.key} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: serie.color }} />
                  {serie.name}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultiSeriesLineChart data={processTrend} series={processSeries} />
            <div className="grid gap-4 sm:grid-cols-3">
              {processSeries.map((serie) => {
                const latest = processTrend[processTrend.length - 1][serie.key];
                return (
                  <div key={serie.key} className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{serie.name}</p>
                    <p className="text-2xl font-semibold text-white">{latest}{" "}{serie.unit}</p>
                    <p className="text-xs text-slate-400">Última leitura • {processTrend[processTrend.length - 1].label}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-900">
          <CardHeader>
            <CardTitle>Capabilidade por Linha</CardTitle>
            <CardDescription>Cpk real vs. taxa de OOS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CapabilityChart data={capabilityBreakdown} />
            <div className="rounded-xl border border-slate-900 p-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Avg lotes/dia</span>
                <span className="text-white">{averageDailyReleases}</span>
              </div>
              <div className="mt-3">
                <ReleaseBarChart data={releasePerformance} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-900">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Lotes recentes</CardTitle>
              <CardDescription>Clique para explorar os últimos testes laboratoriais</CardDescription>
            </div>
            <Button variant="ghost" size="sm">Exportar</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Planta / Turno</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLots.map((lot) => (
                  <TableRow
                    key={lot.lotCode}
                    className="cursor-pointer"
                    onClick={() => setSelectedLot(lot)}
                  >
                    <TableCell className="font-semibold text-white">
                      <div>{lot.lotCode}</div>
                      <p className="text-xs text-slate-500">ETA liberação {lot.releaseEta}</p>
                    </TableCell>
                    <TableCell>
                      <p>{lot.product}</p>
                      <p className="text-xs text-slate-500">{lot.stage}</p>
                    </TableCell>
                    <TableCell>
                      <p>{lot.plant}</p>
                      <p className="text-xs text-slate-500">Turno {lot.shift}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-white">{lot.compliance.toFixed(1)}%</span>
                        {lot.alerts > 0 && (
                          <Badge variant="warning">{lot.alerts} alerta(s)</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={riskVariantMap[lot.risk]}>
                        {lot.risk === "low"
                          ? "Estável"
                          : lot.risk === "medium"
                          ? "Monitorar"
                          : "Crítico"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-900">
          <CardHeader>
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>Eventos sincronizados das últimas horas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {activityFeed.map((item) => (
                <li key={item.id} className="rounded-xl border border-slate-900/80 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{item.timestamp}</span>
                    <Badge variant={item.status === "success" ? "success" : item.status === "warning" ? "warning" : item.status === "danger" ? "danger" : "neutral"}>
                      {item.status === "success"
                        ? "OK"
                        : item.status === "warning"
                        ? "ATENÇÃO"
                        : item.status === "danger"
                        ? "CRÍTICO"
                        : "INFO"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <SidePanel
        open={Boolean(selectedLot)}
        title={selectedLot ? `${selectedLot.lotCode} — ${selectedLot.product}` : undefined}
        description="Últimos 8 ensaios laboratoriais registrados"
        onClose={() => setSelectedLot(null)}
        footer={
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setSelectedLot(null)}>
              Fechar
            </Button>
          </div>
        }
      >
        {selectedLot && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-900 bg-slate-950/40 p-4">
              <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                <div>
                  <p className="text-xs text-slate-500">Planta</p>
                  <p>{selectedLot.plant}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Turno</p>
                  <p>{selectedLot.shift}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Compliance</p>
                  <p>{selectedLot.compliance.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <Badge variant={riskVariantMap[selectedLot.risk]}>
                    {selectedLot.risk === "low"
                      ? "Estável"
                      : selectedLot.risk === "medium"
                      ? "Monitorar"
                      : "Crítico"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-900">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parâmetro</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Especificação</TableHead>
                    <TableHead>Analista</TableHead>
                    <TableHead>Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeLotTests.map((test) => (
                    <TableRow key={`${test.parameter}-${test.timestamp}`}>
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span>{test.parameter}</span>
                          <Badge variant={test.status}>
                            {test.status === "success"
                              ? "OK"
                              : test.status === "warning"
                              ? "Ajustar"
                              : "Crítico"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>{test.result}</TableCell>
                      <TableCell>{test.target}</TableCell>
                      <TableCell>{test.analyst}</TableCell>
                      <TableCell>{test.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </SidePanel>
    </div>
  );
}
