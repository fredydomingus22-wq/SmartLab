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

const prpSchema = z.object({
  programName: z.string().min(3, "O nome do programa é obrigatório."),
  responsible: z.string().min(3, "O responsável é obrigatório."),
  frequency: z.string().min(3, "A frequência é obrigatória."),
  assinatura: z.string().min(3, "A assinatura do analista é obrigatória."),
});

type PrpFormValues = z.infer<typeof prpSchema>;

export default function CreatePrpPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PrpFormValues>({
    resolver: zodResolver(prpSchema),
  });

  async function onSubmit(values: PrpFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
  }

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Food Safety » PRP » Registar</p>
                <h1 className="text-3xl font-semibold text-white">Registar Novo Controlo PRP</h1>
            </div>
            <Button variant="ghost" asChild><Link href="/food-safety/prp">Cancelar</Link></Button>
        </div>
      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Detalhes do Pré-Requisito</CardTitle>
          <CardDescription>Defina o programa, responsável e frequência.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="programName">Nome do Programa</Label>
              <Input id="programName" {...register("programName")} />
              {errors.programName && <p className="text-sm text-red-500">{errors.programName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Input id="responsible" {...register("responsible")} />
              {errors.responsible && <p className="text-sm text-red-500">{errors.responsible.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequência</Label>
              <Input id="frequency" {...register("frequency")} />
              {errors.frequency && <p className="text-sm text-red-500">{errors.frequency.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="assinatura">Assinatura do Analista</Label>
              <Input id="assinatura" {...register("assinatura")} />
              {errors.assinatura && <p className="text-sm text-red-500">{errors.assinatura.message}</p>}
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "A registar..." : "Registar PRP"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
