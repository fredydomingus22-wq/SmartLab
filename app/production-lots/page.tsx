"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductionLot {
  id: string;
  product: string;
  line: string;
  shift: string;
  plannedDate: string;
  status: LotStatus;
  progress: number;
  volume: string;
  hasNc: boolean;
}

type LotStatus = "planejado" | "em_producao" | "aguardando_qc" | "bloqueado" | "concluido";

const productionLots: ProductionLot[] = [
  {
    id: "PL-240915-01",
    product: "Cola Zero 350ml",
    line: "Linha PET 2",
    shift: "Noite",
    plannedDate: "2024-09-15",
    status: "em_producao",
    progress: 82,
    volume: "48k L",
    hasNc: false,
  },
  {
    id: "PL-240915-02",
    product: "Guaraná Clássico 2L",
    line: "Linha PET 1",
    shift: "Manhã",
    plannedDate: "2024-09-15",
    status: "aguardando_qc",
    progress: 64,
    volume: "60k L",
    hasNc: false,
  },
  {
    id: "PL-240915-03",
    product: "Chá Pêssego 1L",
    line: "Linha Vidro",
    shift: "Tarde",
    plannedDate: "2024-09-14",
    status: "concluido",
    progress: 100,
    volume: "32k L",
    hasNc: false,
  },
  {
    id: "PL-240915-04",
    product: "Tangerina Light 600ml",
    line: "Linha Lata",
    shift: "Noite",
    plannedDate: "2024-09-15",
    status: "bloqueado",
    progress: 58,
    volume: "40k L",
    hasNc: true,
  },
  {
    id: "PL-240915-05",
    product: "Água com Gás 500ml",
    line: "Linha Lata",
    shift: "Manhã",
    plannedDate: "2024-09-16",
    status: "planejado",
    progress: 15,
    volume: "55k L",
    hasNc: false,
  },
  {
    id: "PL-240915-06",
    product: "Isotônico Citrus 1L",
    line: "Linha PET 3",
    shift: "Tarde",
    plannedDate: "2024-09-16",
    status: "em_producao",
    progress: 41,
    volume: "36k L",
    hasNc: true,
  },
];

const statusMeta: Record<LotStatus, { label: string; variant: BadgeVariant; emphasis: string }> = {
  planejado: { label: "Planejado", variant: "neutral", emphasis: "Sequenciado" },
  em_producao: { label: "Em produção", variant: "warning", emphasis: "Processando" },
  aguardando_qc: { label: "Aguardando QA", variant: "warning", emphasis: "Pend. liberação" },
  bloqueado: { label: "Bloqueado", variant: "danger", emphasis: "Requer ação" },
  concluido: { label: "Concluído", variant: "success", emphasis: "Liberado" },
};

const statusOptions: { value: "" | LotStatus; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "planejado", label: "Planejado" },
  { value: "em_producao", label: "Em produção" },
  { value: "aguardando_qc", label: "Aguardando QA" },
  { value: "bloqueado", label: "Bloqueado" },
  { value: "concluido", label: "Concluído" },
];

export default function ProductionLotsPage() {
  const router = useRouter();
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | LotStatus>("");

  const productOptions = useMemo(
    () => [
      { label: "Todos os produtos", value: "" },
      ...Array.from(new Set(productionLots.map((lot) => lot.product))).map((product) => ({
        label: product,
        value: product,
      })),
    ],
    []
  );

  const filteredLots = useMemo(() => {
    return productionLots.filter((lot) => {
      const matchesProduct = productFilter === "" || lot.product === productFilter;
      const matchesDate = dateFilter === "" || lot.plannedDate === dateFilter;
      const matchesStatus = statusFilter === "" || lot.status === statusFilter;
      return matchesProduct && matchesDate && matchesStatus;
    });
  }, [productFilter, dateFilter, statusFilter]);

  const summary = useMemo(() => {
    const active = productionLots.filter((lot) => lot.status !== "concluido").length;
    const concluded = productionLots.filter((lot) => lot.status === "concluido").length;
    const withNc = productionLots.filter((lot) => lot.hasNc).length;
    return {
      active,
      concluded,
      withNc,
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Orquestração</p>
          <h1 className="text-3xl font-semibold text-white">Lotes de Produção</h1>
          <p className="text-slate-400">Monitoramento em tempo real dos lotes pai e seu status de liberação.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/production-lots/create">Criar Lote Pai</Link>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[{ title: "Lotes ativos", value: summary.active, helper: "Em planejamento ou execução" }, { title: "Lotes concluídos", value: summary.concluded, helper: "Liberados nas últimas 48h" }, { title: "Lotes com NC ligadas", value: summary.withNc, helper: "Exigem acompanhamento" }].map((card) => (
          <Card
            key={card.title}
            className="border-slate-900 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950 shadow-2xl"
          >
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {card.title}
              </CardDescription>
              <CardTitle className="text-4xl text-white">{card.value}</CardTitle>
              <p className="text-sm text-slate-400">{card.helper}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card className="border-slate-900">
        <CardHeader>
          <CardTitle>Filtros avançados</CardTitle>
          <CardDescription>Refine a visualização por produto, data e status</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Produto</p>
            <Select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}>
              {productOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Data planejada</p>
            <Input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Status</p>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "" | LotStatus)}>
              {statusOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-900">
        <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Pipeline de Lotes Pai</CardTitle>
            <CardDescription>{filteredLots.length} resultados alinhados aos filtros atuais</CardDescription>
          </div>
          <Button variant="ghost" onClick={() => {
            setProductFilter("");
            setDateFilter("");
            setStatusFilter("");
          }}>
            Limpar filtros
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote</TableHead>
                <TableHead>Produto / Linha</TableHead>
                <TableHead>Janela</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500">
                    Nenhum lote encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
              {filteredLots.map((lot) => {
                const meta = statusMeta[lot.status];
                return (
                  <TableRow
                    key={lot.id}
                    className="cursor-pointer border-b border-slate-900/40 hover:border-sky-500/40"
                    onClick={() => router.push(`/production-lots/${lot.id}`)}
                  >
                    <TableCell className="font-semibold text-white">
                      <div>{lot.id}</div>
                      <p className="text-xs text-slate-500">Volume {lot.volume}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-white">{lot.product}</p>
                      <p className="text-xs text-slate-500">{lot.line} • Turno {lot.shift}</p>
                    </TableCell>
                    <TableCell>
                      <p>{new Date(lot.plannedDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</p>
                      <p className="text-xs text-slate-500">Sequência #{lot.id.slice(-2)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{meta.emphasis}</span>
                          <span className="text-white">{lot.progress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-sky-500"
                            style={{ width: `${lot.progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                        {lot.hasNc && <Badge variant="danger">NC ligada</Badge>}
                      </div>
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
