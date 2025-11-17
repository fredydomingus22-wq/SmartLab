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
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const moduleContent = {
  prp: {
    title: "PRP",
    description: "Pré-requisitos essenciais para infra, higiene e suporte.",
    metrics: [
      { label: "Programas ativos", value: "18", helper: "+2 este mês" },
      { label: "Pendências", value: "3", helper: "Auditar esta semana" },
      { label: "Última revisão", value: "02 Set", helper: "QA Manager" },
    ],
    checkpoints: [
      {
        id: "PRP-01",
        item: "Higienização CIP",
        limit: "Alcalino 1.5%",
        owner: "Saneamento",
        status: "Conforme",
        variant: "success" as const,
      },
      {
        id: "PRP-05",
        item: "Controle de pragas",
        limit: "Sem evidências",
        owner: "Facilities",
        status: "Atenção",
        variant: "warning" as const,
      },
      {
        id: "PRP-07",
        item: "Calibração balanças",
        limit: "±1 g",
        owner: "Manutenção",
        status: "Atrasado",
        variant: "danger" as const,
      },
    ],
    history: [
      { timestamp: "08:00", detail: "Checklist sanitização concluído", owner: "QA" },
      { timestamp: "09:20", detail: "Anexo COA químicos", owner: "Fornecedor" },
      { timestamp: "11:10", detail: "Auditoria interna", owner: "Food Safety" },
    ],
  },
  oprp: {
    title: "OPRP",
    description: "Controles operacionais vinculados aos parâmetros críticos de processo.",
    metrics: [
      { label: "Pontos monitorados", value: "9", helper: "3 por linha" },
      { label: "Desvios 72h", value: "1", helper: "Linha PET 2" },
      { label: "Última calibração", value: "05 Set", helper: "Metrologia" },
    ],
    checkpoints: [
      {
        id: "OPRP-02",
        item: "Temperatura xarope",
        limit: "65±2 ºC",
        owner: "PCP",
        status: "Conforme",
        variant: "success" as const,
      },
      {
        id: "OPRP-04",
        item: "Filtro carbono",
        limit: "ΔP < 1 bar",
        owner: "Utilidades",
        status: "Manutenção",
        variant: "warning" as const,
      },
    ],
    history: [
      { timestamp: "07:15", detail: "Checklist turno manhã", owner: "Supervisor" },
      { timestamp: "10:30", detail: "Ajuste temperatura linha lata", owner: "Operação" },
    ],
  },
  pcc: {
    title: "PCC",
    description: "Pontos críticos com limite superior/inferior e reação imediata.",
    metrics: [
      { label: "PCC ativos", value: "6", helper: "2 críticos" },
      { label: "Alarmes hoje", value: "1", helper: "Metal detector" },
      { label: "Liberação pendente", value: "2", helper: "Envase vidro" },
    ],
    checkpoints: [
      {
        id: "PCC-10",
        item: "Pasteurização",
        limit: "≥ 80 ºC",
        owner: "Qualidade",
        status: "Monitorar",
        variant: "warning" as const,
      },
      {
        id: "PCC-12",
        item: "CO₂ final",
        limit: "6.2±0.2 g/L",
        owner: "Laboratório",
        status: "OK",
        variant: "success" as const,
      },
      {
        id: "PCC-14",
        item: "Metal detector",
        limit: "Sensibilidade 2.0 mm",
        owner: "Produção",
        status: "Crítico",
        variant: "danger" as const,
      },
    ],
    history: [
      { timestamp: "06:40", detail: "Teste de verificação aprovado", owner: "Operação" },
      { timestamp: "09:55", detail: "Alarme metal detector", owner: "Linha Vidro" },
      { timestamp: "10:05", detail: "Desvio registrado NC-4826", owner: "QA" },
    ],
  },
} as const;

type ModuleKey = keyof typeof moduleContent;

interface ModulePageProps {
  params: { module: string };
}

export default function FoodSafetyModulePage({ params }: ModulePageProps) {
  const moduleKey = params.module.toLowerCase() as ModuleKey;
  const moduleData = moduleContent[moduleKey];

  if (!moduleData) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-white">Módulo não encontrado</h1>
        <p className="text-slate-400">
          Utilize os atalhos em Food Safety para acessar PRP, OPRP ou PCC.
        </p>
        <Button variant="secondary" asChild>
          <Link href="/food-safety">Voltar para Food Safety</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Food Safety · {moduleData.title}</p>
          <h1 className="text-3xl font-semibold text-white">{moduleData.description}</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild>
            <Link href="/food-safety">Visão geral</Link>
          </Button>
          <Button variant="primary">Registrar ocorrência</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {moduleData.metrics.map((metric) => (
          <Card
            key={metric.label}
            className="border-slate-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 shadow-xl shadow-slate-950/40"
          >
            <CardHeader className="p-0">
              <CardDescription className="text-xs uppercase tracking-[0.25em] text-slate-500">
                {metric.label}
              </CardDescription>
              <CardTitle className="text-3xl text-white">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2 text-sm text-slate-400">{metric.helper}</CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Checkpoints monitorados</CardTitle>
              <CardDescription>Limites, responsáveis e status atual</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Exportar lista
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Ponto</TableHead>
                  <TableHead>Limite</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {moduleData.checkpoints.map((checkpoint) => (
                  <TableRow key={checkpoint.id}>
                    <TableCell className="font-semibold text-white">{checkpoint.id}</TableCell>
                    <TableCell className="text-slate-300">{checkpoint.item}</TableCell>
                    <TableCell className="text-slate-400">{checkpoint.limit}</TableCell>
                    <TableCell className="text-slate-400">{checkpoint.owner}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={checkpoint.variant}>{checkpoint.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-900 bg-slate-950/70">
          <CardHeader>
            <CardTitle>Linha do tempo</CardTitle>
            <CardDescription>Eventos recentes reportados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {moduleData.history.map((event) => (
              <div key={event.timestamp} className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">{event.detail}</p>
                  <p className="text-xs text-slate-500">
                    {event.timestamp} · {event.owner}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-900 bg-slate-950/60">
        <CardHeader>
          <CardTitle>Plano de ação imediato</CardTitle>
          <CardDescription>Atualize responsáveis e prazos</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="owner">Responsável designado</Label>
            <Button id="owner" variant="secondary" className="justify-start">
              Selecionar colaborador
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo</Label>
            <Button id="deadline" variant="ghost" className="justify-start border border-slate-800">
              Definir data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
