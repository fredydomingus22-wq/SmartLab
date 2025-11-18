"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@/lib/zod-resolver";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const trainingSchema = z.object({
  titulo: z.string().min(3, "Informe o título."),
  instrutor: z.string().min(1, "Selecione o instrutor."),
  data: z.string().min(1, "Defina a data."),
  validade: z
    .coerce.number({ invalid_type_error: "Informe a validade em meses." })
    .min(1, "Mínimo 1 mês."),
});

type TrainingFormValues = z.infer<typeof trainingSchema>;

const instructors = [
  { value: "qa-manager", label: "M. Costa" },
  { value: "lab-lead", label: "F. Santos" },
  { value: "food-safety", label: "T. Prado" },
  { value: "external", label: "Consultor externo" },
];

const defaultDate = new Date().toISOString().slice(0, 16);

export default function CreateTrainingPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<TrainingFormValues>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      titulo: "",
      instrutor: "",
      data: defaultDate,
      validade: 12,
    },
  });

  const instrutorValue = watch("instrutor");
  const validadeValue = watch("validade");
  const dataValue = watch("data");

  const readiness = useMemo(
    () => [
      {
        label: "Instrutor",
        value: instrutorValue ? instructors.find((i) => i.value === instrutorValue)?.label : "Selecione",
        variant: instrutorValue ? "success" : "warning",
      },
      {
        label: "Data Agendada",
        value: dataValue ? new Date(dataValue).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Definir",
        variant: dataValue ? "success" : "warning",
      },
      {
        label: "Validade",
        value: `${validadeValue || "-"} meses`,
        variant: validadeValue ? "success" : "warning",
      },
    ],
    [dataValue, instrutorValue, validadeValue]
  );

  async function onSubmit(values: TrainingFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Treinamentos » Criar</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Novo Programa de Treinamento</h1>
          <p className="text-slate-400">Estruture título, instrutor responsável e validade corporativa.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/trainings">Voltar</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Detalhes do Programa</CardTitle>
            <CardDescription>Campos obrigatórios para liberação do treinamento.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input id="titulo" placeholder="Ex.: HACCP Avançado" {...register("titulo")} />
                  {errors.titulo && <p className="text-sm text-red-400">{errors.titulo.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instrutor">Instrutor</Label>
                  <Select id="instrutor" {...register("instrutor")}>
                    <option value="">Selecione</option>
                    {instructors.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.instrutor && <p className="text-sm text-red-400">{errors.instrutor.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input id="data" type="datetime-local" {...register("data")} />
                  {errors.data && <p className="text-sm text-red-400">{errors.data.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validade">Validade (meses)</Label>
                  <Input id="validade" type="number" min={1} {...register("validade", { valueAsNumber: true })} />
                  {errors.validade && <p className="text-sm text-red-400">{errors.validade.message}</p>}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[200px]">
                  {isSubmitting ? "Salvando..." : "Salvar Treinamento"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-900/70 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Checklist de Prontidão</CardTitle>
            <CardDescription>Atualiza conforme os campos são preenchidos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {readiness.map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-900/60 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
                    <p className="text-base text-white">{item.value}</p>
                  </div>
                  <Badge variant={item.variant === "success" ? "success" : "warning"}>
                    {item.variant === "success" ? "OK" : "Pendente"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
