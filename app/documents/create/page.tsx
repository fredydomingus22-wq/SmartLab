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

const schema = z.object({
  nome: z.string().min(3, "Informe o nome."),
  tipo: z.string().min(1, "Selecione o tipo."),
  categoria: z.string().min(1, "Informe a categoria."),
  upload: z.any().optional(),
  observacoes: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof schema>;

export default function CreateDocumentPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nome: "",
      tipo: "procedimento",
      categoria: "Food Safety",
      observacoes: "",
    },
  });

  async function onSubmit(values: DocumentFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Documentação</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Upload de Documento</h1>
          <p className="text-slate-400">Controle novas versões de procedimentos, formulários e políticas.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/documents">Voltar</Link>
        </Button>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Metadados</CardTitle>
          <CardDescription>Preencha antes de enviar o arquivo.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" placeholder="Procedimento PCC Carbonatação" {...register("nome")} />
              {errors.nome && <p className="text-sm text-red-400">{errors.nome.message}</p>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select id="tipo" {...register("tipo")}>
                  <option value="procedimento">Procedimento</option>
                  <option value="instrucao">Instrução de Trabalho</option>
                  <option value="formulario">Formulário</option>
                  <option value="politica">Política</option>
                </Select>
                {errors.tipo && <p className="text-sm text-red-400">{errors.tipo.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" placeholder="Food Safety" {...register("categoria")} />
                {errors.categoria && (
                  <p className="text-sm text-red-400">{errors.categoria.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="upload">Upload do arquivo</Label>
              <Input id="upload" type="file" accept="application/pdf" {...register("upload")} />
              <p className="text-xs text-slate-500">PDF até 10MB. Upload demonstrativo.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" rows={4} {...register("observacoes")} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t border-slate-900/80 bg-slate-950/50">
            <Button type="button" variant="secondary" asChild>
              <Link href="/documents">Cancelar</Link>
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
