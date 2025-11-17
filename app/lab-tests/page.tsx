"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const categoryMeta = {
  RM: {
    title: "Matéria-prima",
    helper: "COA & recebimento",
  },
  PI: {
    title: "Processo intermédio",
    helper: "Xarope & mistura",
  },
  PF: {
    title: "Produto final",
    helper: "Envase & liberação",
  },
} as const;

type LabCategory = keyof typeof categoryMeta;
type LabStatus = "ok" | "attention" | "critical";

type LabAnalysis = {
  id: string;
  category: LabCategory;
  lot: string;
  product: string;
  parameter: string;
  result: string;
  spec: string;
  status: LabStatus;
  analyst: string;
  timestamp: string;
};

const labAnalyses: LabAnalysis[] = [
  {
    id: "LAB-2409-118",
    category: "RM",
    lot: "RM-ACUC-4412",
    product: "Açúcar VHP",
    parameter: "Brix",
    result: "65.1 °Bx",
    spec: "65.0 ±0.3",
    status: "ok",
    analyst: "L. Souza",
    timestamp: "07:55",
  },
  {
    id: "LAB-2409-119",
    category: "RM",
    lot: "RM-CO2-982",
    product: "CO₂ Granel",
    parameter: "Pureza",
    result: "99.7%",
    spec: ">=99.5%",
    status: "ok",
    analyst: "G. Ramos",
    timestamp: "08:12",
  },
  {
    id: "LAB-2409-201",
    category: "PI",
    lot: "PI-XRP-224",
    product: "Xarope Cola",
    parameter: "Brix",
    result: "63.8 °Bx",
    spec: "63.5 ±0.5",
    status: "ok",
    analyst: "T. Freitas",
    timestamp: "09:05",
  },
  {
    id: "LAB-2409-202",
    category: "PI",
    lot: "PI-XRP-227",
    product: "Xarope Guaraná",
    parameter: "pH",
    result: "3.32",
    spec: "3.20 ±0.05",
    status: "attention",
    analyst: "T. Freitas",
    timestamp: "09:42",
  },
  {
    id: "LAB-2409-312",
    category: "PF",
    lot: "PF-240915-05",
    product: "Cola Zero 350ml",
    parameter: "CO₂",
    result: "6.45 g/L",
    spec: "6.3 ±0.2",
    status: "ok",
    analyst: "C. Braga",
    timestamp: "10:18",
  },
  {
    id: "LAB-2409-313",
    category: "PF",
    lot: "PF-240915-07",
    product: "Chá Pêssego",
    parameter: "pH",
    result: "3.49",
    spec: "3.35 ±0.05",
    status: "critical",
    analyst: "C. Braga",
    timestamp: "10:36",
  },
  {
    id: "LAB-2409-314",
    category: "PF",
    lot: "PF-240915-08",
    product: "Água Tônica",
    parameter: "Brix",
    result: "9.1 °Bx",
    spec: "9.4 ±0.2",
    status: "attention",
    analyst: "M. Costa",
    timestamp: "10:50",
  },
  {
    id: "LAB-2409-320",
    category: "RM",
    lot: "RM-SWEET-030",
    product: "Adoçante líquido",
    parameter: "Pureza",
    result: "98.1%",
    spec: ">=99.0%",
    status: "critical",
    analyst: "R. Matos",
    timestamp: "11:08",
  },
];

const statusCopy: Record<LabStatus, { label: string; variant: "success" | "warning" | "danger" }> = {
  ok: { label: "Conforme", variant: "success" },
  attention: { label: "Ajustar", variant: "warning" },
  critical: { label: "Crítico", variant: "danger" },
};

const categoryOptions = [
  { value: "all", label: "Todas as categorias" },
  { value: "RM", label: "Matéria-prima (RM)" },
  { value: "PI", label: "Processo intermédio (PI)" },
  { value: "PF", label: "Produto final (PF)" },
];

export default function LabTestsPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredAnalyses = useMemo(() => {
    if (categoryFilter === "all") return labAnalyses;
    return labAnalyses.filter((analysis) => analysis.category === categoryFilter);
  }, [categoryFilter]);

  const categorySummaries = useMemo(() => {
    return (Object.keys(categoryMeta) as LabCategory[]).map((category) => {
      const total = labAnalyses.filter((analysis) => analysis.category === category).length;
      const critical = labAnalyses.filter(
        (analysis) => analysis.category === category && analysis.status !== "ok"
      ).length;
      return {
        category,
        total,
        critical,
      };
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Laboratório</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Ensaios laboratoriais</h1>
          <p className="text-slate-400">
            Controle em tempo real de RM, processos intermédios e produto final.
          </p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/lab-tests/create">Criar</Link>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {categorySummaries.map(({ category, total, critical }) => (
          <Card
            key={category}
            className="border-slate-900 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"
          >
            <CardHeader className="border-b-0">
              <CardDescription className="text-xs uppercase tracking-[0.2em]">
                {category}
              </CardDescription>
              <CardTitle className="text-3xl text-white">{total}</CardTitle>
              <p className="text-sm text-slate-400">{categoryMeta[category].title}</p>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-slate-400">
              <span>{categoryMeta[category].helper}</span>
              <Badge variant={critical > 0 ? "warning" : "success"}>
                {critical > 0 ? `${critical} ajustes` : "Estável"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="border-slate-900">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-900/80 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Fila analítica</CardTitle>
            <CardDescription>
              Utilize filtros para priorizar desvios e lotes críticos.
            </CardDescription>
            <p className="text-xs text-slate-500">
              {filteredAnalyses.length} análise(s) exibida(s)
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-end">
            <div className="w-full sm:max-w-xs">
              <Label htmlFor="categoria" className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Categoria
              </Label>
              <Select
                id="categoria"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="mt-2"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              type="button"
              variant="ghost"
              disabled={categoryFilter === "all"}
              onClick={() => setCategoryFilter("all")}
            >
              Limpar filtro
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Análise</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Lote / Produto</TableHead>
                <TableHead>Parâmetro</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Especificação</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnalyses.map((analysis) => (
                <TableRow
                  key={analysis.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/lab-tests/${analysis.id}`)}
                >
                  <TableCell className="font-semibold text-white">
                    <div>{analysis.id}</div>
                    <p className="text-xs text-slate-500">{analysis.timestamp}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">{analysis.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <p>{analysis.lot}</p>
                    <p className="text-xs text-slate-500">{analysis.product}</p>
                  </TableCell>
                  <TableCell>{analysis.parameter}</TableCell>
                  <TableCell className={analysis.status === "critical" ? "text-red-400" : analysis.status === "attention" ? "text-amber-300" : "text-slate-100"}>
                    {analysis.result}
                  </TableCell>
                  <TableCell className="text-slate-400">{analysis.spec}</TableCell>
                  <TableCell>
                    <Badge variant={statusCopy[analysis.status].variant}>
                      {statusCopy[analysis.status].label}
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
