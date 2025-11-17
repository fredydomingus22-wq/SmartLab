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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  { value: "açúcares", label: "Açúcares" },
  { value: "aromas", label: "Aromas" },
  { value: "embalagens", label: "Embalagens" },
  { value: "co2", label: "CO₂" },
];

const riskLevels = [
  { value: "low", label: "Baixo" },
  { value: "medium", label: "Médio" },
  { value: "high", label: "Alto" },
];

const statusOptions = [
  { value: "approved", label: "Aprovado" },
  { value: "pending", label: "Auditoria pendente" },
  { value: "blocked", label: "Bloqueado" },
];

const supplierSchema = z.object({
  nome: z.string().min(3, "Informe o nome do fornecedor"),
  categoria: z.string().min(1, "Selecione a categoria"),
  risco: z.string().min(1, "Selecione o nível de risco"),
  status: z.string().min(1, "Selecione o status"),
  contato: z.string().email("Informe um contacto válido"),
  observacoes: z.string().max(600, "Máximo 600 caracteres").optional().or(z.literal("")),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function CreateSupplierPage() {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      risco: "medium",
      status: "pending",
      contato: "",
      observacoes: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = form;

  const [nome, categoria, risco, status] = watch([
    "nome",
    "categoria",
    "risco",
    "status",
  ]);

  const readiness = useMemo(
    () => [
      {
        label: "Identidade",
        detail: nome ? nome : "Defina o nome legal",
        variant: nome ? "success" : "warning",
      },
      {
        label: "Categoria",
        detail: categoria ? categoria : "Selecione categoria",
        variant: categoria ? "success" : "warning",
      },
      {
        label: "Status",
        detail: status ? status : "Defina status",
        variant: status ? "success" : "warning",
      },
    ],
    [categoria, nome, status]
  );

  async function onSubmit(values: SupplierFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fornecedores · Criação</p>
          <h1 className="text-3xl font-semibold text-white">Novo fornecedor estratégico</h1>
          <p className="text-slate-400">
            Cadastre parceiros com contexto de categoria, risco e contacto principal.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/suppliers">Voltar</Link>
          </Button>
          <Button variant="secondary" type="button" onClick={() => reset()}>
            Resetar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Ficha do fornecedor</CardTitle>
            <CardDescription>Informações críticas para homologação</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" placeholder="Ex.: Sweet Harvest" {...register("nome")} />
                  {errors.nome && <p className="text-sm text-red-400">{errors.nome.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select id="categoria" {...register("categoria")}>
                    <option value="">Selecione</option>
                    {categories.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.categoria && (
                    <p className="text-sm text-red-400">{errors.categoria.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risco">Risco</Label>
                  <Select id="risco" {...register("risco")}>
                    {riskLevels.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.risco && <p className="text-sm text-red-400">{errors.risco.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" {...register("status")}>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.status && <p className="text-sm text-red-400">{errors.status.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="contato">Contacto</Label>
                  <Input id="contato" placeholder="qualidade@empresa.com" {...register("contato")} />
                  {errors.contato && (
                    <p className="text-sm text-red-400">{errors.contato.message}</p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    rows={4}
                    placeholder="Requisitos adicionais, notas de auditoria ou COAs."
                    {...register("observacoes")}
                  />
                  {errors.observacoes && (
                    <p className="text-sm text-red-400">{errors.observacoes.message}</p>
                  )}
                </div>
              </div>

              <CardFooter className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-800/70 bg-slate-950/50 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-300">Resumo</p>
                  <p className="text-xs text-slate-500">
                    {nome || "Fornecedor indefinido"} · Risco {risco || "-"} · {status || "sem status"}
                  </p>
                </div>
                <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[200px]">
                  {isSubmitting ? "Gravando..." : "Registrar fornecedor"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Checklist</CardTitle>
            <CardDescription>Indicadores ao preencher o formulário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {readiness.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-slate-900/70 bg-slate-950/50 p-4"
              >
                <div>
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="text-base text-white">{item.detail}</p>
                </div>
                <Badge variant={item.variant as "success" | "warning"}>
                  {item.variant === "success" ? "ok" : "pendente"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
