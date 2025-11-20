"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@/lib/zod-resolver";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const productOptions = [
  { value: "cola-zero-350", label: "Cola Zero 350ml" },
  { value: "guarana-1l", label: "Guaraná 1L" },
  { value: "cha-pessego", label: "Chá Pêssego 500ml" },
  { value: "agua-gas", label: "Água com gás 1,5L" },
];

const lineOptions = [
  { value: "pet-02", label: "Linha PET 02" },
  { value: "lata-01", label: "Linha Lata 01" },
  { value: "vidro-01", label: "Envase Vidro" },
  { value: "siropeira-a", label: "Siropeira A" },
];

const shiftOptions = [
  { value: "manha", label: "Turno Manhã" },
  { value: "tarde", label: "Turno Tarde" },
  { value: "noite", label: "Turno Noite" },
];

const createLotSchema = z.object({
  codigo: z
    .string()
    .min(4, "Informe um código válido."),
  produto: z.string().min(1, "Selecione o produto."),
  linha: z.string().min(1, "Selecione a linha."),
  turno: z.string().min(1, "Selecione o turno."),
  dataInicio: z.string().min(1, "Defina a data de início."),
  observacoes: z
    .string()
    .max(600, "Máximo de 600 caracteres.")
    .optional()
    .or(z.literal("")),
});

type CreateLotFormValues = z.infer<typeof createLotSchema>;

export default function CreateProductionLotPage() {
  const form = useForm<CreateLotFormValues>({
    resolver: zodResolver(createLotSchema),
    defaultValues: {
      codigo: "PL-2024-09-018",
      produto: "",
      linha: "",
      turno: "",
      dataInicio: "2024-09-15T08:00",
      observacoes: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = form;

  const [codigoValue, produtoValue, linhaValue, turnoValue, dataInicioValue] = watch([
    "codigo",
    "produto",
    "linha",
    "turno",
    "dataInicio",
  ]);

  const productLabel = productOptions.find((item) => item.value === produtoValue)?.label;
  const lineLabel = lineOptions.find((item) => item.value === linhaValue)?.label;
  const shiftLabel = shiftOptions.find((item) => item.value === turnoValue)?.label;

  const readinessCards = useMemo(
    () => [
      {
        title: "Produto Definido",
        detail: productLabel ?? "Selecione o SKU",
        status: productLabel ? "success" : "warning",
      },
      {
        title: "Linha Preparada",
        detail: lineLabel ?? "Escolha a linha de envase",
        status: lineLabel ? "success" : "warning",
      },
      {
        title: "Turno Designado",
        detail: shiftLabel ?? "Indique o turno responsável",
        status: shiftLabel ? "success" : "warning",
      },
    ],
    [lineLabel, productLabel, shiftLabel]
  );

  async function onSubmit(values: CreateLotFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Lotes de Produção » Criação</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Novo Lote de Produção</h1>
          <p className="text-slate-400">
            Configure o lote pai com contexto de produto, linha e turno para sincronizar envase e laboratório.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/production-lots">Voltar</Link>
          </Button>
          <Button variant="secondary" type="button" onClick={() => reset()}>
            Limpar Formulário
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Ficha do Lote</CardTitle>
            <CardDescription>
              Dados obrigatórios para liberar preparação, mistura e rastreabilidade do lote pai.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código do Lote</Label>
                  <Input id="codigo" placeholder="PL-2024-09-018" {...register("codigo")} />
                  {errors.codigo && (
                    <p className="text-sm text-red-400">{errors.codigo.message}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    Utilize o padrão corporativo (PL-AAAA-MM-XXX).
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="produto">Produto</Label>
                  <Select id="produto" {...register("produto")}>
                    <option value="">Selecione o produto</option>
                    {productOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.produto && (
                    <p className="text-sm text-red-400">{errors.produto.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linha">Linha</Label>
                  <Select id="linha" {...register("linha")}>
                    <option value="">Selecione a linha</option>
                    {lineOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.linha && (
                    <p className="text-sm text-red-400">{errors.linha.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turno">Turno</Label>
                  <Select id="turno" {...register("turno")}>
                    <option value="">Selecione o turno</option>
                    {shiftOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.turno && (
                    <p className="text-sm text-red-400">{errors.turno.message}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="datetime-local"
                    {...register("dataInicio")}
                  />
                  {errors.dataInicio && (
                    <p className="text-sm text-red-400">{errors.dataInicio.message}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    rows={4}
                    placeholder="Instruções complementares para envase, laboratório ou PCCs..."
                    {...register("observacoes")}
                  />
                  {errors.observacoes && (
                    <p className="text-sm text-red-400">{errors.observacoes.message}</p>
                  )}
                </div>
              </div>

              <CardFooter className="flex flex-col gap-4 border border-dashed border-slate-800/70 bg-slate-950/40 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-300">Resumo Instantâneo</p>
                  <p className="text-xs text-slate-500">
                    {productLabel ? `Produto ${productLabel} em ${lineLabel ?? "linha indefinida"}` : "Preencha os campos principais para liberar planejamento"}
                  </p>
                </div>
                <Button type="submit" variant="primary" className="min-w-[200px]" disabled={isSubmitting}>
                  {isSubmitting ? "Registando..." : "Registar Lote de Produção"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <CardHeader>
              <CardTitle>Checklist Operacional</CardTitle>
              <CardDescription>Indicadores atualizados conforme você preenche.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {readinessCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{card.title}</p>
                      <p className="text-base text-white">{card.detail}</p>
                    </div>
                    <Badge variant={card.status === "success" ? "success" : "warning"}>
                      {card.status === "success" ? "OK" : "Pendente"}
                    </Badge>
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Data Prevista</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {dataInicioValue ? new Date(dataInicioValue).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Defina a data"}
                </p>
                <p className="text-xs text-slate-500">Sincronize com laboratório e PCP.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-900/70 bg-slate-950/70">
            <CardHeader>
              <CardTitle>Timeline de Preparação</CardTitle>
              <CardDescription>Preview automático para comunicar equipes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Planejamento",
                  detail: codigoValue ? `Lote ${codigoValue}` : "Informe o código",
                  status: codigoValue ? "success" : "warning",
                },
                {
                  label: "Mixagem",
                  detail: lineLabel ? `${lineLabel}` : "Linha indefinida",
                  status: lineLabel ? "success" : "warning",
                },
                {
                  label: "Envase",
                  detail: shiftLabel ? shiftLabel : "Selecione turno",
                  status: shiftLabel ? "success" : "warning",
                },
              ].map((step) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full"
                    style={{ backgroundColor: step.status === "success" ? "#34d399" : "#fbbf24" }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{step.label}</p>
                      <Badge variant={step.status === "success" ? "success" : "warning"}>
                        {step.status === "success" ? "OK" : "Pendente"}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">{step.detail}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
