"use client";

import Link from "next/link";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  {
    id: "d1",
    label: "D1",
    title: "Equipe",
    status: "Concluído",
    variant: "success" as const,
    fields: [
      { id: "team", label: "Equipe responsável", placeholder: "QA, Produção...", value: "QA Manager, Supervisor" },
    ],
  },
  {
    id: "d2",
    label: "D2",
    title: "Descrição",
    status: "Em progresso",
    variant: "warning" as const,
    fields: [
      { id: "descr", label: "Resumo do problema", placeholder: "Detalhe o desvio", value: "Alarme metal detector PCC-14" },
    ],
  },
  {
    id: "d3",
    label: "D3",
    title: "Contenção",
    status: "Pendente",
    variant: "danger" as const,
    fields: [
      { id: "contain", label: "Ação imediata", placeholder: "Bloqueio, segregação", value: "Bloqueio PF-240915-21" },
    ],
  },
  { id: "d4", label: "D4", title: "Causa raiz", status: "Pendente", variant: "danger" as const, fields: [] },
  { id: "d5", label: "D5", title: "Ações permanentes", status: "Pendente", variant: "warning" as const, fields: [] },
  { id: "d6", label: "D6", title: "Implementação", status: "Pendente", variant: "warning" as const, fields: [] },
  { id: "d7", label: "D7", title: "Prevenção", status: "Pendente", variant: "warning" as const, fields: [] },
  { id: "d8", label: "D8", title: "Reconhecimento", status: "Pendente", variant: "warning" as const, fields: [] },
];

interface EightDPageProps {
  params: { nc_id: string };
}

export default function EightDPage({ params }: EightDPageProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">8D · {params.nc_id}</p>
          <h1 className="text-3xl font-semibold text-white">Plano 8D</h1>
          <p className="text-slate-400">Acompanhe o progresso das disciplinas e ações derivadas.</p>
        </div>
        <Button variant="ghost" asChild>
          <Link href={`/nc/${params.nc_id}`}>Voltar para NC</Link>
        </Button>
      </div>

      <Card className="border-slate-900 bg-slate-950/70">
        <CardHeader>
          <CardTitle>Disciplinas D1–D8</CardTitle>
          <CardDescription>Atualize cada disciplina com o status correto</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="d1">
            <TabsList className="flex-wrap">
              {steps.map((step) => (
                <TabsTrigger key={step.id} value={step.id} className="flex-1 min-w-[70px]">
                  <span className="flex items-center justify-between gap-2">
                    {step.label}
                    <Badge variant={step.variant}>{step.status}</Badge>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            {steps.map((step) => (
              <TabsContent key={step.id} value={step.id} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-400">Atualize os campos abaixo</p>
                </div>
                {step.fields.length === 0 ? (
                  <p className="text-sm text-slate-500">Nenhum campo configurado para esta disciplina.</p>
                ) : (
                  <div className="space-y-4">
                    {step.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={`${step.id}-${field.id}`}>{field.label}</Label>
                        {field.id === "descr" || field.id === "contain" ? (
                          <Textarea
                            id={`${step.id}-${field.id}`}
                            defaultValue={field.value}
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <Input
                            id={`${step.id}-${field.id}`}
                            defaultValue={field.value}
                            placeholder={field.placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <Button variant="ghost">Salvar rascunho</Button>
                  <Button variant="primary">Marcar como concluído</Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
