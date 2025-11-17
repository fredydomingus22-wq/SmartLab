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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ncSchema = z.object({
  tipo: z.string().min(1, "Selecione o tipo"),
  severidade: z.string().min(1, "Selecione a severidade"),
  origem: z.string().min(1, "Informe a origem"),
  descricao: z.string().min(10, "Descreva o desvio"),
  responsavel: z.string().min(3, "Informe o responsável"),
  assinatura: z.string().min(3, "A assinatura do analista é obrigatória."),
});

type NcFormValues = z.infer<typeof ncSchema>;

export default function CreateNcPage() {
  const form = useForm<NcFormValues>({
    resolver: zodResolver(ncSchema),
    defaultValues: {
      tipo: "pcc",
      severidade: "major",
      origem: "Linha PET 2",
      descricao: "",
      responsavel: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  async function onSubmit(values: NcFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">NC · Criação</p>
          <h1 className="text-3xl font-semibold text-white">Registrar não conformidade</h1>
          <p className="text-slate-400">Descreva o desvio para disparar 8D e planos de ação.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/nc">Voltar</Link>
          </Button>
          <Button variant="secondary" type="button" onClick={() => reset()}>
            Resetar
          </Button>
        </div>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Detalhes do desvio</CardTitle>
          <CardDescription>Tipo, severidade e responsável</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select id="tipo" {...register("tipo")}>
                  <option value="">Selecione</option>
                  <option value="pcc">PCC</option>
                  <option value="lab">Laboratório</option>
                  <option value="processo">Processo</option>
                </Select>
                {errors.tipo && <p className="text-sm text-red-400">{errors.tipo.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="severidade">Severidade</Label>
                <Select id="severidade" {...register("severidade")}>
                  <option value="minor">Minor</option>
                  <option value="major">Major</option>
                  <option value="critica">Crítica</option>
                </Select>
                {errors.severidade && <p className="text-sm text-red-400">{errors.severidade.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="origem">Origem</Label>
                <Input id="origem" placeholder="Linha/Equipamento" {...register("origem")} />
                {errors.origem && <p className="text-sm text-red-400">{errors.origem.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" rows={4} placeholder="Detalhe o desvio" {...register("descricao")} />
                {errors.descricao && <p className="text-sm text-red-400">{errors.descricao.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input id="responsavel" placeholder="Nome do responsável" {...register("responsavel")} />
                {errors.responsavel && <p className="text-sm text-red-400">{errors.responsavel.message}</p>}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="assinatura">Assinatura do Analista</Label>
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

            <CardFooter className="flex flex-col gap-4 rounded-2xl border-t border-slate-900 bg-slate-950/50 p-6 md:flex-row md:items-center md:justify-end">
              <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? "Registrando..." : "Abrir NC"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
