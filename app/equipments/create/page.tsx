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

const equipmentSchema = z.object({
  code: z.string().min(3, "O código do equipamento é obrigatório."),
  name: z.string().min(3, "O nome do equipamento é obrigatório."),
  department: z.string().min(1, "O departamento é obrigatório."),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
});

type EquipmentFormValues = z.infer<typeof equipmentSchema>;

export default function CreateEquipmentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
  });

  async function onSubmit(values: EquipmentFormValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Equipamentos » Registar</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Registar Novo Equipamento</h1>
          <p className="text-slate-400">Preencha os dados para incluir um novo equipamento no sistema.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/equipments">Cancelar</Link>
        </Button>
      </div>
      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Detalhes do Equipamento</CardTitle>
          <CardDescription>Informações de identificação e rastreabilidade.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="code">Código do Equipamento</Label>
                <Input id="code" {...register("code")} />
                {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Equipamento</Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select id="department" {...register("department")}>
                  <option value="">Selecione...</option>
                  <option value="laboratorio">Laboratório</option>
                  <option value="producao">Produção</option>
                  <option value="manutencao">Manutenção</option>
                  <option value="utilidades">Utilidades</option>
                </Select>
                {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" {...register("model")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Número de Série</Label>
                <Input id="serialNumber" {...register("serialNumber")} />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "A registar..." : "Registar Equipamento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
