"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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

const tipoOptions = [
  { value: "RM", label: "Matéria-prima (RM)" },
  { value: "PI", label: "Processo intermédio (PI)" },
  { value: "PF", label: "Produto final (PF)" },
];

const analystOptions = [
  { value: "analista-01", label: "L. Pereira" },
  { value: "analista-02", label: "F. Santos" },
  { value: "analista-03", label: "C. Braga" },
  { value: "analista-04", label: "M. Costa" },
];

const parameterSchema = z.object({
  nome: z.string().min(1, "Informe o parâmetro."),
  resultado: z.string().min(1, "Informe o resultado."),
  especificacao: z
    .string()
    .max(200, "Máx. 200 caracteres")
    .optional()
    .or(z.literal("")),
});

const createLabTestSchema = z.object({
  tipo: z.string().min(1, "Selecione o tipo."),
  amostra: z.string().min(3, "Informe a amostra."),
  analista: z.string().min(1, "Selecione o analista."),
  data: z.string().min(1, "Defina a data."),
  parametros: z.array(parameterSchema).min(1, "Adicione pelo menos um parâmetro."),
});

type CreateLabTestValues = z.infer<typeof createLabTestSchema>;

const defaultDate = new Date().toISOString().slice(0, 16);

export default function CreateLabTestPage() {
  const form = useForm<CreateLabTestValues>({
    resolver: zodResolver(createLabTestSchema),
    defaultValues: {
      tipo: "",
      amostra: "",
      analista: "",
      data: defaultDate,
      parametros: [
        {
          nome: "Brix",
          resultado: "",
          especificacao: "11.0 ±0.2",
        },
      ],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "parametros",
  });

  const tipoValue = watch("tipo");
  const analistaValue = watch("analista");
  const parametrosWatch = watch("parametros");
  const dataValue = watch("data");

  const tipoLabel = tipoOptions.find((item) => item.value === tipoValue)?.label;
  const analistaLabel = analystOptions.find((item) => item.value === analistaValue)?.label;

  const parameterStats = useMemo(() => {
    const entries = parametrosWatch ?? [];
    const filled = entries.filter((entry) => entry.nome && entry.resultado).length;
    const specs = entries.filter((entry) => entry.especificacao).length;
    return {
      total: entries.length,
      filled,
      specs,
    };
  }, [parametrosWatch]);

  const readinessTiles = useMemo(
    () => [
      {
        title: "Tipo analítico",
        detail: tipoLabel ?? "Selecione RM, PI ou PF",
        variant: tipoLabel ? "success" : "warning",
      },
      {
        title: "Analista designado",
        detail: analistaLabel ?? "Escolha um responsável",
        variant: analistaLabel ? "success" : "warning",
      },
      {
        title: "Parâmetros",
        detail:
          parameterStats.total > 0
            ? `${parameterStats.total} parâmetro(s), ${parameterStats.filled} preenchido(s)`
            : "Adicione parâmetros",
        variant: parameterStats.filled > 0 ? "success" : "warning",
      },
    ],
    [analistaLabel, parameterStats.filled, parameterStats.total, tipoLabel]
  );

  async function onSubmit(values: CreateLabTestValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Laboratório » Criação</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Novo ensaio laboratorial</h1>
          <p className="text-slate-400">
            Registre testes críticos de RM, processo intermédio ou produto final com parâmetros detalhados.
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/lab-tests">Voltar</Link>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Ficha analítica</CardTitle>
            <CardDescription>Informações essenciais para rastrear esta análise.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select id="tipo" {...register("tipo")}>
                    <option value="">Selecione</option>
                    {tipoOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.tipo && <p className="text-sm text-red-400">{errors.tipo.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amostra">Amostra</Label>
                  <Input
                    id="amostra"
                    placeholder="Ex.: PF-240915-07"
                    {...register("amostra")}
                  />
                  {errors.amostra && (
                    <p className="text-sm text-red-400">{errors.amostra.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="analista">Analista</Label>
                  <Select id="analista" {...register("analista")}>
                    <option value="">Selecione</option>
                    {analystOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.analista && (
                    <p className="text-sm text-red-400">{errors.analista.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input id="data" type="datetime-local" {...register("data")} />
                  {errors.data && <p className="text-sm text-red-400">{errors.data.message}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Parâmetros monitorados</p>
                    <p className="text-sm text-slate-400">Adicione os pontos críticos que foram avaliados.</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        nome: "",
                        resultado: "",
                        especificacao: "",
                      })
                    }
                  >
                    Adicionar parâmetro
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-2xl border border-slate-900 bg-slate-950/60 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">Parâmetro #{index + 1}</p>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`parametro-nome-${field.id}`}>Nome</Label>
                          <Input
                            id={`parametro-nome-${field.id}`}
                            placeholder="Brix"
                            {...register(`parametros.${index}.nome` as const)}
                          />
                          {errors.parametros?.[index]?.nome && (
                            <p className="text-sm text-red-400">
                              {errors.parametros?.[index]?.nome?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`parametro-resultado-${field.id}`}>Resultado</Label>
                          <Input
                            id={`parametro-resultado-${field.id}`}
                            placeholder="11.0 °Bx"
                            {...register(`parametros.${index}.resultado` as const)}
                          />
                          {errors.parametros?.[index]?.resultado && (
                            <p className="text-sm text-red-400">
                              {errors.parametros?.[index]?.resultado?.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`parametro-especificacao-${field.id}`}>
                            Especificação
                          </Label>
                          <Input
                            id={`parametro-especificacao-${field.id}`}
                            placeholder="Target / limite"
                            {...register(`parametros.${index}.especificacao` as const)}
                          />
                          {errors.parametros?.[index]?.especificacao && (
                            <p className="text-sm text-red-400">
                              {errors.parametros?.[index]?.especificacao?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.parametros && typeof errors.parametros.message === "string" && (
                  <p className="text-sm text-red-400">{errors.parametros.message}</p>
                )}
              </div>

              <CardFooter className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-800/80 bg-slate-950/60 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-300">Resumo</p>
                  <p className="text-xs text-slate-500">
                    {tipoLabel ? `${tipoLabel}` : "Defina o tipo"} • {parameterStats.total} parâmetro(s)
                  </p>
                </div>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Registrando..." : "Registrar análise"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <CardHeader>
              <CardTitle>Checklist de prontidão</CardTitle>
              <CardDescription>Atualiza conforme você preenche o formulário.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {readinessTiles.map((tile) => (
                <div
                  key={tile.title}
                  className="rounded-xl border border-slate-900/80 bg-slate-950/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">{tile.title}</p>
                      <p className="text-base text-white">{tile.detail}</p>
                    </div>
                    <Badge variant={tile.variant === "success" ? "success" : "warning"}>
                      {tile.variant === "success" ? "ok" : "pendente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-900 bg-slate-950/70">
            <CardHeader>
              <CardTitle>Insights rápidos</CardTitle>
              <CardDescription>Cubra specs e responsabilização.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-300">
              <div className="rounded-xl border border-slate-900/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Parâmetros</p>
                <p className="mt-2 text-2xl font-semibold text-white">{parameterStats.total}</p>
                <p className="text-xs text-slate-500">Total configurado(s)</p>
              </div>
              <div className="rounded-xl border border-slate-900/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Com resultado</p>
                <p className="mt-2 text-2xl font-semibold text-white">{parameterStats.filled}</p>
                <p className="text-xs text-slate-500">Itens com valor registrado</p>
              </div>
              <div className="rounded-xl border border-slate-900/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Com especificação</p>
                <p className="mt-2 text-2xl font-semibold text-white">{parameterStats.specs}</p>
                <p className="text-xs text-slate-500">Itens com faixa alvo ou limite</p>
              </div>
              <div className="rounded-xl border border-slate-900/80 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Agenda</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {dataValue
                    ? new Date(dataValue).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : "Defina a data"}
                </p>
                <p className="text-xs text-slate-500">Momento programado da coleta</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
