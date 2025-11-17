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
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

type FinishedLotStatus = "Liberado" | "Bloqueado" | "Investigação";

type MetricSpec = {
  min: number;
  max: number;
  unit: string;
};

type FinishedLot = {
  id: string;
  code: string;
  product: string;
  line: string;
  tank: string;
  results: {
    co2: number;
    brix: number;
    ph: number;
    acidez: number;
  };
  specs: {
    co2: MetricSpec;
    brix: MetricSpec;
    ph: MetricSpec;
    acidez: MetricSpec;
  };
  status: FinishedLotStatus;
  date: string;
};

const finishedLots: FinishedLot[] = [
  {
    id: "FL-240915-01",
    code: "FL-240915-01",
    product: "Cola Zero 350ml",
    line: "Linha PET 2",
    tank: "TQ-14",
    date: "2024-09-15",
    status: "Liberado",
    results: { co2: 6.05, brix: 11.92, ph: 3.17, acidez: 0.34 },
    specs: {
      co2: { min: 5.8, max: 6.2, unit: "g/L" },
      brix: { min: 11.7, max: 12.1, unit: "°Bx" },
      ph: { min: 3.12, max: 3.22, unit: "pH" },
      acidez: { min: 0.32, max: 0.38, unit: "%" },
    },
  },
  {
    id: "FL-240915-04",
    code: "FL-240915-04",
    product: "Guaraná Tradicional 1L",
    line: "Linha Lata 1",
    tank: "TQ-07",
    date: "2024-09-15",
    status: "Investigação",
    results: { co2: 5.48, brix: 10.72, ph: 3.28, acidez: 0.42 },
    specs: {
      co2: { min: 5.7, max: 6.1, unit: "g/L" },
      brix: { min: 10.9, max: 11.4, unit: "°Bx" },
      ph: { min: 3.18, max: 3.26, unit: "pH" },
      acidez: { min: 0.34, max: 0.40, unit: "%" },
    },
  },
  {
    id: "FL-240915-08",
    code: "FL-240915-08",
    product: "Chá Pêssego 500ml",
    line: "Envase Vidro",
    tank: "TQ-19",
    date: "2024-09-14",
    status: "Bloqueado",
    results: { co2: 4.9, brix: 8.88, ph: 3.4, acidez: 0.29 },
    specs: {
      co2: { min: 5.1, max: 5.5, unit: "g/L" },
      brix: { min: 9.0, max: 9.4, unit: "°Bx" },
      ph: { min: 3.25, max: 3.35, unit: "pH" },
      acidez: { min: 0.31, max: 0.36, unit: "%" },
    },
  },
  {
    id: "FL-240915-12",
    code: "FL-240915-12",
    product: "Água com gás 1,5L",
    line: "Linha Lata 2",
    tank: "TQ-02",
    date: "2024-09-13",
    status: "Liberado",
    results: { co2: 6.45, brix: 0, ph: 6.82, acidez: 0.08 },
    specs: {
      co2: { min: 6.3, max: 6.6, unit: "g/L" },
      brix: { min: 0, max: 0, unit: "°Bx" },
      ph: { min: 6.7, max: 6.9, unit: "pH" },
      acidez: { min: 0.06, max: 0.1, unit: "%" },
    },
  },
  {
    id: "FL-240915-15",
    code: "FL-240915-15",
    product: "Tangerina Light 600ml",
    line: "Linha PET 3",
    tank: "TQ-11",
    date: "2024-09-12",
    status: "Liberado",
    results: { co2: 6.18, brix: 11.34, ph: 3.11, acidez: 0.36 },
    specs: {
      co2: { min: 5.9, max: 6.2, unit: "g/L" },
      brix: { min: 11.1, max: 11.5, unit: "°Bx" },
      ph: { min: 3.08, max: 3.16, unit: "pH" },
      acidez: { min: 0.33, max: 0.37, unit: "%" },
    },
  },
];

const summaryCards = [
  {
    title: "Lotes finalizados (7d)",
    value: "58",
    helper: "+8% vs semana anterior",
  },
  {
    title: "Bloqueados",
    value: "4",
    helper: "2 aguardam ação do QA",
  },
  {
    title: "Investigações ativas",
    value: "3",
    helper: "Monitorar PCC 04",
  },
];

const statusVariant: Record<FinishedLotStatus, "success" | "warning" | "danger"> = {
  Liberado: "success",
  Bloqueado: "danger",
  Investigação: "warning",
};

function isOOS(value: number, spec: MetricSpec) {
  return value < spec.min || value > spec.max;
}

export default function FinishedLotsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<"all" | FinishedLotStatus>("all");
  const [productFilter, setProductFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredLots = useMemo(() => {
    return finishedLots.filter((lot) => {
      const matchesStatus = statusFilter === "all" || lot.status === statusFilter;
      const matchesProduct =
        productFilter === "all" || lot.product.toLowerCase() === productFilter.toLowerCase();
      const normalizedSearch = search.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        lot.code.toLowerCase().includes(normalizedSearch) ||
        lot.product.toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesProduct && matchesSearch;
    });
  }, [productFilter, search, statusFilter]);

  const productOptions = useMemo(
    () => Array.from(new Set(finishedLots.map((lot) => lot.product))),
    []
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Qualidade · Produto final</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Lotes de produto final</h1>
          <p className="text-slate-400">
            Monitore carbono, Brix e pH em tempo real, destaque desvios e sincronize liberações com o laboratório.
          </p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/finished-lots/create">Criar Produto Final</Link>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.title} className="border-slate-900 bg-gradient-to-br from-slate-950/80 to-slate-900">
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {card.title}
              </CardDescription>
              <CardTitle className="text-3xl text-white">{card.value}</CardTitle>
              <p className="text-sm text-slate-400">{card.helper}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card className="border-slate-900">
        <CardHeader>
          <CardTitle>Filtro inteligente</CardTitle>
          <CardDescription>Refine por status, SKU ou pesquise diretamente.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Código ou produto"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="produto">Produto</Label>
              <Select
                id="produto"
                value={productFilter}
                onChange={(event) => setProductFilter(event.target.value)}
              >
                <option value="all">Todos</option>
                {productOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as FinishedLotStatus | "all")}
              >
                <option value="all">Todos</option>
                <option value="Liberado">Liberado</option>
                <option value="Bloqueado">Bloqueado</option>
                <option value="Investigação">Investigação</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-900">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Últimos lotes finalizados</CardTitle>
            <CardDescription>Clique em um lote para abrir o dossiê e rastrear análises.</CardDescription>
          </div>
          <Badge variant="neutral">{filteredLots.length} registros</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Linha</TableHead>
                <TableHead>CO₂</TableHead>
                <TableHead>Brix</TableHead>
                <TableHead>pH</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500">
                    Nenhum lote encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              )}
              {filteredLots.map((lot) => {
                const co2OOS = isOOS(lot.results.co2, lot.specs.co2);
                const brixOOS = isOOS(lot.results.brix, lot.specs.brix);
                const phOOS = isOOS(lot.results.ph, lot.specs.ph);
                const acidezOOS = isOOS(lot.results.acidez, lot.specs.acidez);

                return (
                  <TableRow
                    key={lot.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/finished-lots/${lot.id}`)}
                  >
                    <TableCell className="font-semibold text-white">
                      <div>{lot.code}</div>
                      <p className="text-xs text-slate-500">{new Date(lot.date).toLocaleDateString("pt-BR")}</p>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-white">{lot.product}</div>
                      <p
                        className={cn(
                          "text-xs text-slate-500",
                          acidezOOS && "text-red-400"
                        )}
                      >
                        Tanque {lot.tank} • Acidez {lot.results.acidez.toFixed(2)}{lot.specs.acidez.unit}
                        <span className="text-slate-500"> ({lot.specs.acidez.min.toFixed(2)}–{lot.specs.acidez.max.toFixed(2)}{lot.specs.acidez.unit})</span>
                        {acidezOOS && <Badge className="ml-2" variant="danger">OOS</Badge>}
                      </p>
                    </TableCell>
                    <TableCell className="text-slate-400">{lot.line}</TableCell>
                    <TableCell
                      className={cn(
                        "font-mono",
                        co2OOS ? "text-red-400" : "text-emerald-400"
                      )}
                    >
                      {lot.results.co2.toFixed(2)} {lot.specs.co2.unit}
                      <span className="ml-2 text-xs text-slate-500">{lot.specs.co2.min.toFixed(1)}–{lot.specs.co2.max.toFixed(1)}</span>
                      {co2OOS && <Badge className="ml-2" variant="danger">OOS</Badge>}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-mono",
                        brixOOS ? "text-red-400" : "text-emerald-400"
                      )}
                    >
                      {lot.results.brix.toFixed(2)} {lot.specs.brix.unit}
                      <span className="ml-2 text-xs text-slate-500">{lot.specs.brix.min.toFixed(1)}–{lot.specs.brix.max.toFixed(1)}</span>
                      {brixOOS && <Badge className="ml-2" variant="danger">OOS</Badge>}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-mono",
                        phOOS ? "text-red-400" : "text-emerald-400"
                      )}
                    >
                      {lot.results.ph.toFixed(2)}
                      <span className="ml-2 text-xs text-slate-500">{lot.specs.ph.min.toFixed(2)}–{lot.specs.ph.max.toFixed(2)}</span>
                      {phOOS && <Badge className="ml-2" variant="danger">OOS</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={statusVariant[lot.status]}>{lot.status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
