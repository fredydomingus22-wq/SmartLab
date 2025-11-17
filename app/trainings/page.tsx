import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const trainings = [
  {
    id: "TR-2409-01",
    title: "HACCP – Refresh 2024",
    status: "Ativo",
    statusVariant: "success" as const,
    validity: "12 meses",
    expiresAt: "2025-09-10",
  },
  {
    id: "TR-2409-02",
    title: "Microbiologia Avançada",
    status: "Vence em 30 dias",
    statusVariant: "warning" as const,
    validity: "24 meses",
    expiresAt: "2024-10-05",
  },
  {
    id: "TR-2409-03",
    title: "Operação PCC Pasteurização",
    status: "Requer reciclagem",
    statusVariant: "danger" as const,
    validity: "18 meses",
    expiresAt: "2024-09-20",
  },
  {
    id: "TR-2409-04",
    title: "Boas Práticas de Laboratório",
    status: "Ativo",
    statusVariant: "success" as const,
    validity: "12 meses",
    expiresAt: "2025-02-14",
  },
];

const statusSummary = [
  { label: "Programas ativos", value: "18", helper: "+2 novos este mês" },
  { label: "Renovações em 30 dias", value: "4", helper: "Priorizar execução" },
  { label: "Participantes em curso", value: "63", helper: "12 aguardam avaliação" },
];

export default function TrainingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Treinamentos</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Catálogo de treinamentos</h1>
          <p className="text-slate-400">
            Controle validade, reciclagens e disponibilidade de instrutores no ecossistema SmartLab.
          </p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/trainings/create">Criar treinamento</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statusSummary.map((item) => (
          <Card
            key={item.label}
            className="border-slate-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 shadow-xl shadow-slate-950/40 transition hover:-translate-y-0.5"
          >
            <CardHeader className="p-0 pb-2">
              <CardDescription className="text-xs uppercase tracking-[0.25em] text-slate-500">
                {item.label}
              </CardDescription>
              <CardTitle className="text-3xl text-white">{item.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm text-slate-400">{item.helper}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-900 bg-slate-950/60">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Programas vigentes</CardTitle>
            <CardDescription>Título · status · validade</CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link href="/trainings/create">Novo treinamento</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead className="text-right">Expira em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training) => (
                <TableRow key={training.id} className="cursor-pointer">
                  <TableCell className="font-semibold text-white">
                    <Link href={`/trainings/${training.id}`} className="hover:text-emerald-400">
                      {training.id}
                    </Link>
                  </TableCell>
                  <TableCell className="text-slate-300">{training.title}</TableCell>
                  <TableCell>
                    <Badge variant={training.statusVariant}>{training.status}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-300">{training.validity}</TableCell>
                  <TableCell className="text-right text-slate-400">{training.expiresAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
