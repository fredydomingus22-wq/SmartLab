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

interface ParameterResult {
  parameter: string;
  result: string;
  specification: string;
  method: string;
  analyst: string;
  timestamp: string;
  status: "success" | "warning" | "danger";
}

interface LabTestDetail {
  id: string;
  category: "RM" | "PI" | "PF";
  lot: string;
  product: string;
  line: string;
  shift: string;
  status: "success" | "warning" | "danger";
  analyst: string;
  sampleTime: string;
  releaseWindow: string;
  timelineLot: string;
  notes: string;
  parameters: ParameterResult[];
}

const detailStore: Record<string, LabTestDetail> = {
  "LAB-2409-313": {
    id: "LAB-2409-313",
    category: "PF",
    lot: "PF-240915-07",
    product: "Chá Pêssego 1L",
    line: "Envase Vidro",
    shift: "Tarde",
    status: "danger",
    analyst: "C. Braga",
    sampleTime: "2024-09-15T10:36",
    releaseWindow: "+6h",
    timelineLot: "PL-240915-11",
    notes: "Desvio de pH observado, aguardando avaliação sensorial.",
    parameters: [
      {
        parameter: "pH",
        result: "3.49",
        specification: "3.35 ±0.05",
        method: "pHmetro",
        analyst: "C. Braga",
        timestamp: "10:36",
        status: "danger",
      },
      {
        parameter: "Brix",
        result: "8.9 °Bx",
        specification: "9.2 ±0.2",
        method: "Refratômetro",
        analyst: "C. Braga",
        timestamp: "10:40",
        status: "warning",
      },
      {
        parameter: "CO₂",
        result: "5.05 g/L",
        specification: "5.3 ±0.3",
        method: "CarboQC",
        analyst: "E. Lopes",
        timestamp: "10:44",
        status: "warning",
      },
      {
        parameter: "Micro 30°C",
        result: "Ausente",
        specification: "Ausente",
        method: "Placa",
        analyst: "M. Silva",
        timestamp: "11:10",
        status: "success",
      },
      {
        parameter: "Micro 45°C",
        result: "Ausente",
        specification: "Ausente",
        method: "Placa",
        analyst: "M. Silva",
        timestamp: "11:30",
        status: "success",
      },
      {
        parameter: "Sensory",
        result: "Observação",
        specification: "Aprovado",
        method: "Painel",
        analyst: "Comitê",
        timestamp: "12:05",
        status: "warning",
      },
    ],
  },
  "LAB-2409-118": {
    id: "LAB-2409-118",
    category: "RM",
    lot: "RM-ACUC-4412",
    product: "Açúcar VHP",
    line: "Recebimento",
    shift: "Manhã",
    status: "success",
    analyst: "L. Souza",
    sampleTime: "2024-09-15T07:55",
    releaseWindow: "+2h",
    timelineLot: "PL-240915-01",
    notes: "Resultado conforme COA. Liberado para dissolução.",
    parameters: [
      {
        parameter: "Brix",
        result: "65.1 °Bx",
        specification: "65.0 ±0.3",
        method: "Refratômetro",
        analyst: "L. Souza",
        timestamp: "07:55",
        status: "success",
      },
      {
        parameter: "Cor ICUMSA",
        result: "120",
        specification: "≤150",
        method: "Colorímetro",
        analyst: "L. Souza",
        timestamp: "08:02",
        status: "success",
      },
      {
        parameter: "Umidade",
        result: "0.07%",
        specification: "≤0.10%",
        method: "Estufa",
        analyst: "E. Braga",
        timestamp: "08:18",
        status: "success",
      },
    ],
  },
};

const categoryCopy: Record<LabTestDetail["category"], { label: string; helper: string }> = {
  RM: { label: "Matéria-prima", helper: "COA & recebimento" },
  PI: { label: "Processo intermédio", helper: "Xarope & mistura" },
  PF: { label: "Produto final", helper: "Envase & liberação" },
};

const statusCopy: Record<LabTestDetail["status"], { label: string; description: string }> = {
  success: { label: "Conforme", description: "Todos os parâmetros dentro de especificação." },
  warning: { label: "Ajuste", description: "Há parâmetros em atenção, valide ajustes." },
  danger: { label: "Crítico", description: "Há parâmetros fora de especificação." },
};

const statusBadge: Record<LabTestDetail["status"], "success" | "warning" | "danger"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
};

interface LabTestDetailPageProps {
  params: { id: string };
}

export default function LabTestDetailPage({ params }: LabTestDetailPageProps) {
  const detail = detailStore[params.id];

  if (!detail) {
    notFound();
  }

  const meta = [
    { label: "Categoria", value: categoryCopy[detail.category].label },
    { label: "Produto", value: detail.product },
    { label: "Lote", value: detail.lot },
    { label: "Linha", value: detail.line },
    { label: "Turno", value: detail.shift },
    { label: "Analista", value: detail.analyst },
    {
      label: "Coleta",
      value: new Date(detail.sampleTime).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      }),
    },
    { label: "Janela de liberação", value: detail.releaseWindow },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Laboratório » Detalhe</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{detail.id}</h1>
          <p className="text-slate-400">{categoryCopy[detail.category].helper} • {detail.product}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link href="/lab-tests">Voltar</Link>
          </Button>
          <Button variant="primary" asChild>
            <Link href={`/traceability/${detail.timelineLot}`}>
              Abrir timeline
            </Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Status analítico</CardTitle>
              <CardDescription>{statusCopy[detail.status].description}</CardDescription>
            </div>
            <Badge variant={statusBadge[detail.status]} className="text-base uppercase tracking-[0.2em]">
              {statusCopy[detail.status].label}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meta.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-900/80 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-base text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Observações</CardTitle>
            <CardDescription>Contexto compartilhado com QA e produção</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300">{detail.notes}</p>
            <div className="mt-6 rounded-xl border border-slate-900/70 bg-slate-950/60 p-4 text-sm text-slate-400">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Timeline</p>
              <p className="text-white">{detail.timelineLot}</p>
              <p>Última atualização: {new Date(detail.sampleTime).toLocaleTimeString("pt-BR", { timeStyle: "short" })}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border-slate-900">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Resultados de parâmetros</CardTitle>
            <CardDescription>Últimas leituras registradas para esta amostra</CardDescription>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{detail.parameters.length} ENSAIOS</p>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Especificação</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Analista</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detail.parameters.map((parameter) => (
                <TableRow key={`${detail.id}-${parameter.parameter}-${parameter.timestamp}`}>
                  <TableCell className="font-semibold text-white">{parameter.parameter}</TableCell>
                  <TableCell>{parameter.result}</TableCell>
                  <TableCell className="text-slate-400">{parameter.specification}</TableCell>
                  <TableCell className="text-slate-400">{parameter.method}</TableCell>
                  <TableCell className="text-slate-400">{parameter.analyst}</TableCell>
                  <TableCell className="text-slate-400">{parameter.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={parameter.status}>
                      {parameter.status === "success"
                        ? "OK"
                        : parameter.status === "warning"
                        ? "Ajustar"
                        : "Crítico"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
