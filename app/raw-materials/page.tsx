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
    categoria: "Base",
    unidade: "kg",
    risco: "low",
    especificacao: "Polarização ≥ 99.7",
    coaUrl: "https://example.com/coa-rm-001.pdf",
  },
  {
    id: "rm-002",
    nome: "Concentrado Guaraná",
    categoria: "Flavor",
    unidade: "kg",
    risco: "medium",
    especificacao: "Brix 65 ±0.3",
    coaUrl: "https://example.com/coa-rm-002.pdf",
  },
  {
    id: "rm-003",
    nome: "CO₂ Alimentício",
    categoria: "Utility",
    unidade: "kg",
    risco: "low",
    especificacao: "Pureza ≥ 99.5%",
    coaUrl: "https://example.com/coa-rm-003.pdf",
  },
  {
    id: "rm-004",
    nome: "Ácido Cítrico",
    categoria: "Base",
    unidade: "kg",
    risco: "medium",
    especificacao: "Teor 50 ±1%",
    coaUrl: "https://example.com/coa-rm-004.pdf",
  },
  {
    id: "rm-005",
    nome: "Adoçante Líquido",
    categoria: "Flavor",
    unidade: "L",
    risco: "high",
    especificacao: "Pureza ≥ 99.0%",
    coaUrl: "https://example.com/coa-rm-005.pdf",
  },
];

const riskCopy: Record<"low" | "medium" | "high", { label: string; variant: "success" | "warning" | "danger" }> = {
  low: { label: "Estável", variant: "success" },
  medium: { label: "Monitorar", variant: "warning" },
  high: { label: "Crítico", variant: "danger" },
};

const categoryOptions = [
  { value: "all", label: "Todas as Categorias" },
  { value: "matéria-prima", label: "Matéria-Prima" },
  { value: "embalagem", label: "Material de Embalagem" },
];

export default function RawMaterialsPage() {
  const router = useRouter();
  const [categoryFilter, setCategoryFilter] = useState("all");

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
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Recursos</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Catálogo de Materiais</h1>
          <p className="text-slate-400">
            Acompanhe matérias-primas e materiais de embalagem em um só lugar.
          </p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/raw-materials/create">Novo Material</Link>
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
              <p className="text-sm text-slate-400">Materiais nesta condição</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card className="border-slate-900">
        <CardHeader className="flex flex-col gap-4 border-b border-slate-900/80 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Lista mestre</CardTitle>
            <CardDescription>Filtre por categoria para localizar rapidamente.</CardDescription>
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
                <TableHead>Categoria</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Especificação</TableHead>
                <TableHead>Risco</TableHead>
                <TableHead>COA</TableHead>
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
                  <TableCell>{material.categoria}</TableCell>
                  <TableCell>{material.unidade}</TableCell>
                  <TableCell className="text-slate-300">{material.especificacao}</TableCell>
                  <TableCell>
                    <Badge variant={riskCopy[material.risco as keyof typeof riskCopy].variant}>
                      {riskCopy[material.risco as keyof typeof riskCopy].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={material.coaUrl} target="_blank" rel="noreferrer">
                        Ver / baixar
                      </Link>
                    </Button>
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
