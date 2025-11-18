"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@/lib/zod-resolver";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

const productOptions = [
  { value: "cola-zero-350", label: "Cola Zero 350ml" },
  { value: "guarana-2l", label: "Guaraná 2L" },
  { value: "chá-pessego", label: "Chá Pêssego" },
];

const parameterOptions = [
  { value: "brix", label: "Brix" },
  { value: "ph", label: "pH" },
  { value: "co2", label: "CO₂" },
  { value: "densidade", label: "Densidade" },
];

const specSchema = z
  .object({
    produto: z.string().min(1, "Selecione o produto"),
    parametro: z.string().min(1, "Selecione o parâmetro"),
    unidade: z.string().min(1, "Informe a unidade"),
    min: z.coerce.number().finite("Valor inválido"),
    target: z.coerce.number().finite("Valor inválido"),
    max: z.coerce.number().finite("Valor inválido"),
  })
  .refine((values) => values.min <= values.target && values.target <= values.max, {
    message: "Garanta que Min ≤ Target ≤ Max",
    path: ["max"],
  });

type SpecFormValues = z.infer<typeof specSchema>;

export default function CreateProductSpecPage() {
  const form = useForm<SpecFormValues>({
    resolver: zodResolver(specSchema),
    defaultValues: {
      produto: "",
      parametro: "",
      unidade: "°Bx",
      min: 0,
      target: 0,
      max: 0,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = form;

  const [produto, parametro, unidade, min, target, max] = watch([
    "produto",
    "parametro",
    "unidade",
    "min",
    "target",
    "max",
  ]);

  const preview = useMemo(
    () => ({
      produto: productOptions.find((item) => item.value === produto)?.label ?? "Produto não definido",
      parametro:
        parameterOptions.find((item) => item.value === parametro)?.label ?? "Parâmetro não definido",
      faixa: `${min || 0} – ${max || 0} ${unidade || ""}`,
    }),
    [max, min, parametro, produto, unidade]
  );

  async function onSubmit(values: SpecFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Product Specs · Criação</p>
          <h1 className="text-3xl font-semibold text-white">Nova especificação</h1>
          <p className="text-slate-400">Mapeie limites por produto para liberar lotes com agilidade.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/product-specs">Voltar</Link>
          </Button>
          <Button variant="secondary" type="button" onClick={() => reset()}>
            Resetar
          </Button>
        </div>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Parâmetros alvo</CardTitle>
          <CardDescription>Defina unidade e faixa operacional</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Select id="produto" {...register("produto")}>
                  <option value="">Selecione</option>
                  {productOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.produto && <p className="text-sm text-red-400">{errors.produto.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="parametro">Parâmetro</Label>
                <Select id="parametro" {...register("parametro")}>
                  <option value="">Selecione</option>
                  {parameterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.parametro && <p className="text-sm text-red-400">{errors.parametro.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input id="unidade" placeholder="°Bx" {...register("unidade")} />
                {errors.unidade && <p className="text-sm text-red-400">{errors.unidade.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="min">Min</Label>
                <Input id="min" type="number" step="0.01" {...register("min")}/>
                {errors.min && <p className="text-sm text-red-400">{errors.min.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input id="target" type="number" step="0.01" {...register("target")}/>
                {errors.target && <p className="text-sm text-red-400">{errors.target.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Max</Label>
                <Input id="max" type="number" step="0.01" {...register("max")}/>
                {errors.max && <p className="text-sm text-red-400">{errors.max.message}</p>}
              </div>
            </div>

            <CardFooter className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-800/70 bg-slate-950/50 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-300">Pré-visualização</p>
                <p className="text-xs text-slate-500">{preview.produto}</p>
                <p className="text-xs text-slate-500">{preview.parametro} · {preview.faixa}</p>
              </div>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? "Gravando..." : "Salvar especificação"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-900 bg-slate-950/60">
        <CardHeader>
          <CardTitle>Status de validação</CardTitle>
          <CardDescription>Checklist rápido</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {["Produto", "Parâmetro", "Faixa"].map((label) => (
            <div key={label} className="rounded-xl border border-slate-900/70 bg-slate-950/50 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
              <p className="text-base text-white">{label === "Produto" ? preview.produto : label === "Parâmetro" ? preview.parametro : preview.faixa}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
