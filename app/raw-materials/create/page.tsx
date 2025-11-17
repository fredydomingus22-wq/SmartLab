"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@/lib/zod-resolver";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  nome: z.string().min(3, "Informe o nome do material."),
  categoria: z.string().min(1, "Selecione a categoria."),
  unidade: z.string().min(1, "Informe a unidade."),
  risco: z.enum(["low", "medium", "high"], { required_error: "Selecione o risco." }),
  especificacao: z.string().min(3, "Descreva a especificação."),
  coa: z.any().optional(),
});

type RawMaterialFormValues = z.infer<typeof schema>;

export default function CreateRawMaterialPage() {
  const form = useForm<RawMaterialFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      categoria: "",
      unidade: "kg",
      risco: "medium",
      especificacao: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = form;

  const risco = watch("risco");

  const riskMeta = useMemo(
    () => ({
      low: { label: "Baixo", helper: "Rotina normal" },
      medium: { label: "Médio", helper: "Monitorar supplier" },
      high: { label: "Alto", helper: "Plano de mitigação" },
    }),
    []
  );

  async function onSubmit(values: RawMaterialFormValues) {
    await Promise.resolve(values);
    reset();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Matéria-prima</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Cadastrar material</h1>
          <p className="text-slate-400">Registre specs, risco e documentação para novos ingredientes.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/raw-materials">Voltar</Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Ficha técnica</CardTitle>
            <CardDescription>Todos os campos são obrigatórios para homologação.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" placeholder="Açúcar VHP" {...register("nome")} />
                {errors.nome && <p className="text-sm text-red-400">{errors.nome.message}</p>}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select id="categoria" {...register("categoria")}>
                    <option value="">Selecione</option>
                    <option value="Base">Base</option>
                    <option value="Flavor">Flavor</option>
                    <option value="Utility">Utility</option>
                  </Select>
                  {errors.categoria && (
                    <p className="text-sm text-red-400">{errors.categoria.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Input id="unidade" placeholder="kg" {...register("unidade")} />
                  {errors.unidade && <p className="text-sm text-red-400">{errors.unidade.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risco">Risco</Label>
                <Select id="risco" {...register("risco")}>
                  <option value="low">Baixo</option>
                  <option value="medium">Médio</option>
                  <option value="high">Alto</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="especificacao">Especificação</Label>
                <Textarea
                  id="especificacao"
                  rows={4}
                  placeholder="Ex.: Polarização ≥ 99.7, cor ICUMSA ≤ 200"
                  {...register("especificacao")}
                />
                {errors.especificacao && (
                  <p className="text-sm text-red-400">{errors.especificacao.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="coa">Upload do COA</Label>
                <Input id="coa" type="file" accept="application/pdf,image/*" {...register("coa")} />
                <p className="text-xs text-slate-500">Opcional — anexe o certificado do fornecedor.</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => reset()}>
                  Limpar
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar material"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/60">
          <CardHeader>
            <CardTitle>Resumo de risco</CardTitle>
            <CardDescription>Avaliação automática do formulário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Classificação</p>
                  <p className="text-xl text-white">{riskMeta[risco].label}</p>
                </div>
                <Badge variant={risco === "high" ? "danger" : risco === "medium" ? "warning" : "success"}>
                  {riskMeta[risco].label}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">{riskMeta[risco].helper}</p>
            </div>
            <div className="rounded-2xl border border-slate-900/70 bg-slate-950/60 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Checklist</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Validar fornecedor aprovado</li>
                <li>• Confirmar parâmetros críticos na especificação</li>
                <li>• Anexar COA mais recente</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
