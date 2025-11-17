"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const stepStatus = z.enum(["pendente", "em_progresso", "concluido"]);
type StepStatus = z.infer<typeof stepStatus>;

const eightDSchema = z.object({
  d1_team: z.string().min(1, "Campo obrigatório"),
  d1_status: stepStatus,
  d2_problem: z.string().min(1, "Campo obrigatório"),
  d2_status: stepStatus,
  d3_containment: z.string().min(1, "Campo obrigatório"),
  d3_status: stepStatus,
  d4_root_cause: z.string().min(1, "Campo obrigatório"),
  d4_status: stepStatus,
  d5_corrective_actions: z.string().min(1, "Campo obrigatório"),
  d5_status: stepStatus,
  d6_implementation: z.string().min(1, "Campo obrigatório"),
  d6_status: stepStatus,
  d7_prevention: z.string().min(1, "Campo obrigatório"),
  d7_status: stepStatus,
  d8_recognition: z.string().min(1, "Campo obrigatório"),
  d8_status: stepStatus,
  assinatura_responsavel: z.string().min(3, "Assinatura obrigatória para fechar o 8D."),
});

type EightDFormValues = z.infer<typeof eightDSchema>;

const stepsConfig = [
  { id: "d1", label: "D1", title: "Equipe", contentField: "d1_team", statusField: "d1_status" },
  { id: "d2", label: "D2", title: "Descrição do Problema", contentField: "d2_problem", statusField: "d2_status" },
  { id: "d3", label: "D3", title: "Ações de Contenção", contentField: "d3_containment", statusField: "d3_status" },
  { id: "d4", label: "D4", title: "Causa Raiz", contentField: "d4_root_cause", statusField: "d4_status" },
  { id: "d5", label: "D5", title: "Ações Corretivas", contentField: "d5_corrective_actions", statusField: "d5_status" },
  { id: "d6", label: "D6", title: "Implementação e Validação", contentField: "d6_implementation", statusField: "d6_status" },
  { id: "d7", label: "D7", title: "Prevenção", contentField: "d7_prevention", statusField: "d7_status" },
  { id: "d8", label: "D8", title: "Reconhecimento da Equipe", contentField: "d8_recognition", statusField: "d8_status" },
];

export default function EightDPage({ params }: { params: { nc_id: string } }) {
  const form = useForm<EightDFormValues>({
    resolver: zodResolver(eightDSchema),
    defaultValues: {
      d1_team: "QA Manager, Supervisor de Produção", d1_status: "concluido",
      d2_problem: "Alarme de detetor de metais na Linha PET 2.", d2_status: "em_progresso",
      d3_containment: "", d3_status: "pendente",
      d4_root_cause: "", d4_status: "pendente",
      d5_corrective_actions: "", d5_status: "pendente",
      d6_implementation: "", d6_status: "pendente",
      d7_prevention: "", d7_status: "pendente",
      d8_recognition: "", d8_status: "pendente",
      assinatura_responsavel: "",
    },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = form;
  const statusValues = watch(stepsConfig.map(s => s.statusField as any));

  async function onSubmit(values: EightDFormValues) { await Promise.resolve(values); }

  const getStatusVariant = (status: StepStatus) => ({
    pendente: "danger", em_progresso: "warning", concluido: "success"
  })[status] as "danger" | "warning" | "success";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">8D · {params.nc_id}</p>
          <h1 className="text-3xl font-semibold text-white">Plano 8D</h1>
        </div>
        <Button variant="ghost" asChild><Link href={`/nc`}>Voltar</Link></Button>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader><CardTitle>Disciplinas D1–D8</CardTitle><CardDescription>Preencha e atualize o estado de cada disciplina.</CardDescription></CardHeader>
        <CardContent>
          <Tabs defaultValue="d1" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {stepsConfig.map((step, index) => (
                <TabsTrigger key={step.id} value={step.id}>
                  {step.label} <Badge variant={getStatusVariant(statusValues[index])} className="ml-2">{statusValues[index].replace('_', ' ')}</Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {stepsConfig.map(step => (
              <TabsContent key={step.id} value={step.id} className="mt-4 space-y-4">
                <Card className="border-slate-800 bg-slate-950/50">
                    <CardHeader>
                        <CardTitle>{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Descrição / Ações</Label>
                            <Textarea {...register(step.contentField as any)} rows={6} />
                            {errors[step.contentField as keyof EightDFormValues] && <p className="text-sm text-red-500">{errors[step.contentField as keyof EightDFormValues]?.message}</p>}
                        </div>
                         <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select {...register(step.statusField as any)}>
                                <option value="pendente">Pendente</option>
                                <option value="em_progresso">Em Progresso</option>
                                <option value="concluido">Concluído</option>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
              </TabsContent>
            ))}

            <div className="mt-6 space-y-4 border-t border-slate-800 pt-6">
                <Label className="text-lg">Finalização do Relatório 8D</Label>
                <div className="space-y-2">
                    <Label htmlFor="assinatura_responsavel">Assinatura do Responsável</Label>
                    <Input id="assinatura_responsavel" {...register("assinatura_responsavel")} />
                    {errors.assinatura_responsavel && <p className="text-sm text-red-500">{errors.assinatura_responsavel.message}</p>}
                </div>
            </div>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? "A guardar..." : "Guardar Relatório 8D"}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
