"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@/lib/zod-resolver";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const productionLots = [
    { value: "PL-240915-A", label: "PL-240915-A (Guaraná)" },
    { value: "PL-240915-B", label: "PL-240915-B (Cola Zero)" },
    { value: "PL-240916-C", label: "PL-240916-C (Chá e Tangerina)" },
    { value: "PL-240917-D", label: "PL-240917-D (Sem intermédios)" },
];

const intermediateLotMap = {
    "PL-240915-A": [{ value: "IL-240915-11", label: "IL-240915-11 · Guaraná Tradicional" }],
    "PL-240915-B": [{ value: "IL-240915-07", label: "IL-240915-07 · Cola Zero" }],
    "PL-240916-C": [
        { value: "IL-240916-03", label: "IL-240916-03 · Chá Pêssego" },
        { value: "IL-240916-05", label: "IL-240916-05 · Tangerina Light" },
    ],
    "PL-240917-D": [],
};

const lineOptions = [{ value: "linha-pet-2", label: "Linha PET 2" }, { value: "linha-lata-1", label: "Linha Lata 1" }];

const productSpecs = {
  "IL-240915-07": {co2: { label: 'CO₂', unit: 'g/L', min: 6.8, target: 7.0, max: 7.2 }, brix: { label: 'Brix', unit: '°Bx', min: 0, target: 0, max: 0.5 }, ph: { label: 'pH', unit: '', min: 2.4, target: 2.5, max: 2.6 }, densidade: { label: 'Densidade', unit: 'g/cm³', min: 1.001, target: 1.002, max: 1.003 }},
  "IL-240915-11": {co2: { label: 'CO₂', unit: 'g/L', min: 5.8, target: 6.0, max: 6.2 }, brix: { label: 'Brix', unit: '°Bx', min: 11.8, target: 12.0, max: 12.2 }, ph: { label: 'pH', unit: '', min: 3.1, target: 3.2, max: 3.3 }, densidade: { label: 'Densidade', unit: 'g/cm³', min: 1.045, target: 1.047, max: 1.049 }},
  "IL-240916-03": {co2: { label: 'CO₂', unit: 'g/L', min: 0, target: 0, max: 0 }, brix: { label: 'Brix', unit: '°Bx', min: 7.8, target: 8.0, max: 8.2 }, ph: { label: 'pH', unit: '', min: 3.4, target: 3.5, max: 3.6 }, densidade: { label: 'Densidade', unit: 'g/cm³', min: 1.029, target: 1.030, max: 1.031 }},
  "IL-240916-05": {co2: { label: 'CO₂', unit: 'g/L', min: 4.8, target: 5.0, max: 5.2 }, brix: { label: 'Brix', unit: '°Bx', min: 9.8, target: 10.0, max: 10.2 }, ph: { label: 'pH', unit: '', min: 2.8, target: 2.9, max: 3.0 }, densidade: { label: 'Densidade', unit: 'g/cm³', min: 1.038, target: 1.040, max: 1.042 }},
} as const;

type ProductKey = keyof typeof productSpecs;
type ProductSpec = (typeof productSpecs)[ProductKey];
type SpecKey = keyof ProductSpec;

const schema = z.object({
  lotePai: z.string().min(1, "Selecione o lote de produção."),
  loteIntermedio: z.string().min(1, "Selecione o produto intermédio."),
  linha: z.string().min(1, "Selecione a linha."),
  dataAnalise: z.string().min(1, "A data é obrigatória."),
  assinatura: z.string().min(3, "A assinatura é obrigatória."),
  co2: z.coerce.number(), brix: z.coerce.number(), ph: z.coerce.number(), densidade: z.coerce.number(),
});
type FormValues = z.infer<typeof schema>;

export default function CreateFinishedLotPage() {
  const [activeSpec, setActiveSpec] = useState<ProductSpec | null>(null);
  const [availableIntermediateLots, setAvailableIntermediateLots] = useState(intermediateLotMap["PL-240915-A"]);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { lotePai: "PL-240915-A", loteIntermedio: "", linha: "linha-pet-2", dataAnalise: new Date().toISOString().slice(0,16), assinatura: "" }});
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid }, watch, setValue } = form;
  const [lotePaiValue, loteIntermedioValue] = watch(["lotePai", "loteIntermedio"]);

  useEffect(() => {
    const intermediateLots = intermediateLotMap[lotePaiValue as keyof typeof intermediateLotMap] || [];
    setAvailableIntermediateLots(intermediateLots);
    setValue("loteIntermedio", "");
    setActiveSpec(null);
  }, [lotePaiValue, setValue]);

  useEffect(() => {
    if (loteIntermedioValue && productSpecs[loteIntermedioValue as ProductKey]) {
      const newSpec = productSpecs[loteIntermedioValue as ProductKey];
      setActiveSpec(newSpec);
      Object.entries(newSpec).forEach(([key, value]) => {
          setValue(key as SpecKey, value.target);
      });
    }
  }, [loteIntermedioValue, setValue]);

  async function onSubmit(values: FormValues) { await Promise.resolve(values); }
  const formDisabled = availableIntermediateLots.length === 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Produtos Acabados » Registar</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Registar Análise de Produto Acabado</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild><Link href="/finished-lots">Cancelar</Link></Button>
            <Button type="submit" variant="primary" disabled={!isValid || isSubmitting}>{isSubmitting ? "A registar..." : "Registar Análise"}</Button>
          </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-slate-900 bg-slate-950/70">
            <CardHeader><CardTitle>Rastreabilidade</CardTitle><CardDescription>Selecione o Lote de Produção (Pai) para carregar os produtos intermédios.</CardDescription></CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2"><Label>Lote de Produção (Pai)</Label><Select {...register("lotePai")}>{productionLots.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></div>
              <div className="space-y-2"><Label>Produto Intermédio</Label><Select {...register("loteIntermedio")} disabled={formDisabled}><option value="">Selecione...</option>{availableIntermediateLots.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></div>
            </CardContent>
            {formDisabled && <CardFooter><Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Atenção</AlertTitle><AlertDescription>Este lote de produção não tem produtos intermédios. Não é possível continuar.</AlertDescription></Alert></CardFooter>}
          </Card>

          <fieldset className="space-y-8" disabled={formDisabled || !loteIntermedioValue}>
            <Card className="border-slate-900/80 bg-slate-950/70">
                <CardHeader><CardTitle>Formulário de Análise</CardTitle><CardDescription>Preencha os dados laboratoriais para o lote.</CardDescription></CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2"><Label>Linha de Produção</Label><Select {...register("linha")}>{lineOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</Select></div>
                    <div className="space-y-2"><Label>Data e Hora da Análise</Label><Input type="datetime-local" {...register("dataAnalise")} /></div>
                    {(Object.keys(productSpecs['IL-240915-11']) as SpecKey[]).map(key => <div key={key} className="space-y-2"><Label>{productSpecs['IL-240915-11'][key].label}</Label><Input type="number" step="0.01" {...register(key)} /></div>)}
                    <div className="space-y-2 md:col-span-2"><Label>Assinatura do Analista</Label><Input {...register("assinatura")} /></div>
                </CardContent>
            </Card>
          </fieldset>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-900/70">
            <CardHeader><CardTitle>Janela de Especificação</CardTitle><CardDescription>Limites para o produto selecionado.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              {activeSpec ? (Object.keys(activeSpec) as SpecKey[]).map(key => {
                  const spec = activeSpec[key];
                  const value = watch(key);
                  const status = !Number.isFinite(value) ? 'neutral' : (value >= spec.min && value <= spec.max ? 'success' : 'danger');
                  return (
                    <div key={key} className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-3">
                        <div className="flex items-center justify-between"><p className="text-sm text-slate-400">{spec.label}</p><Badge variant={status}>{status === 'success' ? 'OK' : status === 'danger' ? 'Fora' : 'Pendente'}</Badge></div>
                        <p className="text-xs text-slate-500">{`Min: ${spec.min} · Max: ${spec.max} (${spec.unit})`}</p>
                    </div>
                  )
              }) : <p className="text-sm text-slate-500">Selecione um produto intermédio para ver as especificações.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
