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

const pccSchema = z.object({
  process: z.string().min(3, "O processo é obrigatório."),
  hazard: z.string().min(3, "O perigo é obrigatório."),
  criticalLimits: z.string().min(3, "Os limites críticos são obrigatórios."),
  correctiveActions: z.string().min(3, "As ações corretivas são obrigatórias."),
  assinatura: z.string().min(3, "A assinatura do analista é obrigatória."),
});

type PccFormValues = z.infer<typeof pccSchema>;

export default function CreatePccPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PccFormValues>({
    resolver: zodResolver(pccSchema),
  });

  async function onSubmit(values: PccFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
  }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Food Safety » PCC » Registar</p>
                <h1 className="text-3xl font-semibold text-white">Registar Novo Ponto Crítico de Controlo (PCC)</h1>
            </div>
            <Button variant="ghost" asChild><Link href="/food-safety/pcc">Cancelar</Link></Button>
        </div>
      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Detalhes do PCC</CardTitle>
          <CardDescription>Defina o processo, perigo, limites críticos e ações corretivas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="process">Processo</Label>
                  <Input id="process" {...register("process")} />
                  {errors.process && <p className="text-sm text-red-500">{errors.process.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hazard">Perigo</Label>
                  <Input id="hazard" {...register("hazard")} />
                  {errors.hazard && <p className="text-sm text-red-500">{errors.hazard.message}</p>}
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="criticalLimits">Limites Críticos</Label>
              <Textarea id="criticalLimits" {...register("criticalLimits")} />
              {errors.criticalLimits && <p className="text-sm text-red-500">{errors.criticalLimits.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="correctiveActions">Ações Corretivas</Label>
              <Textarea id="correctiveActions" {...register("correctiveActions")} />
              {errors.correctiveActions && <p className="text-sm text-red-500">{errors.correctiveActions.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="assinatura">Assinatura do Analista</Label>
              <Input id="assinatura" {...register("assinatura")} />
              {errors.assinatura && <p className="text-sm text-red-500">{errors.assinatura.message}</p>}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "A registar..." : "Registar PCC"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
