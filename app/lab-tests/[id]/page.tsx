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

const labTestRegistry = {
  "LAB-2409-118": {
    id: "LAB-2409-118",
    category: "PF",
    sample: "PF-240915-05",
    product: "Cola Zero 350ml",
    analyst: "C. Braga",
    method: "CO₂ volumétrico",
    data: "2024-09-15T10:18",
    status: "success",
    productionLotId: "PL-240915-05",
    parameters: [
      { name: "CO₂", result: "6.45 g/L", spec: "6.3 ±0.2", status: "success" },
      { name: "Brix", result: "11.0 °Bx", spec: "11.0 ±0.3", status: "success" },
      { name: "pH", result: "3.32", spec: "3.30 ±0.05", status: "warning" },
      { name: "Densidade", result: "1.015 g/cm³", spec: "1.015 ±0.002", status: "success" },
    ],
  },
  "LAB-2409-313": {
    id: "LAB-2409-313",
    category: "PF",
    sample: "PF-240915-07",
    product: "Chá Pêssego",
    analyst: "C. Braga",
    method: "pH metrico",
    data: "2024-09-15T10:36",
    status: "danger",
    productionLotId: "PL-240915-07",
    parameters: [
      { name: "pH", result: "3.49", spec: "3.35 ±0.05", status: "danger" },
      { name: "Brix", result: "8.8 °Bx", spec: "9.2 ±0.3", status: "warning" },
      { name: "CO₂", result: "5.1 g/L", spec: "5.5 ±0.3", status: "warning" },
      { name: "Sensory", result: "Observação", spec: "Aprovado", status: "danger" },
    ],
  },
} as const;

type LabStatus = "success" | "warning" | "danger";

const statusCopy: Record<LabStatus, { label: string; helper: string }> = {
  success: { label: "Conforme", helper: "Todos os resultados dentro da especificação" },
  warning: { label: "Ajuste", helper: "Acompanhar correções de processo" },
  danger: { label: "Crítico", helper: "Necessária ação imediata" },
};

interface LabTestPageProps {
  params: { id: string };
}

export default function LabTestPage({ params }: LabTestPageProps) {
  const labTest = labTestRegistry[params.id as keyof typeof labTestRegistry];

  if (!labTest) {
    notFound();
  }

  const status = statusCopy[labTest.status as LabStatus];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Laboratório</p>
          <h1 className="text-3xl font-semibold text-white">{labTest.id}</h1>
          <p className="text-slate-400">Análise da amostra {labTest.sample} ({labTest.product}).</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/lab-tests">Voltar</Link>
          </Button>
          <Button variant="primary" asChild>
            <Link href={`/traceability/${labTest.productionLotId}`}>
              Ver timeline do lote
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>Contexto completo da coleta.</CardDescription>
          </div>
          <Badge variant={labTest.status as LabStatus}>{status.label}</Badge>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Categoria</p>
            <p className="text-base text-white">{labTest.category}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Analista</p>
            <p className="text-base text-white">{labTest.analyst}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Método</p>
            <p className="text-base text-white">{labTest.method}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Data</p>
            <p className="text-base text-white">
              {new Date(labTest.data).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Produto</p>
            <p className="text-base text-white">{labTest.product}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Sample ID</p>
            <p className="text-base text-white">{labTest.sample}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Situação</p>
            <p className="text-base text-slate-300">{status.helper}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-900">
        <CardHeader>
          <CardTitle>Resultados por parâmetro</CardTitle>
          <CardDescription>Últimos valores lançados no LIMS.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Especificação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labTest.parameters.map((parameter) => (
                <TableRow key={parameter.name}>
                  <TableCell className="font-semibold text-white">{parameter.name}</TableCell>
                  <TableCell>{parameter.result}</TableCell>
                  <TableCell className="text-slate-400">{parameter.spec}</TableCell>
                  <TableCell>
                    <Badge variant={parameter.status as LabStatus}>
                      {statusCopy[parameter.status as LabStatus].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-slate-900 bg-slate-950/60">
        <CardHeader>
          <CardTitle>Timeline & ações</CardTitle>
          <CardDescription>Integre o resultado com rastreabilidade e NC.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-300">
              Este ensaio está vinculado ao lote pai {labTest.productionLotId}. Utilize a timeline de
              rastreabilidade para acompanhar PCC, NCs e liberações.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href={`/traceability/${labTest.productionLotId}`}>Abrir timeline</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
