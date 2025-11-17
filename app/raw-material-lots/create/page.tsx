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

const materials = [
  { value: "rm-001", label: "Açúcar VHP" },
  { value: "rm-002", label: "CO₂ Alimentício" },
  { value: "rm-003", label: "Concentrado Guaraná" },
];

const suppliers = [
  { value: "sup-001", label: "Sweet Harvest" },
  { value: "sup-002", label: "Citrus Prime" },
  { value: "sup-003", label: "GásSul" },
];

const schema = z.object({
  codigo: z.string().min(3, "Informe o código do lote."),
  material: z.string().min(1, "Selecione o material."),
  fornecedor: z.string().min(1, "Selecione o fornecedor."),
  data: z.string().min(1, "Informe a data de recebimento."),
  quantidade: z.string().min(1, "Informe a quantidade."),
  status: z.enum(["quarentena", "liberado", "bloqueado"]),
});

type RawMaterialLotFormValues = z.infer<typeof schema>;

export default function CreateRawMaterialLotPage() {
  const form = useForm<RawMaterialLotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      codigo: "RML-2024-0915-01",
      material: "",
      fornecedor: "",
      data: new Date().toISOString().slice(0, 16),
      quantidade: "1000",
      status: "quarentena",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = form;

  const statusValue = watch("status");
  const statusCopy = useMemo(
    () => ({
      quarentena: { label: "Quarentena", helper: "Aguardando COA" },
      liberado: { label: "Liberado", helper: "Disponível para produção" },
      bloqueado: { label: "Bloqueado", helper: "NC aberta" },
    }),
    []
  );

  async function onSubmit(values: RawMaterialLotFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Matéria-prima</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Receber lote de matéria-prima</h1>
          <p className="text-slate-400">Registre inspeções de recebimento e status de quarentena.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/raw-material-lots">Voltar</Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Ficha do lote</CardTitle>
            <CardDescription>Informações mínimas para rastrear o recebimento.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" placeholder="RML-2024-0915-01" {...register("codigo")} />
                {errors.codigo && <p className="text-sm text-red-400">{errors.codigo.message}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select id="material" {...register("material")}>
                    <option value="">Selecione</option>
                    {materials.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.material && <p className="text-sm text-red-400">{errors.material.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fornecedor">Fornecedor</Label>
                  <Select id="fornecedor" {...register("fornecedor")}>
                    <option value="">Selecione</option>
                    {suppliers.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.fornecedor && (
                    <p className="text-sm text-red-400">{errors.fornecedor.message}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="data">Data de recebimento</Label>
                  <Input id="data" type="datetime-local" {...register("data")} />
                  {errors.data && <p className="text-sm text-red-400">{errors.data.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input id="quantidade" type="number" step="0.01" {...register("quantidade")} />
                  {errors.quantidade && (
                    <p className="text-sm text-red-400">{errors.quantidade.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" {...register("status")}>
                  <option value="quarentena">Quarentena</option>
                  <option value="liberado">Liberado</option>
                  <option value="bloqueado">Bloqueado</option>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Registrando..." : "Registrar lote"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Status operacional</CardTitle>
            <CardDescription>Atualizado conforme o formulário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Situação atual</p>
                  <p className="text-base text-white">{statusCopy[statusValue].label}</p>
                </div>
                <Badge variant={statusValue === "bloqueado" ? "danger" : statusValue === "liberado" ? "success" : "warning"}>
                  {statusCopy[statusValue].label}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">{statusCopy[statusValue].helper}</p>
            </div>
            <div className="rounded-2xl border border-slate-900/80 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Checklist</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Conferir COA anexado</li>
                <li>• Garantir temperatura de recebimento dentro da faixa</li>
                <li>• Registrar inspeção visual e lacres</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
