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

const auditSchema = z.object({
  tipo: z.string().min(1, "O tipo de auditoria é obrigatório."),
  norma: z.string().min(3, "A norma de referência é obrigatória."),
  auditor: z.string().min(3, "O nome do auditor é obrigatório."),
  assinatura: z.string().min(3, "A assinatura do analista é obrigatória."),
});

type AuditFormValues = z.infer<typeof auditSchema>;

export default function CreateAuditPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuditFormValues>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      tipo: "interna",
      norma: "",
      auditor: "",
      assinatura: "",
    },
  });

  async function onSubmit(values: AuditFormValues) {
    // Placeholder for submission logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Auditorias » Agendar</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Agendar Nova Auditoria</h1>
          <p className="text-slate-400">Defina o âmbito, a norma de referência e atribua um auditor responsável.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/audits">Cancelar</Link>
        </Button>
      </div>
      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Detalhes da Auditoria</CardTitle>
          <CardDescription>Preencha os campos para oficializar o agendamento da auditoria.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Auditoria</Label>
                <Select id="tipo" {...register("tipo")}>
                  <option value="interna">Interna</option>
                  <option value="externa">Externa (Fornecedor)</option>
                  <option value="cliente">Cliente</option>
                  <option value="certificacao">Certificação</option>
                </Select>
                {errors.tipo && <p className="text-sm text-red-400">{errors.tipo.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="norma">Norma de Referência</Label>
                <Input id="norma" placeholder="Ex: FSSC 22000, ISO 9001" {...register("norma")} />
                {errors.norma && <p className="text-sm text-red-400">{errors.norma.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="auditor">Auditor Responsável</Label>
                <Input id="auditor" placeholder="Nome do auditor líder" {...register("auditor")} />
                {errors.auditor && <p className="text-sm text-red-400">{errors.auditor.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="assinatura">Assinatura do Agendador</Label>
                <Input
                  id="assinatura"
                  placeholder="Introduza a sua assinatura digital"
                  {...register("assinatura")}
                />
                {errors.assinatura && (
                  <p className="text-sm text-red-400">{errors.assinatura.message}</p>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? "A agendar..." : "Agendar Auditoria"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
