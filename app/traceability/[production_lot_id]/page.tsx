"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, Boxes, Factory, PackageCheck, AlertTriangle, ShieldCheck, LucideIcon } from "lucide-react";

const timelineData = {
  "PL-240915-11": {
    product: "Guaraná 2L",
    status: "Liberado",
    events: [
      { id: 1, type: "Matéria-Prima", title: "Recebimento de Açúcar VHP", description: "Lote: RM-ACUC-4412", timestamp: "2024-09-15 07:20", icon: FlaskConical, status: "Liberado" },
      { id: 2, type: "Matéria-Prima", title: "Recebimento de CO₂", description: "Lote: RM-CO2-982", timestamp: "2024-09-15 07:25", icon: FlaskConical, status: "Liberado" },
      { id: 3, type: "Produto Intermédio", title: "Preparação do Xarope", description: "Lote: INT-240915-05 · Tanque 03", timestamp: "2024-09-15 09:50", icon: Boxes, status: "Ok" },
      { id: 4, type: "Produto Acabado", title: "Envase do Lote", description: "Lote: PF-240915-09 · Linha PET 2", timestamp: "2024-09-15 10:55", icon: PackageCheck, status: "Aprovado" },
      { id: 5, type: "Não Conformidade", title: "NC Aberta: Baixa Carbonatação", description: "Código: NC-4826", timestamp: "2024-09-15 11:05", icon: AlertTriangle, status: "Em análise" },
      { id: 6, type: "PCC", title: "Verificação de Pasteurização", description: "Ponto Crítico de Controlo 12", timestamp: "2024-09-15 11:30", icon: ShieldCheck, status: "Controlado" },
    ],
  }
};

const iconMap: { [key: string]: { icon: LucideIcon, color: string } } = {
    "Matéria-Prima": { icon: FlaskConical, color: "bg-sky-500" },
    "Produto Intermédio": { icon: Boxes, color: "bg-amber-500" },
    "Produto Acabado": { icon: PackageCheck, color: "bg-emerald-500" },
    "Não Conformidade": { icon: AlertTriangle, color: "bg-red-500" },
    "PCC": { icon: ShieldCheck, color: "bg-blue-500" },
}

export default function TraceabilityDetailPage({ params }: { params: { production_lot_id: string } }) {
  const record = timelineData[params.production_lot_id as keyof typeof timelineData];
  if (!record) notFound();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Rastreabilidade · {params.production_lot_id}</p>
          <h1 className="text-3xl font-semibold text-white">{record.product}</h1>
        </div>
        <Badge variant={record.status === "Liberado" ? "success" : "danger"}>{record.status}</Badge>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Timeline de Rastreabilidade Vertical</CardTitle>
          <CardDescription>Eventos do lote desde a matéria-prima até ao produto acabado.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-6">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800" />
            {record.events.map((event, index) => {
              const Icon = iconMap[event.type].icon;
              const color = iconMap[event.type].color;
              return (
                <div key={event.id} className="relative mb-8 pl-8">
                  <div className={`absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full ${color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs text-slate-500">{event.timestamp}</p>
                  <p className="font-semibold text-white">{event.title}</p>
                  <p className="text-sm text-slate-400">{event.description}</p>
                  <Badge variant="outline" className="mt-1">{event.status}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
