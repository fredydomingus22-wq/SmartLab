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

const materialCatalog = [
  {
    id: "rm-001",
    nome: "Açúcar VHP",
    unidade: "kg",
    especificacao: "Polarização ≥ 99.7",
    tipo: "Macronutriente",
    categoria: "Base",
    risco: "low",
  },
  {
    id: "rm-002",
    nome: "Concentrado Guaraná",
    unidade: "kg",
    especificacao: "Brix 65 ±0.3",
    tipo: "Xarope",
    categoria: "Flavor",
    risco: "medium",
  },
  {
    id: "rm-003",
    nome: "CO₂ Alimentício",
    unidade: "kg",
    especificacao: "Pureza ≥ 99.5%",
    tipo: "Gás",
    categoria: "Utility",
    risco: "low",
  },
  {
    id: "rm-004",
    nome: "Ácido Cítrico",
    unidade: "kg",
    especificacao: "Teor 50 ±1%",
    tipo: "Aditivo",
    categoria: "Base",
    risco: "medium",
  },
  {
    id: "rm-005",
    nome: "Adoçante Líquido",
    unidade: "L",
    especificacao: "Pureza ≥ 99.0%",
    tipo: "Aditivo",
    categoria: "Flavor",
    risco: "high",
  },
];

const categoryOptions = [
  { value: "all", label: "Todas as categorias" },
  { value: "Base", label: "Base" },
  { value: "Flavor", label: "Flavor" },
  { value: "Utility", label: "Utility" },
];

const riskCopy: Record<
  "low" | "medium" | "high",
  { label: string; variant: "success" | "warning" | "danger"; helper: string }
> = {
  low: { label: "Estável", variant: "success", helper: "Sem desvios" },
  medium: { label: "Monitorar", variant: "warning", helper: "Atenção a trends" },
  high: { label: "Crítico", variant: "danger", helper: "Plano de ação" },
};

export default function RawMaterialsPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredMaterials = useMemo(() => {
    if (categoryFilter === "all") return materialCatalog;
    return materialCatalog.filter((material) => material.categoria === categoryFilter);
  }, [categoryFilter]);

  const riskStats = useMemo(() => {
    return materialCatalog.reduce(
      (acc, material) => {
        acc[material.risco as keyof typeof acc] += 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Matéria-prima</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Catálogo de materiais</h1>
          <p className="text-slate-400">
            Controle os ingredientes estratégicos com specs, classificação e nível de risco.
          </p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/raw-materials/create">Criar Material</Link>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {(
          [
            { label: "Baixo risco", key: "low", accent: "text-emerald-400" },
            { label: "Monitorar", key: "medium", accent: "text-amber-300" },
            { label: "Crítico", key: "high", accent: "text-red-400" },
          ] as const
        ).map((card) => (
          <Card key={card.key} className="border-slate-900 bg-slate-950/70">
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-[0.2em]">
                {card.label}
              </CardDescription>
              <CardTitle className={`text-3xl font-semibold ${card.accent}`}>
                {riskStats[card.key]}
              </CardTitle>
              <p className="text-sm text-slate-400">Materiais neste estado</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card className="border-slate-900">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-900/80 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Lista mestre</CardTitle>
            <CardDescription>Filtre por categoria para priorizar inspeções.</CardDescription>
          </div>
          <div className="w-full max-w-xs">
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
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Especificação</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMaterials.map((material) => (
                <TableRow
                  key={material.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/raw-materials/${material.id}`)}
                >
                  <TableCell className="font-semibold text-white">
                    <div>{material.nome}</div>
                    <p className="text-xs text-slate-500">ID {material.id}</p>
                  </TableCell>
                  <TableCell>{material.unidade}</TableCell>
                  <TableCell className="text-slate-300">{material.especificacao}</TableCell>
                  <TableCell>{material.tipo}</TableCell>
                  <TableCell>
                    <Badge variant="neutral">{material.categoria}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={riskCopy[material.risco as keyof typeof riskCopy].variant}>
                      {riskCopy[material.risco as keyof typeof riskCopy].label}
                    </Badge>
                    <p className="text-xs text-slate-500">
                      {riskCopy[material.risco as keyof typeof riskCopy].helper}
                    </p>
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
