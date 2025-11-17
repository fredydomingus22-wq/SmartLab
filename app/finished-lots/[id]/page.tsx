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
  name: string;
  result: string;
  spec: string;
  status: "success" | "warning" | "danger";
  method: string;
  analyst: string;
  timestamp: string;
}

interface FinishedLotDetail {
  code: string;
  product: string;
  sku: string;
  parentLot: string;
  intermediateLot: string;
  line: string;
  shift: string;
  releaseAt: string;
  compliance: number;
  ncId?: string;
  status: "released" | "hold" | "critical";
  parameters: ParameterResult[];
  notes: string[];
}

const finishedLotDetails: Record<string, FinishedLotDetail> = {
  "PF-240915-05": {
    code: "PF-240915-05",
    product: "Cola Zero 350ml",
    sku: "SKU-CLZ-350",
    parentLot: "PL-240915-01",
    intermediateLot: "PI-XRP-224",
    line: "Linha PET 02",
    shift: "Noite",
    releaseAt: "2024-09-15T11:30:00-03:00",
    compliance: 98.9,
    status: "released",
    parameters: [
      {
        name: "CO₂",
        result: "6.34 g/L",
        spec: "6.3 ±0.2",
        status: "success",
        method: "Carbo QC",
        analyst: "C. Braga",
        timestamp: "10:18",
      },
      {
        name: "Brix",
        result: "11.02 °Bx",
        spec: "11.0 ±0.2",
        status: "success",
        method: "DMA",
        analyst: "C. Braga",
        timestamp: "10:22",
      },
      {
        name: "pH",
        result: "3.34",
        spec: "3.30 ±0.05",
        status: "warning",
        method: "pHmetro",
        analyst: "C. Braga",
        timestamp: "10:25",
      },
      {
        name: "Acidez",
        result: "0.31 %",
        spec: "0.30 ±0.04",
        status: "success",
        method: "Titulação",
        analyst: "V. Costa",
        timestamp: "10:32",
      },
      {
        name: "Cor",
        result: "13.8",
        spec: "13 ±1",
        status: "success",
        method: "Colorímetro",
        analyst: "V. Costa",
        timestamp: "10:40",
      },
    ],
    notes: [
      "Todos os parâmetros críticos dentro da janela de controle.",
      "Turno reportou ajuste preventivo de CO₂ antes da liberação.",
    ],
  },
  "PF-240915-11": {
    code: "PF-240915-11",
    product: "Chá Pêssego 1L",
    sku: "SKU-CP-1000",
    parentLot: "PL-240915-11",
    intermediateLot: "PI-XRP-231",
    line: "Envase Vidro",
    shift: "Tarde",
    releaseAt: "2024-09-15T15:45:00-03:00",
    compliance: 92.4,
    status: "critical",
    ncId: "NC-4587",
    parameters: [
      {
        name: "CO₂",
        result: "5.02 g/L",
        spec: "5.4 ±0.3",
        status: "danger",
        method: "Carbo QC",
        analyst: "H. Souza",
        timestamp: "13:16",
      },
      {
        name: "Brix",
        result: "8.94 °Bx",
        spec: "9.2 ±0.3",
        status: "warning",
        method: "DMA",
        analyst: "H. Souza",
        timestamp: "13:12",
      },
      {
        name: "pH",
        result: "3.45",
        spec: "3.30 ±0.05",
        status: "danger",
        method: "pHmetro",
        analyst: "H. Souza",
        timestamp: "13:14",
      },
      {
        name: "Acidez",
        result: "0.33 %",
        spec: "0.30 ±0.03",
        status: "warning",
        method: "Titulação",
        analyst: "P. Melo",
        timestamp: "13:28",
      },
      {
        name: "Micro (30ºC)",
        result: "Ausente",
        spec: "Ausente",
        status: "success",
        method: "Placa",
        analyst: "M. Costa",
        timestamp: "13:50",
      },
      {
        name: "Sensory",
        result: "Reprovado",
        spec: "Aprovado",
        status: "danger",
        method: "Painel",
        analyst: "Comitê",
        timestamp: "14:40",
      },
    ],
    notes: [
      "Produto bloqueado aguardando plano de ação PCC.",
      "NC vinculada com necessidade de 8D para ajustes de processo térmico.",
    ],
  },
};

const statusCopy: Record<FinishedLotDetail["status"], { label: string; description: string; variant: "success" | "warning" | "danger" }> = {
  released: {
    label: "Liberado",
    description: "Todos os parâmetros dentro ou próximos da meta. Documentos sincronizados.",
    variant: "success",
  },
  hold: {
    label: "Bloqueado",
    description: "Aguardando revisão de QA antes de liberar a expedição.",
    variant: "warning",
  },
  critical: {
    label: "Crítico",
    description: "Desvios relevantes exigem NC e plano de contenção imediato.",
    variant: "danger",
  },
};

const parameterStatusLabel: Record<ParameterResult["status"], string> = {
  success: "OK",
  warning: "Ajustar",
  danger: "Crítico",
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function FinishedLotDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lot = finishedLotDetails[params.id];

  if (!lot) {
    notFound();
  }

  const status = statusCopy[lot.status];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produto final » {lot.code}</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">{lot.product}</h1>
          <p className="text-slate-400">Parent lot {lot.parentLot} • Intermediário {lot.intermediateLot}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" asChild>
            <Link href="/finished-lots">Voltar</Link>
          </Button>
          {lot.ncId ? (
            <Button variant="secondary" asChild>
              <Link href={`/nc/${lot.ncId}`}>Ver NC {lot.ncId}</Link>
            </Button>
          ) : (
            <Badge variant="success">Sem NC ligada</Badge>
          )}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[{
          label: "Código PF",
          value: lot.code,
        },
        {
          label: "SKU",
          value: lot.sku,
        },
        {
          label: "Linha",
          value: lot.line,
        },
        {
          label: "Turno",
          value: lot.shift,
        },
        {
          label: "Liberação",
          value: formatDateTime(lot.releaseAt),
        },
        {
          label: "Compliance",
          value: `${lot.compliance.toFixed(1)}%`,
        },
        {
          label: "Lote Pai",
          value: lot.parentLot,
        },
        {
          label: "Lote Intermédio",
          value: lot.intermediateLot,
        }].map((item) => (
          <Card key={item.label} className="border-slate-900 bg-slate-950/70">
            <CardHeader className="space-y-2">
              <CardDescription className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </CardDescription>
              <CardTitle className="text-xl text-white">{item.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-900">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Parâmetros analíticos</CardTitle>
              <CardDescription>Últimas leituras registradas antes da liberação.</CardDescription>
            </div>
            <Badge variant={status.variant}>{status.label}</Badge>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {lot.parameters.map((parameter) => (
                  <TableRow key={`${parameter.name}-${parameter.timestamp}`}>
                    <TableCell className="font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span>{parameter.name}</span>
                        <Badge variant={parameter.status}>
                          {parameterStatusLabel[parameter.status]}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell
                      className={
                        parameter.status === "danger"
                          ? "text-red-400"
                          : parameter.status === "warning"
                          ? "text-amber-300"
                          : "text-slate-100"
                      }
                    >
                      {parameter.result}
                    </TableCell>
                    <TableCell className="text-slate-400">{parameter.spec}</TableCell>
                    <TableCell>{parameter.method}</TableCell>
                    <TableCell>{parameter.analyst}</TableCell>
                    <TableCell>{parameter.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-900">
          <CardHeader>
            <CardTitle>Avaliação de status</CardTitle>
            <CardDescription>Resumo do lote e próximos passos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Situação</p>
              <div className="mt-2 flex items-center gap-3">
                <Badge variant={status.variant}>{status.label}</Badge>
                <span className="text-sm text-slate-300">{status.description}</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Notas da qualidade</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-300">
                {lot.notes.map((note) => (
                  <li key={note} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-500" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
            {lot.ncId ? (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-red-300">NC associada</p>
                    <p className="text-base text-white">{lot.ncId}</p>
                  </div>
                  <Button variant="destructive" asChild>
                    <Link href={`/nc/${lot.ncId}`}>Abrir NC</Link>
                  </Button>
                </div>
                <p className="mt-2 text-sm text-red-200/90">
                  Revisar ações de contenção antes de qualquer liberação.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-300">Nenhuma NC vinculada a este lote.</p>
                <p className="text-xs text-slate-500">Monitorar tendências, mas liberação permitida.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
