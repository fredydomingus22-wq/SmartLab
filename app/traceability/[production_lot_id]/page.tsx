import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const traceabilityStore = {
  "PL-240915-01": {
    product: "Cola Zero 350ml",
    plant: "Linha PET 2",
    shift: "Noite",
    status: "Liberado",
    lotCode: "PF-240915-09",
    rawMaterials: [
      { lot: "RM-ACUC-4412", material: "Açúcar VHP", supplier: "Sweet Harvest", status: "Liberado" },
      { lot: "RM-CO2-982", material: "CO₂", supplier: "Gás Total", status: "Liberado" },
    ],
    intermediateLots: [
      { lot: "INT-240915-05", tank: "Tanque 03", brix: "63.9 °Bx", status: "Ok" },
    ],
    finishedLots: [
      { lot: "PF-240915-09", line: "Linha PET 2", co2: "6.15 g/L", status: "Aprovado" },
      { lot: "PF-240915-10", line: "Linha PET 2", co2: "6.05 g/L", status: "Aprovado" },
    ],
    labTests: [
      { parameter: "Brix", result: "11.9 °Bx", target: "11.8 ±0.2", status: "OK" },
      { parameter: "pH", result: "3.18", target: "3.20 ±0.05", status: "OK" },
      { parameter: "CO₂", result: "6.15 g/L", target: "6.2 ±0.2", status: "Ajustar" },
    ],
    nonConformities: [
      { code: "NC-4826", severity: "Crítica", status: "Em análise", link: "/nc/NC-4826" },
    ],
    pccChecks: [
      { point: "Pasteurização", value: "88.4 °C", status: "Controlado" },
      { point: "Selagem", value: "OK", status: "Controlado" },
    ],
    timeline: [
      { stage: "RM", detail: "RM-ACUC-4412 liberada", timestamp: "07:20" },
      { stage: "Lote Pai", detail: "PL-240915-01 preparado", timestamp: "08:40" },
      { stage: "PI", detail: "INT-240915-05 blend final", timestamp: "09:50" },
      { stage: "PF", detail: "PF-240915-09 envase", timestamp: "10:55" },
      { stage: "NC", detail: "NC-4826 aberta", timestamp: "11:05" },
      { stage: "PCC", detail: "PCC-12 inspecionado", timestamp: "11:30" },
    ],
  },
  "PL-240915-11": {
    product: "Chá Pêssego",
    plant: "Linha Vidro",
    shift: "Tarde",
    status: "Bloqueado",
    lotCode: "PF-240915-21",
    rawMaterials: [
      { lot: "RM-CHÁ-198", material: "Extrato de chá", supplier: "Prime Leaves", status: "Liberado" },
      { lot: "RM-AÇUCAR-410", material: "Açúcar", supplier: "Sweet Harvest", status: "Ajuste" },
    ],
    intermediateLots: [
      { lot: "INT-240915-15", tank: "Tanque 11", brix: "34.1 °Bx", status: "Ajustar" },
    ],
    finishedLots: [
      { lot: "PF-240915-21", line: "Linha Vidro", co2: "4.95 g/L", status: "Reprovado" },
    ],
    labTests: [
      { parameter: "Brix", result: "8.8 °Bx", target: "9.2 ±0.3", status: "Crítico" },
      { parameter: "pH", result: "3.45", target: "3.30 ±0.05", status: "Crítico" },
      { parameter: "CO₂", result: "4.95 g/L", target: "5.4 ±0.3", status: "Crítico" },
    ],
    nonConformities: [
      { code: "NC-4828", severity: "Major", status: "8D em curso", link: "/nc/NC-4828" },
    ],
    pccChecks: [
      { point: "Pasteurização", value: "86.1 °C", status: "Ajustar" },
    ],
    timeline: [
      { stage: "RM", detail: "RM-CHÁ-198 amostrada", timestamp: "05:55" },
      { stage: "Lote Pai", detail: "PL-240915-11 iniciado", timestamp: "07:05" },
      { stage: "PI", detail: "INT-240915-15 inconsistência", timestamp: "08:40" },
      { stage: "PF", detail: "PF-240915-21 bloqueado", timestamp: "10:15" },
      { stage: "NC", detail: "NC-4828 registrada", timestamp: "10:35" },
      { stage: "PCC", detail: "PCC-14 alerta", timestamp: "11:00" },
    ],
  },
};

type TraceabilityRecord = (typeof traceabilityStore)[keyof typeof traceabilityStore];

const statusVariant: Record<string, "success" | "warning" | "danger"> = {
  Liberado: "success",
  "Em andamento": "warning",
  Bloqueado: "danger",
};

interface TraceabilityPageProps {
  params: { production_lot_id: string };
}

export default function TraceabilityDetailPage({ params }: TraceabilityPageProps) {
  const record = (traceabilityStore as Record<string, TraceabilityRecord | undefined>)[
    params.production_lot_id
  ];

  if (!record) {
    notFound();
  }

  const variant = statusVariant[record.status] ?? "warning";

  const tree = [
    { stage: "RM", items: record.rawMaterials.map((rm) => rm.lot) },
    { stage: "Lote Pai", items: [params.production_lot_id] },
    { stage: "PI", items: record.intermediateLots.map((int) => int.lot) },
    { stage: "PF", items: record.finishedLots.map((fin) => fin.lot) },
    { stage: "NC", items: record.nonConformities.map((nc) => nc.code) },
    { stage: "PCC", items: record.pccChecks.map((pcc) => pcc.point) },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Rastreabilidade · {params.production_lot_id}</p>
        <h1 className="text-3xl font-semibold text-white">{record.product}</h1>
        <p className="text-slate-400">{record.plant} · Turno {record.shift}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-900 bg-slate-950/70">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Resumo do lote</CardTitle>
              <CardDescription>{record.lotCode} · Cadeia completa</CardDescription>
            </div>
            <Badge variant={variant}>{record.status}</Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-900/70 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Lote pai</p>
              <p className="text-lg text-white">{params.production_lot_id}</p>
            </div>
            <div className="rounded-2xl border border-slate-900/70 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produto final principal</p>
              <p className="text-lg text-white">{record.lotCode}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Timeline rápida</CardTitle>
            <CardDescription>Principais eventos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {record.timeline.map((item) => (
              <div key={item.timestamp} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{item.stage}</p>
                  <p className="text-xs text-slate-400">{item.detail}</p>
                  <p className="text-xs text-slate-500">{item.timestamp}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Árvore completa</CardTitle>
          <CardDescription>RM → Lote Pai → PI → PF → NC → PCC</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {tree.map((node) => (
            <div key={node.stage} className="rounded-2xl border border-slate-900/60 bg-slate-950/40 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{node.stage}</p>
              <div className="mt-2 space-y-2">
                {node.items.map((item) => (
                  <p key={item} className="text-sm font-semibold text-white">
                    {item}
                  </p>
                ))}
                {node.items.length === 0 && (
                  <p className="text-sm text-slate-500">Sem registros</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Matérias-primas</CardTitle>
            <CardDescription>Lotes vinculados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.rawMaterials.map((rm) => (
                  <TableRow key={rm.lot}>
                    <TableCell className="font-semibold text-white">{rm.lot}</TableCell>
                    <TableCell>{rm.material}</TableCell>
                    <TableCell>{rm.supplier}</TableCell>
                    <TableCell>
                      <Badge variant={rm.status === "Liberado" ? "success" : "warning"}>{rm.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Intermediários</CardTitle>
            <CardDescription>Tanques monitorados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Tanque</TableHead>
                  <TableHead>Brix</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.intermediateLots.map((intLot) => (
                  <TableRow key={intLot.lot}>
                    <TableCell className="font-semibold text-white">{intLot.lot}</TableCell>
                    <TableCell>{intLot.tank}</TableCell>
                    <TableCell>{intLot.brix}</TableCell>
                    <TableCell>
                      <Badge variant={intLot.status === "Ok" ? "success" : "warning"}>{intLot.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Produto final</CardTitle>
            <CardDescription>Envases associados</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lote</TableHead>
                  <TableHead>Linha</TableHead>
                  <TableHead>CO₂</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.finishedLots.map((pf) => (
                  <TableRow key={pf.lot}>
                    <TableCell className="font-semibold text-white">{pf.lot}</TableCell>
                    <TableCell>{pf.line}</TableCell>
                    <TableCell>{pf.co2}</TableCell>
                    <TableCell>
                      <Badge variant={pf.status === "Aprovado" ? "success" : "danger"}>{pf.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Ensaios laboratoriais</CardTitle>
            <CardDescription>Últimos parâmetros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {record.labTests.map((test) => (
              <div key={test.parameter} className="flex items-center justify-between rounded-2xl border border-slate-900/60 bg-slate-950/40 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">{test.parameter}</p>
                  <p className="text-xs text-slate-500">Target {test.target}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-300">{test.result}</p>
                  <Badge variant={test.status === "OK" ? "success" : test.status === "Ajustar" ? "warning" : "danger"}>
                    {test.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>NC & 8D</CardTitle>
            <CardDescription>Escalonamentos vinculados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {record.nonConformities.map((nc) => (
              <div key={nc.code} className="flex items-center justify-between rounded-2xl border border-slate-900/60 bg-slate-950/40 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">{nc.code}</p>
                  <p className="text-xs text-slate-500">{nc.severity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="warning">{nc.status}</Badge>
                  <Link href={nc.link} className="text-sm text-sky-400 hover:text-sky-300">
                    Abrir →
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>PCCs</CardTitle>
            <CardDescription>Pontos críticos monitorados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {record.pccChecks.map((pcc) => (
              <div key={pcc.point} className="flex items-center justify-between rounded-2xl border border-slate-900/60 bg-slate-950/40 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">{pcc.point}</p>
                  <p className="text-xs text-slate-500">{pcc.value}</p>
                </div>
                <Badge variant={pcc.status === "Controlado" ? "success" : "warning"}>{pcc.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
