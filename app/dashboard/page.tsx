"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SidePanel } from "@/components/ui/side-panel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface KpiCard {
  title: string;
  value: string;
  helper: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
}

type ParameterKey = "brix" | "co2" | "ph" | "density";
type TimeframeKey = "24h" | "7d" | "30d" | "ytd";
type TestRangeKey = "daily" | "weekly" | "monthly" | "yearly";

type TimelinePoint = {
  timestamp: string;
} & Record<ParameterKey, number>;

type ParameterPoint = {
  timestamp: string;
  value: number;
  lsl: number;
  usl: number;
  target: number;
};

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

const timelinePoints: TimelinePoint[] = [
  { timestamp: "02h", brix: 11.82, co2: 6.12, ph: 3.15, density: 1.029 },
  { timestamp: "04h", brix: 11.9, co2: 6.2, ph: 3.14, density: 1.028 },
  { timestamp: "06h", brix: 11.88, co2: 6.08, ph: 3.17, density: 1.03 },
  { timestamp: "08h", brix: 11.95, co2: 6.22, ph: 3.12, density: 1.027 },
  { timestamp: "10h", brix: 11.91, co2: 6.3, ph: 3.16, density: 1.029 },
  { timestamp: "12h", brix: 11.86, co2: 6.15, ph: 3.19, density: 1.031 },
  { timestamp: "14h", brix: 11.93, co2: 6.18, ph: 3.18, density: 1.028 },
  { timestamp: "16h", brix: 12.02, co2: 6.25, ph: 3.2, density: 1.026 },
  { timestamp: "18h", brix: 11.98, co2: 6.32, ph: 3.22, density: 1.027 },
  { timestamp: "20h", brix: 11.87, co2: 6.28, ph: 3.21, density: 1.029 },
  { timestamp: "22h", brix: 11.9, co2: 6.24, ph: 3.18, density: 1.028 },
  { timestamp: "24h", brix: 11.85, co2: 6.12, ph: 3.17, density: 1.03 },
  { timestamp: "26h", brix: 11.88, co2: 6.05, ph: 3.16, density: 1.029 },
  { timestamp: "28h", brix: 11.9, co2: 6.18, ph: 3.14, density: 1.03 },
  { timestamp: "30h", brix: 11.95, co2: 6.25, ph: 3.13, density: 1.028 },
  { timestamp: "32h", brix: 11.99, co2: 6.33, ph: 3.15, density: 1.027 },
];

const parameterConfigs: Record<ParameterKey, { label: string; unit: string; color: string; lsl: number; usl: number; target: number }> = {
  brix: { label: "Brix", unit: "°Bx", color: "#c084fc", lsl: 11.6, usl: 12.2, target: 11.9 },
  co2: { label: "CO₂", unit: "g/L", color: "#38bdf8", lsl: 5.9, usl: 6.4, target: 6.15 },
  ph: { label: "pH", unit: "pH", color: "#34d399", lsl: 3.08, usl: 3.25, target: 3.16 },
  density: { label: "Densidade", unit: "g/cm³", color: "#f472b6", lsl: 1.026, usl: 1.032, target: 1.029 },
};

const parameterSeries = (Object.keys(parameterConfigs) as ParameterKey[]).reduce(
  (acc, key) => {
    const config = parameterConfigs[key];
    acc[key] = timelinePoints.map((point) => ({
      timestamp: point.timestamp,
      value: point[key],
      lsl: config.lsl,
      usl: config.usl,
      target: config.target,
    }));
    return acc;
  },
  {} as Record<ParameterKey, ParameterPoint[]>
);

const timeframeOptions: { key: TimeframeKey; label: string; points: number }[] = [
  { key: "24h", label: "Últ. 24h", points: 8 },
  { key: "7d", label: "7 dias", points: 10 },
  { key: "30d", label: "30 dias", points: 14 },
  { key: "ytd", label: "YTD", points: timelinePoints.length },
];

const productParameterFilters = [
  { value: "all", label: "Todos os SKUs" },
  { value: "cola-zero", label: "Cola Zero 350ml" },
  { value: "guarana", label: "Guaraná 1L" },
  { value: "cha-pessego", label: "Chá Pêssego" },
];

const testsVolume: Record<TestRangeKey, number> = {
  daily: 148,
  weekly: 782,
  monthly: 3210,
  yearly: 28140,
};

const testsRangeLabels: Record<TestRangeKey, string> = {
  daily: "Últimas 24h",
  weekly: "Últimos 7d",
  monthly: "Últimos 30d",
  yearly: "Acumulado do Ano",
};

const analystsRanking = [
  { name: "L. Pereira", count: 48 },
  { name: "F. Santos", count: 44 },
  { name: "C. Braga", count: 41 },
];

const productDistribution = [
  { name: "Cola Zero", value: 32 },
  { name: "Guaraná", value: 24 },
  { name: "Chá Pêssego", value: 18 },
  { name: "Água Tônica", value: 14 },
  { name: "Outros", value: 12 },
];

const productColors = ["#22d3ee", "#818cf8", "#f472b6", "#34d399", "#fbbf24"];

const lineActivity = [
  { line: "PET 2", running: 14, changeover: 2, downtime: 1 },
  { line: "Lata 1", running: 12, changeover: 3, downtime: 2 },
  { line: "Vidro", running: 9, changeover: 4, downtime: 3 },
  { line: "Siropeira", running: 11, changeover: 2, downtime: 2 },
];

const alertSummary = [
  { label: "NC críticas", value: "3", helper: "2 aguardando 8D" },
  { label: "Auditorias", value: "4", helper: "1 em campo" },
  { label: "Treinamentos", value: "11", helper: "4 vencem em 7 dias" },
];

const kpiCards: KpiCard[] = [
  { title: "Lotes liberados (24h)", value: "48", helper: "+6% vs semana passada", delta: "+6%", trend: "up" },
  { title: "NCs críticas", value: "3", helper: "2 aguardando 8D", delta: "-1", trend: "down" },
  { title: "Precisão PCC", value: "98.4%", helper: "Últimas 72h", trend: "flat" },
  { title: "Lab turnaround", value: "42 min", helper: "Target 45 min", trend: "up" },
  { title: "Treinamentos ativos", value: "11", helper: "4 vencendo em 7 dias" },
  { title: "Materiais em quarentena", value: "5", helper: "Todos aguardam COA", delta: "+2", trend: "up" },
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
    stage: "Acabado",
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
    stage: "Acabado",
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
    stage: "Intermédio",
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
    stage: "Acabado",
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
    stage: "Acabado",
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
    { parameter: "Sensorial", result: "Aprovado", target: "Aprovado", status: "success", analyst: "Comitê", timestamp: "08:00" },
  ],
  "PL-240915-04": [
    { parameter: "Brix", result: "10.94 °Bx", target: "11.0 ±0.3", status: "warning", analyst: "R. Lima", timestamp: "09:05" },
    { parameter: "pH", result: "3.32", target: "3.25 ±0.05", status: "warning", analyst: "R. Lima", timestamp: "09:07" },
    { parameter: "CO₂", result: "5.82 g/L", target: "5.9 ±0.2", status: "warning", analyst: "E. Braga", timestamp: "09:10" },
    { parameter: "Cor", result: "16.8", target: "17 ±1", status: "success", analyst: "E. Braga", timestamp: "09:16" },
    { parameter: "Acidez", result: "0.41 %", target: "0.38 ±0.05", status: "success", analyst: "E. Braga", timestamp: "09:20" },
    { parameter: "Micro (30°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "M. Silva", timestamp: "09:45" },
    { parameter: "Micro (45°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "M. Silva", timestamp: "10:05" },
    { parameter: "Sensorial", result: "Observação", target: "Aprovado", status: "warning", analyst: "Painel", timestamp: "10:30" },
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
    { parameter: "Sensorial", result: "Reprovado", target: "Aprovado", status: "danger", analyst: "Painel", timestamp: "14:40" },
  ],
  "PL-240915-15": [
    { parameter: "Condutividade", result: "247 µS/cm", target: "240 ±10", status: "success", analyst: "G. Vieira", timestamp: "06:15" },
    { parameter: "CO₂", result: "6.45 g/L", target: "6.4 ±0.2", status: "success", analyst: "G. Vieira", timestamp: "06:17" },
    { parameter: "pH", result: "6.82", target: "6.8 ±0.1", status: "success", analyst: "G. Vieira", timestamp: "06:19" },
    { parameter: "Cloretos", result: "8.1 mg/L", target: "≤10", status: "success", analyst: "M. Ramos", timestamp: "06:28" },
    { parameter: "Sódio", result: "9.4 mg/L", target: "≤12", status: "success", analyst: "M. Ramos", timestamp: "06:32" },
    { parameter: "Micro (30°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "C. Silva", timestamp: "06:55" },
    { parameter: "Micro (45°C)", result: "Ausente", target: "Ausente", status: "success", analyst: "C. Silva", timestamp: "07:10" },
    { parameter: "Sensorial", result: "Aprovado", target: "Aprovado", status: "success", analyst: "Painel", timestamp: "07:40" },
  ],
};

const activityFeed: ActivityItem[] = [
  { id: "act-01", title: "PCC 12 – Carbo Cooler", description: "Desvio corrigido e validado por Supervisor", timestamp: "08:24", status: "success" },
  { id: "act-02", title: "NC-4587", description: "Amostras coletadas e aguardando resultado microbiológico", timestamp: "08:10", status: "warning" },
  { id: "act-03", title: "Treinamento HACCP", description: "12 técnicos concluíram módulo PRP", timestamp: "07:55", status: "neutral" },
  { id: "act-04", title: "Audit trail", description: "Revisão semanal concluída pelo QA Manager", timestamp: "07:32", status: "success" },
  { id: "act-05", title: "Matéria-prima – Lote Açúcar 4412", description: "Liberado após COA anexado", timestamp: "07:12", status: "success" },
];

const riskVariantMap: Record<LotRow["risk"], "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const timeframeMap = timeframeOptions.reduce<Record<TimeframeKey, number>>((acc, option) => {
  acc[option.key] = option.points;
  return acc;
}, {} as Record<TimeframeKey, number>);

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
          <div className="relative h-3 w-full rounded-full bg-slate-900/70">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500/80"
              style={{ width: `${(item.cpk / max) * 100}%` }}
            />
          </div>
          <div className="mt-1 text-xs text-slate-500">OOS {item.oosRate.toFixed(1)}%</div>
        </div>
      ))}
    </div>
  );
}

function ReleaseBarChart({ data }: { data: { label: string; released: number; blocked: number }[] }) {
  const max = Math.max(...data.map((point) => point.released + point.blocked));
  return (
    <div className="space-y-3">
      {data.map((point) => (
        <div key={point.label}>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
            <span>{point.label}</span>
            <span>{point.released + point.blocked} lotes</span>
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded-full border border-slate-800/80 bg-slate-950">
            <div className="bg-emerald-500/80" style={{ width: `${(point.released / max) * 100}%` }} />
            <div className="bg-red-500/70" style={{ width: `${(point.blocked / max) * 100}%` }} />
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
  const [selectedParameter, setSelectedParameter] = useState<ParameterKey>("brix");
  const [selectedRange, setSelectedRange] = useState<TimeframeKey>("24h");
  const [testsRange, setTestsRange] = useState<TestRangeKey>("daily");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [selectedLot, setSelectedLot] = useState<LotRow | null>(null);

  const userName = "Analista";

  const filteredProcessData = useMemo(() => {
    const base = parameterSeries[selectedParameter];
    const slice = timeframeMap[selectedRange];
    if (slice >= base.length) {
      return base;
    }
    return base.slice(base.length - slice);
  }, [selectedParameter, selectedRange]);

  const totalTestsValue = testsVolume[testsRange];
  const productDistributionTotal = useMemo(
    () => productDistribution.reduce((acc, item) => acc + item.value, 0),
    []
  );

  const activeLotTests = selectedLot ? lotLabTests[selectedLot.lotCode] ?? [] : [];
  const productFilterLabel =
    productParameterFilters.find((item) => item.value === productFilter)?.label ?? "Todos os SKUs";

  return (
    <div className="space-y-8">
      <section className="grid gap-4 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-[28px] border border-slate-900/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-[0_20px_80px_rgba(2,6,23,0.65)]">
          <p className="text-sm text-slate-400">Bem-vindo de volta,</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">{userName}!</h1>
          <p className="mt-2 text-lg text-slate-300">Aqui está o seu Resumo da Qualidade SmartLab</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {parameterConfigs[selectedParameter] && (
              <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Parâmetro</p>
                <p className="text-2xl font-semibold text-white">
                  {parameterConfigs[selectedParameter].label}
                </p>
                <p className="text-sm text-slate-400">{productFilterLabel}</p>
              </div>
            )}
            <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Processos monitorados</p>
              <p className="text-2xl font-semibold text-white">{timelinePoints.length}</p>
              <p className="text-sm text-slate-400">Últimas {timeframeMap[selectedRange]} leituras</p>
            </div>
            <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Filtro SKU</p>
              <Select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}>
                {productParameterFilters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-900/80 bg-slate-950/80 p-6 shadow-[0_16px_60px_rgba(2,6,23,0.55)]">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Alertas instantâneos</p>
          <div className="mt-4 space-y-4">
            {alertSummary.map((alert) => (
              <div
                key={alert.label}
                className="flex items-center justify-between rounded-2xl border border-slate-900/60 bg-slate-950/70 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{alert.label}</p>
                  <p className="text-xs text-slate-500">{alert.helper}</p>
                </div>
                <span className="text-2xl font-semibold text-emerald-400">{alert.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/70 p-6 shadow-[0_25px_80px_rgba(2,6,23,0.55)]">
          <CardHeader className="px-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <CardTitle>Janela de Processo</CardTitle>
                <CardDescription>
                  {parameterConfigs[selectedParameter].label} • {testsRangeLabels.daily}
                </CardDescription>
              </div>
              <Tabs
                value={selectedParameter}
                onValueChange={(value) => setSelectedParameter(value as ParameterKey)}
                className="w-full lg:w-auto"
              >
                <TabsList className="grid grid-cols-4 rounded-2xl border border-slate-800/80 bg-slate-950/60">
                  {(Object.keys(parameterConfigs) as ParameterKey[]).map((key) => (
                    <TabsTrigger key={key} value={key} className="text-xs uppercase tracking-[0.2em]">
                      {parameterConfigs[key].label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <div className="flex flex-wrap gap-2">
              {timeframeOptions.map((option) => (
                <Button
                  key={option.key}
                  variant={selectedRange === option.key ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedRange(option.key)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={filteredProcessData} margin={{ top: 10, left: -10, right: 10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.2)" strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" stroke="rgba(148,163,184,0.7)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148,163,184,0.7)" tickLine={false} axisLine={false} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{ background: "#020617", borderRadius: 16, border: "1px solid rgba(148,163,184,0.2)" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ color: "#94a3b8" }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Valor"
                  stroke={parameterConfigs[selectedParameter].color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line type="monotone" dataKey="target" name="Alvo" stroke="#22d3ee" strokeDasharray="6 4" strokeWidth={2} />
                <Line type="monotone" dataKey="lsl" name="LIE" stroke="#fbbf24" strokeDasharray="2 6" strokeWidth={2} />
                <Line type="monotone" dataKey="usl" name="LSE" stroke="#fbbf24" strokeDasharray="2 6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="rounded-3xl border border-slate-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-[0_25px_80px_rgba(2,6,23,0.45)]">
            <CardHeader className="px-0">
              <CardTitle>Total de Análises</CardTitle>
              <CardDescription>{testsRangeLabels[testsRange]}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <Select value={testsRange} onChange={(event) => setTestsRange(event.target.value as TestRangeKey)}>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
                <option value="yearly">Anual</option>
              </Select>
              <p className="text-5xl font-semibold text-white">{totalTestsValue}</p>
              <p className="text-sm text-slate-400">Ensaios sincronizados com LIMS SmartLab.</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/80 p-6 shadow-[0_20px_70px_rgba(2,6,23,0.45)]">
            <CardHeader className="px-0">
              <CardTitle>Top 3 Analistas – Mês</CardTitle>
              <CardDescription>Rankeados por análises registradas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              {analystsRanking.map((analyst, index) => (
                <div
                  key={analyst.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-900/60 bg-slate-950/70 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">#{index + 1}</span>
                    <p className="text-base font-semibold text-white">{analyst.name}</p>
                  </div>
                  <p className="text-sm text-slate-300">{analyst.count} análises</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/70 p-6 shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
          <CardHeader className="px-0">
            <CardTitle>Distribuição de Produtos</CardTitle>
            <CardDescription>Últimas 24h</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={productDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} paddingAngle={2}>
                  {productDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={productColors[index % productColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#020617", borderRadius: 16, border: "1px solid rgba(148,163,184,0.2)" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-slate-400">Total {productDistributionTotal} lotes monitorados</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/70 p-6 shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
          <CardHeader className="px-0">
            <CardTitle>Atividade das Linhas</CardTitle>
            <CardDescription>Distribuição de status por hora</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={lineActivity} stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="line" stroke="rgba(148,163,184,0.7)" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#020617", borderRadius: 16, border: "1px solid rgba(148,163,184,0.2)" }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend wrapperStyle={{ color: "#94a3b8" }} />
                <Bar dataKey="running" stackId="a" fill="#34d399" name="Em produção" radius={[6, 6, 0, 0]} />
                <Bar dataKey="changeover" stackId="a" fill="#fbbf24" name="Troca" radius={[0, 0, 0, 0]} />
                <Bar dataKey="downtime" stackId="a" fill="#f87171" name="Parada" radius={[0, 0, 6, 6]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kpiCards.map((kpi) => (
            <Card
              key={kpi.title}
              className="rounded-3xl border border-slate-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 shadow-[0_16px_60px_rgba(2,6,23,0.45)] transition hover:-translate-y-0.5"
            >
              <CardHeader className="px-0 pb-2">
                <CardDescription className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {kpi.title}
                </CardDescription>
                <CardTitle className="text-3xl text-white">{kpi.value}</CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <p className="text-sm text-slate-400">{kpi.helper}</p>
                {kpi.delta && (
                  <p
                    className={
                      kpi.trend === "down"
                        ? "text-red-400"
                        : kpi.trend === "up"
                        ? "text-emerald-400"
                        : "text-slate-400"
                    }
                  >
                    {kpi.delta} vs período anterior
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/70 p-6 shadow-[0_20px_70px_rgba(2,6,23,0.45)] xl:col-span-2">
          <CardHeader className="px-0">
            <CardTitle>Janela de Capabilidade</CardTitle>
            <CardDescription>Cpk real vs taxa de OOS</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 px-0 lg:grid-cols-2">
            <CapabilityChart data={capabilityBreakdown} />
            <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4">
              <p className="text-sm font-semibold text-white">Lotes liberados x bloqueados</p>
              <p className="text-xs text-slate-500">Últimos 5 dias</p>
              <div className="mt-4">
                <ReleaseBarChart data={releasePerformance} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/70 p-6 shadow-[0_20px_70px_rgba(2,6,23,0.45)]">
          <CardHeader className="px-0">
            <CardTitle>Notas de turno</CardTitle>
            <CardDescription>Checklist digital</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-0">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Alertas críticos</p>
              <Input readOnly value="NC-4587 aguardando microbiologia" className="bg-slate-950/60" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Pontos de atenção</p>
              <Input readOnly value="Linha Vidro com variação de CO₂" className="bg-slate-950/60" />
            </div>
            <p className="text-xs text-slate-500">Última atualização às 07:45 por Gestor de Qualidade.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/70 p-6 shadow-[0_20px_70px_rgba(2,6,23,0.45)] lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 px-0 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Lotes recentes</CardTitle>
              <CardDescription>Clique para explorar os últimos testes laboratoriais</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Exportar
            </Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Planta / Turno</TableHead>
                  <TableHead>Conformidade</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLots.map((lot) => (
                  <TableRow key={lot.lotCode} className="cursor-pointer" onClick={() => setSelectedLot(lot)}>
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
                        {lot.alerts > 0 && <Badge variant="warning">{lot.alerts} alerta(s)</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={riskVariantMap[lot.risk]}>
                        {lot.risk === "low" ? "Estável" : lot.risk === "medium" ? "Monitorar" : "Crítico"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-slate-900/70 bg-slate-950/70 p-6 shadow-[0_20px_70px_rgba(2,6,23,0.45)]">
          <CardHeader className="px-0">
            <CardTitle>Atividade recente</CardTitle>
            <CardDescription>Eventos sincronizados das últimas horas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-0">
            {activityFeed.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{item.timestamp}</span>
                  <Badge
                    variant={
                      item.status === "success"
                        ? "success"
                        : item.status === "warning"
                        ? "warning"
                        : item.status === "danger"
                        ? "danger"
                        : "neutral"
                    }
                  >
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
              </div>
            ))}
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
            <div className="rounded-2xl border border-slate-900 bg-slate-950/50 p-4">
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
                  <p className="text-xs text-slate-500">Conformidade</p>
                  <p>{selectedLot.compliance.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <Badge variant={riskVariantMap[selectedLot.risk]}>
                    {selectedLot.risk === "low" ? "Estável" : selectedLot.risk === "medium" ? "Monitorar" : "Crítico"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-900 bg-slate-950/50">
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
                            {test.status === "success" ? "OK" : test.status === "warning" ? "Ajustar" : "Crítico"}
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
