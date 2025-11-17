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
];

const tankOptions = [
  { value: "TK-04", label: "TK-04" },
  { value: "TK-07", label: "TK-07" },
];

const intermediateLotSchema = z.object({
  codigo: z.string().min(4, "O código é obrigatório."),
  lotePai: z.string().min(1, "O lote pai é obrigatório."),
  tanque: z.string().min(1, "O tanque é obrigatório."),
  brix: z.coerce.number(),
  ph: z.coerce.number(),
  acidez: z.coerce.number(),
  dataPreparacao: z.string().min(1, "A data é obrigatória."),
  assinatura: z.string().min(3, "A assinatura é obrigatória."),
});

type IntermediateLotFormValues = z.infer<typeof intermediateLotSchema>;

export default function CreateIntermediateLotPage() {
  const form = useForm<IntermediateLotFormValues>({
    resolver: zodResolver(intermediateLotSchema),
    defaultValues: {
      codigo: "IL-2024-09-044",
      lotePai: "PL-2024-09-021",
      tanque: "TK-07",
      brix: 63.5,
      ph: 3.12,
      acidez: 0.28,
      dataPreparacao: new Date().toISOString().slice(0, 16),
      assinatura: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = form;

  const [brixValue, phValue, acidezValue] = watch(["brix", "ph", "acidez"]);

  const specHighlights = useMemo(() => {
    const resolveStatus = (value: number | undefined, min: number, max: number): "success" | "warning" | "neutral" => {
      if (value === undefined || !Number.isFinite(value)) return "neutral";
      return value >= min && value <= max ? "success" : "warning";
    };

    return [
      { label: "Brix (°Bx)", value: brixValue, status: resolveStatus(brixValue, 62.5, 64.5) },
      { label: "pH", value: phValue, status: resolveStatus(phValue, 3.05, 3.25) },
      { label: "Acidez (%)", value: acidezValue, status: resolveStatus(acidezValue, 0.22, 0.32) },
    ];
  }, [acidezValue, brixValue, phValue]);

  async function onSubmit(values: IntermediateLotFormValues) {
    await Promise.resolve(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produtos Intermédios » Registar</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Registar Produto Intermédio</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild><Link href="/intermediate-lots">Cancelar</Link></Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "A registar..." : "Registar Produto Intermédio"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-slate-900 bg-slate-950/70">
            <CardHeader>
              <CardTitle>Formulário de Registo</CardTitle>
              <CardDescription>Dados de composição do xarope e rastreabilidade.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2"><Label>Código do Lote Intermédio</Label><Input {...register("codigo")} /></div>
              <div className="space-y-2"><Label>Lote de Produção (Pai)</Label><Select {...register("lotePai")}><option value="">Selecione...</option>{parentLotOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></div>
              <div className="space-y-2"><Label>Tanque de Xarope</Label><Select {...register("tanque")}><option value="">Selecione...</option>{tankOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></div>
              <div className="space-y-2"><Label>Data e Hora da Preparação</Label><Input type="datetime-local" {...register("dataPreparacao")} /></div>
              <div className="space-y-2"><Label>Brix (°Bx)</Label><Input type="number" step="0.1" {...register("brix")} /></div>
              <div className="space-y-2"><Label>pH</Label><Input type="number" step="0.01" {...register("ph")} /></div>
              <div className="space-y-2"><Label>Acidez (%)</Label><Input type="number" step="0.01" {...register("acidez")} /></div>
              <div className="space-y-2"><Label>Assinatura do Analista</Label><Input {...register("assinatura")} /></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <CardHeader>
              <CardTitle>Parâmetros de Controlo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {specHighlights.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/50 p-3">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{item.value ?? "—"}</span>
                    <Badge variant={item.status}>{item.status === "success" ? "OK" : item.value === undefined ? "Pendente" : "Ajustar"}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
