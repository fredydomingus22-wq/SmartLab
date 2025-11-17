"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@/lib/zod-resolver";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const parentLotOptions = [
  { value: "PL-2024-09-018", label: "PL-2024-09-018 · Cola Zero" },
  { value: "PL-2024-09-021", label: "PL-2024-09-021 · Guaraná" },
  { value: "PL-2024-09-023", label: "PL-2024-09-023 · Chá Pêssego" },
  { value: "PL-2024-09-024", label: "PL-2024-09-024 · Água com gás" },
];

const tankOptions = [
  { value: "TK-04", label: "TK-04" },
  { value: "TK-07", label: "TK-07" },
  { value: "TK-11", label: "TK-11" },
  { value: "TK-15", label: "TK-15" },
];

const intermediateLotSchema = z.object({
  codigo: z.string().min(4, "O código do lote intermédio é obrigatório."),
  lotePai: z.string().min(1, "É obrigatório selecionar o lote de produção (lote pai)."),
  tanque: z.string().min(1, "É obrigatório informar o tanque de xarope."),
  brix: z.string().min(1, "O valor de Brix é obrigatório."),
  ph: z.string().min(1, "O valor de pH é obrigatório."),
  acidez: z.string().min(1, "O valor da acidez é obrigatório."),
  dataPreparacao: z.string().min(1, "A data de preparação é obrigatória."),
});

type IntermediateLotFormValues = z.infer<typeof intermediateLotSchema>;

export default function CreateIntermediateLotPage() {
  const form = useForm<IntermediateLotFormValues>({
    resolver: zodResolver(intermediateLotSchema),
    defaultValues: {
      codigo: "IL-2024-09-044",
      lotePai: "",
      tanque: "TK-07",
      brix: "63.5",
      ph: "3.12",
      acidez: "0.28",
      dataPreparacao: "2024-09-15T09:30",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = form;

  const [codigoValue, lotePaiValue, tanqueValue, brixValue, phValue, acidezValue, dataValue] =
    watch(["codigo", "lotePai", "tanque", "brix", "ph", "acidez", "dataPreparacao"]);

  const specHighlights = useMemo(() => {
    const safeNumber = (value?: string) => {
      const parsed = value ? Number(value.replace(",", ".")) : undefined;
      return Number.isFinite(parsed) ? parsed : undefined;
    };

    const brixNumber = safeNumber(brixValue);
    const phNumber = safeNumber(phValue);
    const acidezNumber = safeNumber(acidezValue);

    const resolveStatus = (
      value: number | undefined,
      min: number,
      max: number
    ): "success" | "warning" | "neutral" => {
      if (value === undefined) {
        return "neutral";
      }
      return value >= min && value <= max ? "success" : "warning";
    };

    return [
      {
        label: "Brix (°Bx)",
        value: brixValue || "—",
        status: resolveStatus(brixNumber, 62.5, 64.5),
        helper: "Especificação: 63 ±0.5 °Bx",
      },
      {
        label: "pH",
        value: phValue || "—",
        status: resolveStatus(phNumber, 3.05, 3.25),
        helper: "Especificação: 3.15 ±0.1",
      },
      {
        label: "Acidez (%)",
        value: acidezValue ? `${acidezValue}%` : "—",
        status: resolveStatus(acidezNumber, 0.22, 0.32),
        helper: "Especificação: 0.27 ±0.05%",
      },
    ];
  }, [acidezValue, brixValue, phValue]);

  async function onSubmit(values: IntermediateLotFormValues) {
    await Promise.resolve(values);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produtos Intermédios » Registar</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Registar Produto Intermédio</h1>
          <p className="text-slate-400">
            Registe os parâmetros de preparação do xarope, associando-o a um Lote de Produção.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/intermediate-lots">Cancelar</Link>
          </Button>
          <Button variant="secondary" type="button" onClick={() => reset()}>
            Limpar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[3fr,2fr]">
          <Card className="border-slate-900 bg-slate-950/70">
            <CardHeader>
              <CardTitle>Formulário de Registo</CardTitle>
              <CardDescription>Preencha os dados de composição do xarope.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="codigo">Código do Lote Intermédio</Label>
                  <Input id="codigo" placeholder="IL-2024-09-044" {...register("codigo")} />
                  {errors.codigo && <p className="text-sm text-red-400">{errors.codigo.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lotePai">Lote de Produção (Pai)</Label>
                  <Select id="lotePai" {...register("lotePai")}>
                    <option value="">Selecione o lote de produção</option>
                    {parentLotOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.lotePai && <p className="text-sm text-red-400">{errors.lotePai.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanque">Tanque de Xarope</Label>
                  <Select id="tanque" {...register("tanque")}>
                    <option value="">Selecione o tanque</option>
                    {tankOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  {errors.tanque && <p className="text-sm text-red-400">{errors.tanque.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brix">Brix (°Bx)</Label>
                  <Input id="brix" type="number" step="0.1" placeholder="63.5" {...register("brix")} />
                  {errors.brix && <p className="text-sm text-red-400">{errors.brix.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">pH</Label>
                  <Input id="ph" type="number" step="0.01" placeholder="3.12" {...register("ph")} />
                  {errors.ph && <p className="text-sm text-red-400">{errors.ph.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="acidez">Acidez (%)</Label>
                  <Input id="acidez" type="number" step="0.01" placeholder="0.28" {...register("acidez")} />
                  {errors.acidez && <p className="text-sm text-red-400">{errors.acidez.message}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dataPreparacao">Data e Hora da Preparação</Label>
                  <Input
                    id="dataPreparacao"
                    type="datetime-local"
                    {...register("dataPreparacao")}
                  />
                  {errors.dataPreparacao && (
                    <p className="text-sm text-red-400">{errors.dataPreparacao.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-slate-900/80 bg-slate-950/40 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-300">Estado</p>
                <p className="text-xs text-slate-500">
                  {lotePaiValue ? `Lote Pai ${lotePaiValue} em ${tanqueValue || "tanque indefinido"}` : "Selecione um lote pai para continuar."}
                </p>
              </div>
              <Button type="submit" variant="primary" className="min-w-[200px]" disabled={isSubmitting}>
                {isSubmitting ? "A registar..." : "Registar Produto Intermédio"}
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="border-slate-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
              <CardHeader>
                <CardTitle>Parâmetros de Controlo</CardTitle>
                <CardDescription>Validação em tempo real com as especificações.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {specHighlights.map((item) => (
                  <div key={item.label} className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{item.label}</p>
                        <p className="text-2xl font-semibold text-white">{item.value}</p>
                      </div>
                      <Badge variant={item.status}>{item.status === "success" ? "OK" : item.value === "—" ? "Pendente" : "Ajustar"}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">{item.helper}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-900/70 bg-slate-950/60">
              <CardHeader>
                <CardTitle>Checklist de Registo</CardTitle>
                <CardDescription>Confirme a associação com o lote pai.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[{ label: "Código do Lote Intermédio", value: codigoValue || "Defina o código" }, { label: "Lote de Produção (Pai)", value: lotePaiValue || "Selecione o lote pai" }, { label: "Data de Preparação", value: dataValue ? new Date(dataValue).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "Defina a data" }].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-sm text-slate-400">{item.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
