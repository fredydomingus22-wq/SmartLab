"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@/lib/zod-resolver";
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

const calibrationSchema = z.object({
  calibrationDate: z.string().min(1, "A data da calibração é obrigatória."),
  result: z.enum(["aprovado", "reprovado"]),
  nextCalibrationDate: z.string().min(1, "A data da próxima calibração é obrigatória."),
  analystSignature: z.string().min(3, "A assinatura do analista é obrigatória."),
});

type CalibrationFormValues = z.infer<typeof calibrationSchema>;

export default function CreateCalibrationPage({ params }: { params: { id: string } }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CalibrationFormValues>({
    resolver: zodResolver(calibrationSchema),
    defaultValues: {
      result: "aprovado",
    }
  });

  async function onSubmit(values: CalibrationFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log({ equipmentId: params.id, ...values });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Equipamentos » {params.id} » Calibração</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Registar Nova Calibração</h1>
          <p className="text-slate-400">Registe o resultado e a próxima data de calibração para o equipamento {params.id}.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/equipments">Cancelar</Link>
        </Button>
      </div>
      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Detalhes da Calibração</CardTitle>
          <CardDescription>Preencha os dados do certificado de calibração.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="calibrationDate">Data da Calibração</Label>
                <Input id="calibrationDate" type="date" {...register("calibrationDate")} />
                {errors.calibrationDate && <p className="text-sm text-red-500">{errors.calibrationDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextCalibrationDate">Data da Próxima Calibração</Label>
                <Input id="nextCalibrationDate" type="date" {...register("nextCalibrationDate")} />
                {errors.nextCalibrationDate && <p className="text-sm text-red-500">{errors.nextCalibrationDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="result">Resultado</Label>
                <Select id="result" {...register("result")}>
                  <option value="aprovado">Aprovado</option>
                  <option value="reprovado">Reprovado</option>
                </Select>
                {errors.result && <p className="text-sm text-red-500">{errors.result.message}</p>}
              </div>
               <div className="space-y-2 md:col-span-2">
                <Label htmlFor="analystSignature">Assinatura do Analista</Label>
                <Input id="analystSignature" {...register("analystSignature")} />
                {errors.analystSignature && <p className="text-sm text-red-500">{errors.analystSignature.message}</p>}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "A registar..." : "Registar Calibração"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
