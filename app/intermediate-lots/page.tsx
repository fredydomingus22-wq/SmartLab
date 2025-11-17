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

interface IntermediateLot {
  id: string;
  parentLot: string;
  product: string;
  tank: string;
  startedAt: string; // ISO date
  status: LotStatus;
  specs: {
    brix: string;
    ph: string;
    acidity: string;
  };
  operator: string;
  hasNc: boolean;
}

type LotStatus = "em_preparo" | "homogeneizando" | "ajuste_lab" | "pronto_envase" | "bloqueado";

const intermediateLots: IntermediateLot[] = [
  {
    id: "IL-240915-07",
    parentLot: "PL-240915-01",
    product: "Syrup Cola Zero",
    tank: "TK-12",
    startedAt: "2024-09-15",
    status: "homogeneizando",
    specs: {
      brix: "63.5 °Bx",
      ph: "3.08",
      acidity: "0.27 %",
    },
    operator: "S. Prado",
    hasNc: false,
  },
  {
    id: "IL-240915-09",
    parentLot: "PL-240915-04",
    product: "Syrup Guaraná",
    tank: "TK-08",
    startedAt: "2024-09-15",
    status: "ajuste_lab",
    specs: {
      brix: "64.1 °Bx",
      ph: "3.25",
      acidity: "0.31 %",
    },
    operator: "J. Costa",
    hasNc: true,
  },
  {
    id: "IL-240915-11",
    parentLot: "PL-240915-05",
    product: "Syrup Chá Pêssego",
    tank: "TK-04",
    startedAt: "2024-09-14",
    status: "pronto_envase",
    specs: {
      brix: "58.4 °Bx",
      ph: "3.32",
      acidity: "0.23 %",
    },
    operator: "P. Rodrigues",
    hasNc: false,
  },
  {
    id: "IL-240915-13",
    parentLot: "PL-240915-06",
    product: "Syrup Tangerina",
    tank: "TK-03",
    startedAt: "2024-09-16",
    status: "em_preparo",
    specs: {
      brix: "61.9 °Bx",
      ph: "3.12",
      acidity: "0.29 %",
    },
    operator: "M. Silva",
    hasNc: false,
  },
  {
    id: "IL-240915-15",
    parentLot: "PL-240915-02",
    product: "Syrup Isotônico Citrus",
    tank: "TK-15",
    startedAt: "2024-09-16",
    status: "bloqueado",
    specs: {
      brix: "57.7 °Bx",
      ph: "3.45",
      acidity: "0.36 %",
    },
    operator: "R. Nogueira",
    hasNc: true,
  },
];

const statusMeta: Record<LotStatus, { label: string; variant: BadgeVariant; helper: string }> = {
  em_preparo: { label: "Em preparo", variant: "neutral", helper: "Pesagem em curso" },
  homogeneizando: { label: "Homogeneizando", variant: "success", helper: "Agitação controlada" },
  ajuste_lab: { label: "Ajuste lab", variant: "warning", helper: "Aguardando correções" },
  pronto_envase: { label: "Pronto p/ envase", variant: "success", helper: "Dentro da janela" },
  bloqueado: { label: "Bloqueado", variant: "danger", helper: "NC ativa" },
};

const statusOptions: { value: "" | LotStatus; label: string }[] = [
  { value: "", label: "Todos os status" },
  { value: "em_preparo", label: "Em preparo" },
  { value: "homogeneizando", label: "Homogeneizando" },
  { value: "ajuste_lab", label: "Ajuste laboratorial" },
  { value: "pronto_envase", label: "Pronto para envase" },
  { value: "bloqueado", label: "Bloqueado" },
];

export default function IntermediateLotsPage() {
  const router = useRouter();
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | LotStatus>("");

  const productOptions = useMemo(() => {
    const base = [{ label: "Todos os produtos", value: "" }];
    const unique = Array.from(new Set(intermediateLots.map((lot) => lot.product))).map((product) => ({
      label: product,
      value: product,
    }));
    return [...base, ...unique];
  }, []);

  const filteredLots = useMemo(() => {
    return intermediateLots.filter((lot) => {
      const matchesProduct = productFilter === "" || lot.product === productFilter;
      const matchesDate = dateFilter === "" || lot.startedAt === dateFilter;
      const matchesStatus = statusFilter === "" || lot.status === statusFilter;
      return matchesProduct && matchesDate && matchesStatus;
    });
  }, [productFilter, dateFilter, statusFilter]);

  const summary = useMemo(() => {
    const active = intermediateLots.filter((lot) => lot.status !== "pronto_envase" && lot.status !== "bloqueado").length;
    const ready = intermediateLots.filter((lot) => lot.status === "pronto_envase").length;
    const withNc = intermediateLots.filter((lot) => lot.hasNc).length;
    return { active, ready, withNc };
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Xaropeira · Lotes intermédios</p>
          <h1 className="text-3xl font-semibold text-white">Controle de Lotes Intermédios</h1>
          <p className="text-slate-400">Visão consolidada dos tanques ativos, especificações críticas e vínculo com o lote pai.</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/intermediate-lots/create">Criar Lote Intermédio</Link>
        </Button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Lotes ativos", value: summary.active, helper: "Em preparo ou homogeneização" },
          { title: "Prontos para envase", value: summary.ready, helper: "Aguardando transferência" },
          { title: "Com NC ligada", value: summary.withNc, helper: "Exigem alinhamento QA" },
        ].map((card) => (
          <Card
            key={card.title}
            className="border-slate-900 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950"
          >
            <CardHeader>
              <CardDescription className="text-xs uppercase tracking-[0.25em] text-slate-500">
                {card.title}
              </CardDescription>
              <CardTitle className="text-4xl text-white">{card.value}</CardTitle>
              <p className="text-sm text-slate-400">{card.helper}</p>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card className="border-slate-900">
        <CardHeader className="gap-6 lg:flex lg:items-end lg:justify-between">
          <div>
            <CardTitle>Filtros inteligentes</CardTitle>
            <CardDescription>Combine produto, data de cozimento e status operacional</CardDescription>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setProductFilter("");
              setDateFilter("");
              setStatusFilter("");
            }}
          >
            Limpar filtros
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Produto</p>
            <Select value={productFilter} onChange={(event) => setProductFilter(event.target.value)}>
              {productOptions.map((option) => (
                <option key={option.value || "all-products"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Data de início</p>
            <Input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Status</p>
            <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as LotStatus | "") }>
              {statusOptions.map((option) => (
                <option key={option.value || "all-status"} value={option.value}>
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
            <CardTitle>Lotes intermédios</CardTitle>
            <CardDescription>Detalhes de especificação e vínculo com lote pai</CardDescription>
          </div>
          <p className="text-sm text-slate-400">{filteredLots.length} lote(s) encontrados</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote intermédio</TableHead>
                <TableHead>Lote pai</TableHead>
                <TableHead>Produto / Tanque</TableHead>
                <TableHead>Especificações</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLots.map((lot) => {
                const meta = statusMeta[lot.status];
                return (
                  <TableRow
                    key={lot.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/intermediate-lots/${lot.id}`)}
                  >
                    <TableCell className="font-semibold text-white">
                      <div>{lot.id}</div>
                      <p className="text-xs text-slate-500">Iniciado {new Date(lot.startedAt).toLocaleDateString("pt-BR")}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-slate-200">{lot.parentLot}</p>
                      <p className="text-xs text-slate-500">Responsável {lot.operator}</p>
                    </TableCell>
                    <TableCell>
                      <p>{lot.product}</p>
                      <p className="text-xs text-slate-500">Tanque {lot.tank}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-3 text-sm text-slate-200">
                        <span>Brix {lot.specs.brix}</span>
                        <span>pH {lot.specs.ph}</span>
                        <span>Acidez {lot.specs.acidity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                        <p className="text-xs text-slate-500">{meta.helper}</p>
                        {lot.hasNc && <Badge variant="danger">NC ligada</Badge>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredLots.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">
              Nenhum lote encontrado com os filtros atuais.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
