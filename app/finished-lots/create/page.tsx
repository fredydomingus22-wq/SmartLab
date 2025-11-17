"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@/lib/zod-resolver";
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

const intermediateLotOptions = [
  { value: "IL-240915-07", label: "IL-240915-07 · Cola Zero" },
  { value: "IL-240915-11", label: "IL-240915-11 · Guaraná Tradicional" },
  { value: "IL-240916-03", label: "IL-240916-03 · Chá Pêssego" },
  { value: "IL-240916-05", label: "IL-240916-05 · Tangerina Light" },
];

const lineOptions = [
  { value: "linha-pet-2", label: "Linha PET 2" },
  { value: "linha-lata-1", label: "Linha Lata 1" },
  { value: "envase-vidro", label: "Envase Vidro" },
  { value: "linha-pet-3", label: "Linha PET 3" },
];

const specWindows = {
  co2: { label: "CO₂", unit: "g/L", min: 5.8, max: 6.3 },
  brix: { label: "Brix", unit: "°Bx", min: 11.5, max: 12.1 },
  ph: { label: "pH", unit: "pH", min: 3.12, max: 3.25 },
  densidade: { label: "Densidade", unit: "g/cm³", min: 1.042, max: 1.048 },
} as const;

type SpecKey = keyof typeof specWindows;

const createFinishedLotSchema = z.object({
  codigoPf: z.string().min(4, "O código do lote de produto acabado é obrigatório."),
  loteIntermedio: z.string().min(1, "É obrigatório selecionar o lote de produto intermédio."),
  linha: z.string().min(1, "É obrigatório selecionar a linha de produção."),
  co2: z.coerce.number().min(0, "O valor de CO₂ é obrigatório."),
  brix: z.coerce.number().min(0, "O valor de Brix é obrigatório."),
  ph: z.coerce.number().min(0, "O valor de pH é obrigatório."),
  densidade: z.coerce.number().min(0, "O valor de densidade é obrigatório."),
  dataAnalise: z.string().min(1, "A data e hora da análise são obrigatórias."),
});

type CreateFinishedLotValues = z.infer<typeof createFinishedLotSchema>;

export default function CreateFinishedLotPage() {
  const form = useForm<CreateFinishedLotValues>({
    resolver: zodResolver(createFinishedLotSchema),
    defaultValues: {
      codigoPf: "FL-2024-09-032",
      loteIntermedio: "",
      linha: "",
      co2: 6.05,
      brix: 11.92,
      ph: 3.17,
      densidade: 1.045,
      dataAnalise: "2024-09-16T08:30",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = form;

  const [co2Value, brixValue, phValue, densidadeValue, loteIntermedioValue, linhaValue, dataAnaliseValue] = watch([
    "co2",
    "brix",
    "ph",
    "densidade",
    "loteIntermedio",
    "linha",
    "dataAnalise",
  ]);

  const intermediateLabel =
    intermediateLotOptions.find((option) => option.value === loteIntermedioValue)?.label ??
    loteIntermedioValue ??
    "";
  const lineLabel =
    lineOptions.find((option) => option.value === linhaValue)?.label ?? linhaValue ?? "";
  const hasAllMeasurements = [co2Value, brixValue, phValue, densidadeValue].every(
    (value) => typeof value === "number" && Number.isFinite(value)
  );
  const dataAnaliseLabel = dataAnaliseValue
    ? new Date(dataAnaliseValue).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "";

  const specInsights = useMemo(
    () =>
      (Object.keys(specWindows) as SpecKey[]).map((key) => {
        const value =
          key === "co2"
            ? co2Value
            : key === "brix"
            ? brixValue
            : key === "ph"
            ? phValue
            : densidadeValue;
        const spec = specWindows[key];
        if (value === undefined || Number.isNaN(value)) {
          return { key, value: "—", variant: "neutral" as const, helper: "Pendente" };
        }
        if (value < spec.min || value > spec.max) {
          return {
            key,
            value: value.toFixed(2),
            variant: "danger" as const,
            helper: value < spec.min ? "Abaixo" : "Acima",
          };
        }
        return {
          key,
          value: value.toFixed(2),
          variant: "success" as const,
          helper: "Dentro da janela",
        };
      }),
    [brixValue, co2Value, densidadeValue, phValue]
  );

  async function onSubmit(values: CreateFinishedLotValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produtos Acabados » Registar</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Registar Nova Análise de Produto Acabado</h1>
          <p className="text-slate-400">
            Registe as medições laboratoriais para libertação e rastreabilidade do lote.
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/finished-lots">Cancelar</Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border-slate-900/80 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Formulário de Análise</CardTitle>
            <CardDescription>Preencha os dados laboratoriais para o lote de produto acabado.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="codigoPf">Código do Lote de PA</Label>
                  <Input id="codigoPf" placeholder="FL-2024-09-032" {...register("codigoPf")} />
                  {errors.codigoPf && (
                    <p className="text-sm text-red-400">{errors.codigoPf.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loteIntermedio">Produto Intermédio</Label>
                  <Select id="loteIntermedio" {...register("loteIntermedio")}>
                    <option value="">Selecione o lote intermédio</option>
                    {intermediateLotOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.loteIntermedio && (
                    <p className="text-sm text-red-400">{errors.loteIntermedio.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linha">Linha de Produção</Label>
                  <Select id="linha" {...register("linha")}>
                    <option value="">Selecione a linha</option>
                    {lineOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.linha && <p className="text-sm text-red-400">{errors.linha.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataAnalise">Data e Hora da Análise</Label>
                  <Input type="datetime-local" id="dataAnalise" {...register("dataAnalise")} />
                  {errors.dataAnalise && (
                    <p className="text-sm text-red-400">{errors.dataAnalise.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="co2">CO₂ (g/L)</Label>
                  <Input
                    id="co2"
                    type="number"
                    step="0.01"
                    {...register("co2", { valueAsNumber: true })}
                  />
                  {errors.co2 && <p className="text-sm text-red-400">{errors.co2.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brix">Brix (°Bx)</Label>
                  <Input
                    id="brix"
                    type="number"
                    step="0.01"
                    {...register("brix", { valueAsNumber: true })}
                  />
                  {errors.brix && <p className="text-sm text-red-400">{errors.brix.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">pH</Label>
                  <Input
                    id="ph"
                    type="number"
                    step="0.01"
                    {...register("ph", { valueAsNumber: true })}
                  />
                  {errors.ph && <p className="text-sm text-red-400">{errors.ph.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="densidade">Densidade (g/cm³)</Label>
                  <Input
                    id="densidade"
                    type="number"
                    step="0.001"
                    {...register("densidade", { valueAsNumber: true })}
                  />
                  {errors.densidade && (
                    <p className="text-sm text-red-400">{errors.densidade.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-slate-900 bg-slate-950/60 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Rastreabilidade</p>
                  <p className="text-xs text-slate-500">
                    {loteIntermedioValue
                      ? `Associado ao ${intermediateLabel} em ${lineLabel || "linha indefinida"}`
                      : "Selecione o lote intermédio e a linha"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {dataAnaliseLabel
                      ? `Análise registada em ${dataAnaliseLabel}`
                      : "Informe a data/hora da análise"}
                  </p>
                </div>
                <Button type="submit" variant="primary" className="min-w-[200px]" disabled={isSubmitting}>
                  {isSubmitting ? "A registar..." : "Registar Análise de PA"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-900/70 bg-gradient-to-b from-slate-950 to-slate-900">
            <CardHeader>
              <CardTitle>Janela de Especificação</CardTitle>
              <CardDescription>Valide se os parâmetros estão dentro dos limites.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {specInsights.map((item) => {
                const spec = specWindows[item.key];
                return (
                  <div key={item.key} className="rounded-xl border border-slate-900/70 bg-slate-950/60 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{spec.label}</p>
                        <p className="text-2xl font-semibold text-white">
                          {item.value}
                          <span className="ml-1 text-sm text-slate-500">{spec.unit}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Limite {spec.min.toFixed(2)} – {spec.max.toFixed(2)} {spec.unit}
                        </p>
                      </div>
                      <Badge variant={item.variant as "success" | "neutral" | "danger"}>{item.helper}</Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-slate-900/60 bg-slate-950/60">
            <CardHeader>
              <CardTitle>Checklist de Libertação</CardTitle>
              <CardDescription>O estado é atualizado em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: "Lote Intermédio Vinculado",
                  detail: loteIntermedioValue ? intermediateLabel : "Selecione um lote intermédio",
                  ready: Boolean(loteIntermedioValue),
                },
                {
                  label: "Linha de Produção Configurada",
                  detail: linhaValue ? lineLabel : "Escolha a linha de envase",
                  ready: Boolean(linhaValue),
                },
                {
                  label: "Dados Laboratoriais Completos",
                  detail: hasAllMeasurements
                    ? "Todos os campos preenchidos"
                    : "Preencha CO₂, Brix, pH e Densidade",
                  ready: hasAllMeasurements,
                },
                {
                  label: "Registo Temporal Válido",
                  detail: dataAnaliseLabel ? dataAnaliseLabel : "Defina a data e hora",
                  ready: Boolean(dataAnaliseValue),
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-xl border border-slate-900/60 bg-slate-950/40 p-4">
                  <span
                    className={
                      item.ready
                        ? "mt-1 h-2 w-2 rounded-full bg-emerald-400"
                        : "mt-1 h-2 w-2 rounded-full bg-amber-400"
                    }
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <Badge variant={item.ready ? "success" : "warning"}>{item.ready ? "OK" : "Pendente"}</Badge>
                    </div>
                    <p className="text-sm text-slate-400">{item.detail}</p>
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
