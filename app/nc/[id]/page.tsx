import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ncRecords = [
  {
    id: "NC-4826",
    type: "PCC",
    severity: "Crítica",
    status: "Aberta",
    owner: "QA Manager",
    openedAt: "2024-09-15 10:05",
    description: "Alarme do metal detector linha vidro com rejeição em massa.",
    linked8d: "NC-4826",
    linkedPcc: "PCC-14",
    lots: [
      { lot: "PF-240915-21", stage: "Produto final", action: "Bloqueado" },
      { lot: "INT-240915-15", stage: "Intermediário", action: "Rastreio" },
    ],
  },
  {
    id: "NC-4810",
    type: "Lab",
    severity: "Major",
    status: "Em análise",
    owner: "Laboratório",
    openedAt: "2024-09-12 08:40",
    description: "pH fora de especificação no lote PF-240915-12.",
    linked8d: "NC-4810",
    linkedPcc: "PCC-12",
    lots: [
      { lot: "PF-240915-12", stage: "Produto final", action: "Ajustar" },
    ],
  },
];

interface NcPageProps {
  params: { id: string };
}

const statusVariant: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  Aberta: "danger",
  "Em análise": "warning",
  Fechada: "success",
};

export default function NcDetailPage({ params }: NcPageProps) {
  const record = ncRecords.find((item) => item.id === params.id);

  if (!record) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">NC · {record.id}</p>
          <h1 className="text-3xl font-semibold text-white">{record.description}</h1>
          <p className="text-slate-400">Aberta em {record.openedAt} · Responsável {record.owner}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" asChild>
            <Link href={`/nc/8d/${record.id}`}>Abrir 8D</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/nc">Voltar</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Tipo e severidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Status:</span>
              <Badge variant={statusVariant[record.status] || "neutral"}>{record.status}</Badge>
            </div>
            <div>Tipo: {record.type}</div>
            <div>Severidade: {record.severity}</div>
          </CardContent>
        </Card>
        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Vínculos</CardTitle>
            <CardDescription>8D e PCC relacionados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Relatório 8D</p>
              <Link href={`/nc/8d/${record.linked8d}`} className="text-emerald-400 hover:text-emerald-300">
                {record.linked8d}
              </Link>
            </div>
            <div>
              <p className="text-sm text-slate-500">PCC / PRP</p>
              <span className="text-white">{record.linkedPcc}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Ações</CardTitle>
            <CardDescription>Fluxo recomendado</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-300">
            <ul className="list-disc space-y-1 pl-4">
              <li>Bloquear lotes vinculados</li>
              <li>Iniciar investigação 8D</li>
              <li>Comunicar Food Safety</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Lotes impactados</CardTitle>
          <CardDescription>Rastreabilidade direta</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote</TableHead>
                <TableHead>Etapa</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {record.lots.map((lot) => (
                <TableRow key={lot.lot}>
                  <TableCell className="font-semibold text-white">{lot.lot}</TableCell>
                  <TableCell className="text-slate-400">{lot.stage}</TableCell>
                  <TableCell className="text-right text-slate-300">{lot.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
