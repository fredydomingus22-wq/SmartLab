"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "O nome do parâmetro é obrigatório."),
  description: z.string().optional(),
  unit: z.string().min(1, "A unidade de medida é obrigatória."),
});

type ParameterFormValues = z.infer<typeof schema>;

export default function CreateParameterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ParameterFormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: ParameterFormValues) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Parâmetros & Specs</p>
          <h1 className="text-3xl font-semibold text-white">Novo Parâmetro</h1>
          <p className="text-slate-400">Crie um novo parâmetro para ser usado nas especificações de produto.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/product-specs">Voltar</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Detalhes do Parâmetro</CardTitle>
            <CardDescription>Forneça um nome, descrição e unidade de medida.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Parâmetro</Label>
              <Input id="name" placeholder="Ex: Brix, pH, CO₂" {...register("name")} />
              {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" placeholder="Descreva o propósito do parâmetro." {...register("description")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade de Medida</Label>
              <Input id="unit" placeholder="Ex: °Bx, pH, g/L" {...register("unit")} />
              {errors.unit && <p className="text-sm text-red-400">{errors.unit.message}</p>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
