import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const flowStages = [
  { key: "rm", title: "Matéria-prima (RM)", description: "Recebimento + COA", color: "from-emerald-500/30 via-emerald-500/10 to-transparent" },
  { key: "pl", title: "Lote pai", description: "Preparação xarope", color: "from-sky-500/30 via-sky-500/10 to-transparent" },
  { key: "pi", title: "Intermediário (PI)", description: "Tanques e blend", color: "from-amber-500/30 via-amber-500/10 to-transparent" },
  { key: "pf", title: "Produto final (PF)", description: "Envase / QA", color: "from-indigo-500/30 via-indigo-500/10 to-transparent" },
  { key: "nc", title: "NC / 8D", description: "Escalonamentos", color: "from-red-500/30 via-red-500/10 to-transparent" },
  { key: "pcc", title: "PCC / PRP", description: "Controles críticos", color: "from-slate-100/20 via-slate-100/5 to-transparent" },
];

const productionWindows = [
  {
    lot: "PL-240915-01",
    rm: "RM-ACUC-4412",
    pi: "INT-240915-05",
    pf: "PF-240915-09",
    nc: "-",
    pcc: "PCC-12",
    status: "Estável",
    risk: "success" as const,
  },
  {
    lot: "PL-240915-04",
    rm: "RM-AROMA-217",
    pi: "INT-240915-08",
    pf: "PF-240915-12",
    nc: "NC-4810",
    pcc: "PCC-07",
    status: "Investigar",
    risk: "warning" as const,
  },
  {
    lot: "PL-240915-11",
    rm: "RM-CHÁ-198",
    pi: "INT-240915-15",
    pf: "PF-240915-21",
    nc: "NC-4826",
    pcc: "PCC-14",
    status: "Crítico",
    risk: "danger" as const,
  },
];

const timelineHighlights = [
  { stage: "RM", detail: "COA açúcar validado", timestamp: "07:20", owner: "Lab RM" },
  { stage: "Lote pai", detail: "Preparação tanque 03", timestamp: "08:40", owner: "Siropeira" },
  { stage: "PI", detail: "Brix ajustado", timestamp: "09:15", owner: "PCP" },
  { stage: "PF", detail: "Envase PET 2", timestamp: "10:50", owner: "Produção" },
  { stage: "NC", detail: "NC-4826 aberta", timestamp: "11:05", owner: "Qualidade" },
  { stage: "PCC", detail: "PCC-14 inspecionado", timestamp: "11:30", owner: "Food Safety" },
];

export default function TraceabilityPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Rastreabilidade</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Linha do tempo global</h1>
          <p className="text-slate-400">
            Visualize RM → Lote Pai → PI → PF → NC → PCC em um único painel.
          </p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/traceability/PL-240915-01">Abrir lote em detalhe</Link>
        </Button>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Fluxo SmartLab</CardTitle>
          <CardDescription>Passos conectados e coloridos por domínio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-6">
            {flowStages.map((stage) => (
              <div
                key={stage.key}
                className={`relative flex flex-col gap-3 rounded-2xl border border-slate-900/70 bg-gradient-to-b ${stage.color} p-4 text-slate-200`}
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{stage.key.toUpperCase()}</p>
                </div>
                <p className="text-base font-semibold text-white">{stage.title}</p>
                <p className="text-sm text-slate-300">{stage.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Eventos recentes</CardTitle>
            <CardDescription>Últimos marcos ao longo da cadeia</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timelineHighlights.map((item) => (
              <div key={item.timestamp} className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{item.stage}</p>
                  <p className="text-sm text-slate-300">{item.detail}</p>
                  <p className="text-xs text-slate-500">{item.timestamp} · {item.owner}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Produção monitorada</CardTitle>
            <CardDescription>Lotes pai ativos com encadeamento completo</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote Pai</TableHead>
                  <TableHead>RM</TableHead>
                  <TableHead>PI</TableHead>
                  <TableHead>PF</TableHead>
                  <TableHead>NC</TableHead>
                  <TableHead>PCC</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionWindows.map((window) => (
                  <TableRow key={window.lot}>
                    <TableCell className="font-semibold text-white">
                      <Link href={`/traceability/${window.lot}`}>{window.lot}</Link>
                    </TableCell>
                    <TableCell>{window.rm}</TableCell>
                    <TableCell>{window.pi}</TableCell>
                    <TableCell>{window.pf}</TableCell>
                    <TableCell>{window.nc}</TableCell>
                    <TableCell>{window.pcc}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={window.risk}>{window.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
