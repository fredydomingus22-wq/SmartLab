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

const oprpSchema = z.object({
  controlPoint: z.string().min(3, "O ponto de controlo é obrigatório."),
  criticalLimit: z.string().min(3, "O limite crítico é obrigatório."),
  monitoringMethod: z.string().min(3, "O método de monitorização é obrigatório."),
  assinatura: z.string().min(3, "A assinatura do analista é obrigatória."),
});

type OprpFormValues = z.infer<typeof oprpSchema>;

export default function CreateOprpPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<OprpFormValues>({
    resolver: zodResolver(oprpSchema),
  });

  async function onSubmit(values: OprpFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
  }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Food Safety » OPRP » Registar</p>
                <h1 className="text-3xl font-semibold text-white">Registar Novo Controlo OPRP</h1>
            </div>
            <Button variant="ghost" asChild><Link href="/food-safety/oprp">Cancelar</Link></Button>
        </div>
      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Detalhes do Controlo Operacional</CardTitle>
          <CardDescription>Defina o ponto de controlo, limite crítico e método de monitorização.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="controlPoint">Ponto de Controlo</Label>
              <Input id="controlPoint" {...register("controlPoint")} />
              {errors.controlPoint && <p className="text-sm text-red-500">{errors.controlPoint.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="criticalLimit">Limite Crítico</Label>
              <Input id="criticalLimit" {...register("criticalLimit")} />
              {errors.criticalLimit && <p className="text-sm text-red-500">{errors.criticalLimit.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="monitoringMethod">Método de Monitorização</Label>
              <Textarea id="monitoringMethod" {...register("monitoringMethod")} />
              {errors.monitoringMethod && <p className="text-sm text-red-500">{errors.monitoringMethod.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="assinatura">Assinatura do Analista</Label>
              <Input id="assinatura" {...register("assinatura")} />
              {errors.assinatura && <p className="text-sm text-red-500">{errors.assinatura.message}</p>}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "A registar..." : "Registar OPRP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
