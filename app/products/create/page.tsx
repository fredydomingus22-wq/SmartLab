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

const categoryOptions = [
  { value: "produto-final", label: "Produto final" },
  { value: "intermediario", label: "Intermediário" },
  { value: "matriz", label: "Matriz base" },
];

const packageOptions = [
  { value: "lata-350", label: "Lata 350ml" },
  { value: "pet-1l", label: "PET 1L" },
  { value: "vidro-600", label: "Vidro 600ml" },
  { value: "tanque", label: "Tanque processo" },
];

const productSchema = z.object({
  nome: z.string().min(3, "Informe o nome"),
  categoria: z.string().min(1, "Selecione a categoria"),
  sku: z.string().min(3, "Informe o SKU"),
  embalagem: z.string().min(1, "Selecione a embalagem"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: "",
      categoria: "",
      sku: "",
      embalagem: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = form;

  const [nome, categoria, embalagem] = watch(["nome", "categoria", "embalagem"]);

  const readiness = useMemo(
    () => [
      {
        label: "Nome",
        detail: nome || "Defina o nome",
        variant: nome ? "success" : "warning",
      },
      {
        label: "Categoria",
        detail: categoria || "Selecione categoria",
        variant: categoria ? "success" : "warning",
      },
      {
        label: "Embalagem",
        detail: embalagem || "Selecione embalagem",
        variant: embalagem ? "success" : "warning",
      },
    ],
    [categoria, embalagem, nome]
  );

  async function onSubmit(values: ProductFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produtos · Criação</p>
          <h1 className="text-3xl font-semibold text-white">Cadastrar produto</h1>
          <p className="text-slate-400">Informe SKU, categoria e embalagem para sincronizar especificações.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/products">Voltar</Link>
          </Button>
          <Button variant="secondary" type="button" onClick={() => reset()}>
            Resetar
          </Button>
        </div>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Dados principais</CardTitle>
          <CardDescription>SKU, categoria e embalagem</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" placeholder="Ex.: Cola Zero 350ml" {...register("nome")} />
                {errors.nome && <p className="text-sm text-red-400">{errors.nome.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select id="categoria" {...register("categoria")}>
                  <option value="">Selecione</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.categoria && <p className="text-sm text-red-400">{errors.categoria.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" placeholder="CZ-350" {...register("sku")} />
                {errors.sku && <p className="text-sm text-red-400">{errors.sku.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="embalagem">Embalagem</Label>
                <Select id="embalagem" {...register("embalagem")}>
                  <option value="">Selecione</option>
                  {packageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {errors.embalagem && <p className="text-sm text-red-400">{errors.embalagem.message}</p>}
              </div>
            </div>

            <CardFooter className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-800/70 bg-slate-950/50 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-300">Resumo</p>
                <p className="text-xs text-slate-500">{nome || "Produto indefinido"}</p>
                <p className="text-xs text-slate-500">{categoria || "Sem categoria"} · {embalagem || "Sem embalagem"}</p>
              </div>
              <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[200px]">
                {isSubmitting ? "Gravando..." : "Salvar produto"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Checklist</CardTitle>
          <CardDescription>Atualiza conforme os campos são preenchidos</CardDescription>
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
  );
}
